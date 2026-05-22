"""DCMS backend API tests - covers auth, enquiries, cases, documents, admin, role enforcement."""
import os
import io
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if "REACT_APP_BACKEND_URL" in os.environ else None
if not BASE_URL:
    # fall back to reading frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@dcms.in"
ADMIN_PASSWORD = "Admin@12345"


# --- Fixtures ---
@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    assert r.json().get("role") == "admin"
    return s


@pytest.fixture(scope="module")
def client_user():
    s = requests.Session()
    email = f"test_{uuid.uuid4().hex[:10]}@example.com"
    password = "Client@12345"
    r = s.post(f"{API}/auth/register", json={
        "email": email, "password": password, "name": "Test Client", "phone": "9999999999"
    }, timeout=30)
    assert r.status_code == 200, f"Register failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["email"] == email
    assert data["role"] == "client"
    return {"session": s, "email": email, "password": password, "id": data["id"]}


@pytest.fixture(scope="module")
def second_client_user():
    s = requests.Session()
    email = f"test_{uuid.uuid4().hex[:10]}@example.com"
    r = s.post(f"{API}/auth/register", json={
        "email": email, "password": "Client@12345", "name": "Second Client", "phone": "8888888888"
    }, timeout=30)
    assert r.status_code == 200
    return {"session": s, "email": email}


# --- Health ---
def test_health():
    r = requests.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# --- Auth ---
class TestAuth:
    def test_me_with_client(self, client_user):
        r = client_user["session"].get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == client_user["email"]
        assert data["role"] == "client"

    def test_me_unauth(self):
        r = requests.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 401

    def test_register_duplicate(self, client_user):
        r = requests.post(f"{API}/auth/register", json={
            "email": client_user["email"], "password": "Client@12345", "name": "Dup"
        }, timeout=30)
        assert r.status_code == 400

    def test_login_invalid(self):
        r = requests.post(f"{API}/auth/login", json={
            "email": f"nope_{uuid.uuid4().hex[:6]}@ex.com", "password": "wrong"
        }, timeout=30)
        assert r.status_code == 401

    def test_admin_login_role(self, admin_session):
        r = admin_session.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 200
        assert r.json()["role"] == "admin"

    def test_logout(self, client_user):
        # fresh session so we don't affect other tests
        s = requests.Session()
        s.post(f"{API}/auth/login", json={"email": client_user["email"], "password": client_user["password"]}, timeout=30)
        r = s.post(f"{API}/auth/logout", timeout=30)
        assert r.status_code == 200
        # cookie should be cleared
        r2 = s.get(f"{API}/auth/me", timeout=30)
        assert r2.status_code == 401


# --- Enquiries (public) ---
class TestEnquiries:
    def test_create_enquiry(self):
        r = requests.post(f"{API}/enquiries", json={
            "name": "TEST Enquirer", "email": f"enq_{uuid.uuid4().hex[:6]}@ex.com",
            "phone": "9999999999", "service_type": "COURT_MARRIAGE",
            "message": "Please help with registration"
        }, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data
        assert data["status"] == "new"


# --- Cases ---
class TestCases:
    def test_create_case(self, client_user):
        r = client_user["session"].post(f"{API}/cases", json={
            "service_type": "COURT_MARRIAGE",
            "partner1_name": "Alice", "partner2_name": "Bob",
            "contact_phone": "9999999999", "address": "Delhi",
            "notes": "Test case"
        }, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["stage"] == "APPLIED"
        assert data["reference"].startswith("DCMS-")
        assert len(data["timeline"]) == 1
        assert data["timeline"][0]["stage"] == "APPLIED"
        client_user["case_id"] = data["id"]
        client_user["reference"] = data["reference"]

    def test_create_case_invalid_service(self, client_user):
        r = client_user["session"].post(f"{API}/cases", json={
            "service_type": "INVALID",
            "partner1_name": "A", "partner2_name": "B",
            "contact_phone": "9", "address": "Delhi"
        }, timeout=30)
        assert r.status_code == 400

    def test_create_case_unauth(self):
        r = requests.post(f"{API}/cases", json={
            "service_type": "COURT_MARRIAGE", "partner1_name": "A", "partner2_name": "B",
            "contact_phone": "9", "address": "Delhi"
        }, timeout=30)
        assert r.status_code == 401

    def test_list_my_cases(self, client_user):
        r = client_user["session"].get(f"{API}/cases", timeout=30)
        assert r.status_code == 200
        cases = r.json()
        assert isinstance(cases, list) and len(cases) >= 1
        assert any(c["id"] == client_user["case_id"] for c in cases)

    def test_get_case_owner(self, client_user):
        r = client_user["session"].get(f"{API}/cases/{client_user['case_id']}", timeout=30)
        assert r.status_code == 200
        assert r.json()["id"] == client_user["case_id"]

    def test_get_case_other_user_forbidden(self, client_user, second_client_user):
        r = second_client_user["session"].get(f"{API}/cases/{client_user['case_id']}", timeout=30)
        assert r.status_code == 403

    def test_get_case_admin_access(self, client_user, admin_session):
        r = admin_session.get(f"{API}/cases/{client_user['case_id']}", timeout=30)
        assert r.status_code == 200


# --- Documents ---
class TestDocuments:
    def test_upload_document(self, client_user):
        case_id = client_user["case_id"]
        files = {"file": ("test.txt", io.BytesIO(b"hello doc content"), "text/plain")}
        data = {"doc_type": "ID_PROOF"}
        r = client_user["session"].post(f"{API}/cases/{case_id}/documents", files=files, data=data, timeout=30)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["doc_type"] == "ID_PROOF"
        assert body["size"] > 0
        client_user["doc_id"] = body["id"]

    def test_list_documents(self, client_user):
        case_id = client_user["case_id"]
        r = client_user["session"].get(f"{API}/cases/{case_id}/documents", timeout=30)
        assert r.status_code == 200
        docs = r.json()
        assert any(d["id"] == client_user["doc_id"] for d in docs)

    def test_download_document(self, client_user):
        r = client_user["session"].get(f"{API}/documents/{client_user['doc_id']}/download", timeout=30)
        assert r.status_code == 200
        assert b"hello doc content" in r.content

    def test_document_access_denied_other_user(self, client_user, second_client_user):
        r = second_client_user["session"].get(f"{API}/documents/{client_user['doc_id']}/download", timeout=30)
        assert r.status_code == 403


# --- Admin ---
class TestAdmin:
    def test_admin_list_cases(self, admin_session):
        r = admin_session.get(f"{API}/admin/cases", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_stats(self, admin_session):
        r = admin_session.get(f"{API}/admin/stats", timeout=30)
        assert r.status_code == 200
        data = r.json()
        for k in ["total_cases", "total_users", "total_enquiries", "new_enquiries", "by_stage"]:
            assert k in data
        assert "APPLIED" in data["by_stage"]

    def test_admin_list_enquiries(self, admin_session):
        r = admin_session.get(f"{API}/admin/enquiries", timeout=30)
        assert r.status_code == 200

    def test_admin_update_stage_and_timeline(self, admin_session, client_user):
        case_id = client_user["case_id"]
        r = admin_session.patch(f"{API}/admin/cases/{case_id}/stage", json={
            "stage": "VERIFICATION", "note": "Docs being verified"
        }, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["stage"] == "VERIFICATION"
        assert len(data["timeline"]) >= 2
        assert data["timeline"][-1]["stage"] == "VERIFICATION"
        # Client sees updated timeline
        r2 = client_user["session"].get(f"{API}/cases/{case_id}", timeout=30)
        assert r2.status_code == 200
        assert r2.json()["stage"] == "VERIFICATION"

    def test_admin_update_stage_invalid(self, admin_session, client_user):
        r = admin_session.patch(f"{API}/admin/cases/{client_user['case_id']}/stage", json={
            "stage": "INVALID_STAGE"
        }, timeout=30)
        assert r.status_code == 400


# --- Role enforcement ---
class TestRoleEnforcement:
    def test_non_admin_blocked_admin_cases(self, client_user):
        r = client_user["session"].get(f"{API}/admin/cases", timeout=30)
        assert r.status_code == 403

    def test_non_admin_blocked_admin_stats(self, client_user):
        r = client_user["session"].get(f"{API}/admin/stats", timeout=30)
        assert r.status_code == 403

    def test_non_admin_blocked_admin_enquiries(self, client_user):
        r = client_user["session"].get(f"{API}/admin/enquiries", timeout=30)
        assert r.status_code == 403

    def test_unauth_blocked_admin(self):
        r = requests.get(f"{API}/admin/cases", timeout=30)
        assert r.status_code == 401
