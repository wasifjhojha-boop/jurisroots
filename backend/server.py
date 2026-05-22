from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import shutil
import secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from bson import ObjectId
from fastapi import (
    FastAPI,
    APIRouter,
    HTTPException,
    Depends,
    Request,
    Response,
    UploadFile,
    File,
    Form,
    status,
)
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ---------------------------------------------------------------------------
# Configuration & Constants
# ---------------------------------------------------------------------------

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", "/app/backend/uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7
LOGIN_LOCKOUT_ATTEMPTS = 5
LOGIN_LOCKOUT_MINUTES = 15

OTP_LENGTH = int(os.environ.get("OTP_LENGTH", "6"))
OTP_TTL_MINUTES = int(os.environ.get("OTP_TTL_MINUTES", "10"))
MOCK_SMS = os.environ.get("MOCK_SMS", "true").lower() == "true"
ADMIN_PHONE = os.environ.get("ADMIN_PHONE", "")

CASE_STAGES = [
    "APPLIED",
    "VERIFICATION",
    "NOTICE",
    "REGISTRATION",
    "CERTIFICATE_ISSUED",
]

SERVICE_TYPES = [
    "COURT_MARRIAGE",
    "MARRIAGE_CERTIFICATE",
    "SPECIAL_MARRIAGE_ACT",
    "HINDU_MARRIAGE_ACT",
    "TATKAL_REGISTRATION",
    "NRI_MARRIAGE",
    "LEGAL_DOCUMENTATION",
]

# ---------------------------------------------------------------------------
# MongoDB
# ---------------------------------------------------------------------------

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ---------------------------------------------------------------------------
# Password + JWT helpers
# ---------------------------------------------------------------------------


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "exp": datetime.now(timezone.utc)
        + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: str
    created_at: datetime


class RegisterInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=2)
    phone: Optional[str] = None


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class EnquiryInput(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    phone: str = Field(min_length=5)
    service_type: Optional[str] = None
    message: str = Field(min_length=5)


class EnquiryOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    service_type: Optional[str] = None
    message: str
    status: str
    created_at: datetime


class CaseCreateInput(BaseModel):
    service_type: str
    partner1_name: str
    partner2_name: str
    partner1_dob: Optional[str] = None
    partner2_dob: Optional[str] = None
    marriage_date: Optional[str] = None
    contact_phone: str
    address: str
    notes: Optional[str] = ""


class TimelineEvent(BaseModel):
    stage: str
    note: str
    at: datetime


class DocumentOut(BaseModel):
    id: str
    case_id: str
    filename: str
    original_name: str
    doc_type: str
    size: int
    uploaded_at: datetime


class CaseOut(BaseModel):
    id: str
    reference: str
    user_id: str
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    service_type: str
    partner1_name: str
    partner2_name: str
    partner1_dob: Optional[str] = None
    partner2_dob: Optional[str] = None
    marriage_date: Optional[str] = None
    contact_phone: str
    address: str
    notes: Optional[str] = ""
    stage: str
    timeline: List[TimelineEvent] = []
    created_at: datetime
    updated_at: datetime


class CaseStageUpdate(BaseModel):
    stage: str
    note: Optional[str] = ""


class EnquiryStatusUpdate(BaseModel):
    status: str


# ---------------------------------------------------------------------------
# Auth dependency
# ---------------------------------------------------------------------------


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    try:
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid user id")
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    user["id"] = str(user.pop("_id"))
    user.pop("password_hash", None)
    return user


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------------------------------------------------------------------------
# Utility
# ---------------------------------------------------------------------------


def serialize_case(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    doc["user_id"] = str(doc.get("user_id"))
    return doc


def user_public(user_doc: dict) -> dict:
    return {
        "id": str(user_doc["_id"]),
        "email": user_doc["email"],
        "name": user_doc.get("name", ""),
        "phone": user_doc.get("phone"),
        "role": user_doc.get("role", "client"),
        "created_at": user_doc.get("created_at", datetime.now(timezone.utc)),
    }


def generate_reference() -> str:
    return "DCMS-" + datetime.now(timezone.utc).strftime("%Y%m") + "-" + secrets.token_hex(3).upper()


# ---------------------------------------------------------------------------
# FastAPI app + router
# ---------------------------------------------------------------------------

app = FastAPI(title="Delhi Court Marriage Services API")
api_router = APIRouter(prefix="/api")

# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@api_router.get("/")
async def root():
    return {"service": "DCMS API", "status": "ok"}


# ---------------------------------------------------------------------------
# Auth endpoints
# ---------------------------------------------------------------------------


async def is_locked_out(identifier: str) -> bool:
    now = datetime.now(timezone.utc)
    record = await db.login_attempts.find_one({"identifier": identifier})
    if not record:
        return False
    if record.get("locked_until") and record["locked_until"] > now:
        return True
    return False


async def record_failed_login(identifier: str):
    now = datetime.now(timezone.utc)
    record = await db.login_attempts.find_one({"identifier": identifier})
    attempts = (record.get("attempts", 0) if record else 0) + 1
    update = {"attempts": attempts, "last_attempt": now}
    if attempts >= LOGIN_LOCKOUT_ATTEMPTS:
        update["locked_until"] = now + timedelta(minutes=LOGIN_LOCKOUT_MINUTES)
        update["attempts"] = 0
    await db.login_attempts.update_one(
        {"identifier": identifier}, {"$set": update}, upsert=True
    )


async def clear_login_attempts(identifier: str):
    await db.login_attempts.delete_one({"identifier": identifier})


@api_router.post("/auth/register")
async def register(body: RegisterInput, response: Response):
    email = body.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    now = datetime.now(timezone.utc)
    doc = {
        "email": email,
        "name": body.name.strip(),
        "phone": body.phone,
        "password_hash": hash_password(body.password),
        "role": "client",
        "created_at": now,
    }
    result = await db.users.insert_one(doc)
    user_id = str(result.inserted_id)
    access = create_access_token(user_id, email, "client")
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return {
        "id": user_id,
        "email": email,
        "name": body.name,
        "phone": body.phone,
        "role": "client",
        "created_at": now,
    }


@api_router.post("/auth/login")
async def login(body: LoginInput, request: Request, response: Response):
    email = body.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    if await is_locked_out(identifier):
        raise HTTPException(
            status_code=429,
            detail="Too many failed attempts. Try again in 15 minutes.",
        )
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await record_failed_login(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await clear_login_attempts(identifier)
    user_id = str(user["_id"])
    access = create_access_token(user_id, email, user.get("role", "client"))
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return user_public(user)


@api_router.post("/auth/logout")
async def logout(response: Response, user: dict = Depends(get_current_user)):
    clear_auth_cookies(response)
    return {"ok": True}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "phone": user.get("phone"),
        "role": user.get("role", "client"),
        "created_at": user.get("created_at"),
    }


@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access = create_access_token(
        str(user["_id"]), user["email"], user.get("role", "client")
    )
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return {"ok": True}



# ---------------------------------------------------------------------------
# OTP Login (phone-based, SMS)
# ---------------------------------------------------------------------------


def normalize_phone(raw: str) -> Optional[str]:
    """Normalise to +91XXXXXXXXXX. Returns None if invalid."""
    if not raw:
        return None
    digits = "".join(ch for ch in raw if ch.isdigit())
    if len(digits) == 10:
        return "+91" + digits
    if len(digits) == 12 and digits.startswith("91"):
        return "+" + digits
    if len(digits) == 11 and digits.startswith("0"):
        return "+91" + digits[1:]
    if len(digits) >= 10 and len(digits) <= 15:
        return "+" + digits
    return None


def generate_otp() -> str:
    return "".join(str(secrets.randbelow(10)) for _ in range(OTP_LENGTH))


async def send_sms_otp(phone: str, otp: str) -> bool:
    """MOCKED SMS sender. Replace this function with real provider (Twilio/MSG91) later.

    To integrate Twilio:
        from twilio.rest import Client
        client = Client(os.environ['TWILIO_SID'], os.environ['TWILIO_TOKEN'])
        client.messages.create(from_=..., to=phone, body=f"Your OTP is {otp}")
    """
    logger.info("[MOCK SMS] OTP for %s = %s (delete this log when going live)", phone, otp)
    return True


class OTPRequestInput(BaseModel):
    phone: str = Field(min_length=8, max_length=20)


class OTPVerifyInput(BaseModel):
    phone: str = Field(min_length=8, max_length=20)
    otp: str = Field(min_length=4, max_length=8)


@api_router.post("/auth/otp/request")
async def otp_request(body: OTPRequestInput):
    phone = normalize_phone(body.phone)
    if not phone:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    # Rate-limit: max 5 OTP requests per phone per hour
    now = datetime.now(timezone.utc)
    one_hour_ago = now - timedelta(hours=1)
    recent_count = await db.otp_codes.count_documents(
        {"phone": phone, "created_at": {"$gte": one_hour_ago}}
    )
    if recent_count >= 5:
        raise HTTPException(
            status_code=429,
            detail="Too many OTP requests. Try again in an hour.",
        )

    otp = generate_otp()
    otp_hash = hash_password(otp)
    expires_at = now + timedelta(minutes=OTP_TTL_MINUTES)

    await db.otp_codes.insert_one(
        {
            "phone": phone,
            "otp_hash": otp_hash,
            "created_at": now,
            "expires_at": expires_at,
            "used": False,
            "attempts": 0,
        }
    )
    await send_sms_otp(phone, otp)

    response = {
        "ok": True,
        "phone": phone,
        "expires_in_minutes": OTP_TTL_MINUTES,
        "mock_sms": MOCK_SMS,
    }
    if MOCK_SMS:
        # Return OTP only in mock mode for testing. Remove when SMS is wired.
        response["dev_otp"] = otp
    return response


@api_router.post("/auth/otp/verify")
async def otp_verify(body: OTPVerifyInput, response: Response):
    phone = normalize_phone(body.phone)
    if not phone:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    now = datetime.now(timezone.utc)
    record = await db.otp_codes.find_one(
        {"phone": phone, "used": False, "expires_at": {"$gte": now}},
        sort=[("created_at", -1)],
    )
    if not record:
        raise HTTPException(status_code=400, detail="OTP expired or not found. Request a new one.")

    if record.get("attempts", 0) >= 5:
        await db.otp_codes.update_one({"_id": record["_id"]}, {"$set": {"used": True}})
        raise HTTPException(status_code=429, detail="Too many incorrect attempts. Request a new OTP.")

    if not verify_password(body.otp, record["otp_hash"]):
        await db.otp_codes.update_one(
            {"_id": record["_id"]}, {"$inc": {"attempts": 1}}
        )
        raise HTTPException(status_code=400, detail="Incorrect OTP")

    # Mark OTP used
    await db.otp_codes.update_one({"_id": record["_id"]}, {"$set": {"used": True}})

    # Find or create user
    user = await db.users.find_one({"phone": phone})
    role = "admin" if ADMIN_PHONE and phone == normalize_phone(ADMIN_PHONE) else "client"
    if user is None:
        result = await db.users.insert_one(
            {
                "email": f"{phone.replace('+', '')}@phone.dcms.in",
                "phone": phone,
                "name": "Client",
                "role": role,
                "password_hash": hash_password(secrets.token_urlsafe(16)),
                "auth_method": "otp",
                "created_at": now,
            }
        )
        user = await db.users.find_one({"_id": result.inserted_id})
    else:
        # Ensure admin role is upgraded if phone matches ADMIN_PHONE
        if user.get("role") != role and role == "admin":
            await db.users.update_one({"_id": user["_id"]}, {"$set": {"role": "admin"}})
            user["role"] = "admin"

    user_id = str(user["_id"])
    access = create_access_token(user_id, user.get("email", ""), user.get("role", "client"))
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return {
        "id": user_id,
        "email": user.get("email", ""),
        "phone": user.get("phone"),
        "name": user.get("name", ""),
        "role": user.get("role", "client"),
        "created_at": user.get("created_at"),
    }


# ---------------------------------------------------------------------------
# Public enquiry (contact form)
# ---------------------------------------------------------------------------


@api_router.post("/enquiries")
async def create_enquiry(body: EnquiryInput):
    now = datetime.now(timezone.utc)
    doc = {
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "phone": body.phone.strip(),
        "service_type": body.service_type,
        "message": body.message.strip(),
        "status": "new",
        "created_at": now,
    }
    result = await db.enquiries.insert_one(doc)
    return {
        "id": str(result.inserted_id),
        **{k: v for k, v in doc.items() if k != "_id"},
    }


# ---------------------------------------------------------------------------
# Client cases
# ---------------------------------------------------------------------------


@api_router.post("/cases")
async def create_case(body: CaseCreateInput, user: dict = Depends(get_current_user)):
    if body.service_type not in SERVICE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid service type")
    now = datetime.now(timezone.utc)
    timeline_event = {
        "stage": "APPLIED",
        "note": "Application submitted. Our team will review your case shortly.",
        "at": now,
    }
    doc = {
        "reference": generate_reference(),
        "user_id": ObjectId(user["id"]),
        "user_email": user["email"],
        "user_name": user.get("name", ""),
        "service_type": body.service_type,
        "partner1_name": body.partner1_name.strip(),
        "partner2_name": body.partner2_name.strip(),
        "partner1_dob": body.partner1_dob,
        "partner2_dob": body.partner2_dob,
        "marriage_date": body.marriage_date,
        "contact_phone": body.contact_phone.strip(),
        "address": body.address.strip(),
        "notes": body.notes or "",
        "stage": "APPLIED",
        "timeline": [timeline_event],
        "created_at": now,
        "updated_at": now,
    }
    result = await db.cases.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    doc["user_id"] = user["id"]
    return doc


@api_router.get("/cases")
async def list_my_cases(user: dict = Depends(get_current_user)):
    cursor = (
        db.cases.find({"user_id": ObjectId(user["id"])})
        .sort("created_at", -1)
        .limit(50)
    )
    out = []
    async for c in cursor:
        out.append(serialize_case(c))
    return out


@api_router.get("/cases/{case_id}")
async def get_case(case_id: str, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(case_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid case id")
    c = await db.cases.find_one({"_id": oid})
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    if user.get("role") != "admin" and str(c["user_id"]) != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return serialize_case(c)


@api_router.post("/cases/{case_id}/documents")
async def upload_document(
    case_id: str,
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    try:
        oid = ObjectId(case_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid case id")
    c = await db.cases.find_one({"_id": oid})
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    if user.get("role") != "admin" and str(c["user_id"]) != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    case_dir = UPLOAD_DIR / case_id
    case_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex}_{Path(file.filename).name}"
    dest = case_dir / safe_name
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    size = dest.stat().st_size

    now = datetime.now(timezone.utc)
    doc = {
        "case_id": case_id,
        "filename": safe_name,
        "original_name": file.filename,
        "doc_type": doc_type,
        "size": size,
        "uploaded_by": ObjectId(user["id"]),
        "uploaded_at": now,
    }
    res = await db.documents.insert_one(doc)
    return {
        "id": str(res.inserted_id),
        "case_id": case_id,
        "filename": safe_name,
        "original_name": file.filename,
        "doc_type": doc_type,
        "size": size,
        "uploaded_at": now,
    }


@api_router.get("/cases/{case_id}/documents")
async def list_documents(case_id: str, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(case_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid case id")
    c = await db.cases.find_one({"_id": oid})
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    if user.get("role") != "admin" and str(c["user_id"]) != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    out = []
    async for d in db.documents.find({"case_id": case_id}).sort("uploaded_at", -1).limit(100):
        out.append(
            {
                "id": str(d["_id"]),
                "case_id": case_id,
                "filename": d["filename"],
                "original_name": d["original_name"],
                "doc_type": d["doc_type"],
                "size": d["size"],
                "uploaded_at": d["uploaded_at"],
            }
        )
    return out


@api_router.get("/documents/{document_id}/download")
async def download_document(document_id: str, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(document_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document id")
    d = await db.documents.find_one({"_id": oid})
    if not d:
        raise HTTPException(status_code=404, detail="Document not found")
    c = await db.cases.find_one({"_id": ObjectId(d["case_id"])})
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    if user.get("role") != "admin" and str(c["user_id"]) != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    path = UPLOAD_DIR / d["case_id"] / d["filename"]
    if not path.exists():
        raise HTTPException(status_code=404, detail="File missing")
    return FileResponse(path, filename=d["original_name"])


# ---------------------------------------------------------------------------
# Admin endpoints
# ---------------------------------------------------------------------------


@api_router.get("/admin/cases")
async def admin_list_cases(user: dict = Depends(require_admin)):
    out = []
    async for c in db.cases.find({}).sort("created_at", -1).limit(100):
        out.append(serialize_case(c))
    return out


@api_router.patch("/admin/cases/{case_id}/stage")
async def admin_update_stage(
    case_id: str,
    body: CaseStageUpdate,
    user: dict = Depends(require_admin),
):
    if body.stage not in CASE_STAGES:
        raise HTTPException(status_code=400, detail="Invalid stage")
    try:
        oid = ObjectId(case_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid case id")
    c = await db.cases.find_one({"_id": oid})
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    now = datetime.now(timezone.utc)
    event = {"stage": body.stage, "note": body.note or "", "at": now}
    await db.cases.update_one(
        {"_id": oid},
        {
            "$set": {"stage": body.stage, "updated_at": now},
            "$push": {"timeline": event},
        },
    )
    updated = await db.cases.find_one({"_id": oid})
    return serialize_case(updated)


@api_router.get("/admin/enquiries")
async def admin_list_enquiries(user: dict = Depends(require_admin)):
    out = []
    async for e in db.enquiries.find({}).sort("created_at", -1).limit(100):
        out.append(
            {
                "id": str(e["_id"]),
                "name": e["name"],
                "email": e["email"],
                "phone": e["phone"],
                "service_type": e.get("service_type"),
                "message": e["message"],
                "status": e.get("status", "new"),
                "created_at": e["created_at"],
            }
        )
    return out


@api_router.patch("/admin/enquiries/{enquiry_id}")
async def admin_update_enquiry(
    enquiry_id: str,
    body: EnquiryStatusUpdate,
    user: dict = Depends(require_admin),
):
    try:
        oid = ObjectId(enquiry_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid enquiry id")
    res = await db.enquiries.update_one({"_id": oid}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True}


@api_router.get("/admin/stats")
async def admin_stats(user: dict = Depends(require_admin)):
    total_cases = await db.cases.count_documents({})
    total_users = await db.users.count_documents({"role": "client"})
    total_enquiries = await db.enquiries.count_documents({})
    new_enquiries = await db.enquiries.count_documents({"status": "new"})
    by_stage = {}
    for s in CASE_STAGES:
        by_stage[s] = await db.cases.count_documents({"stage": s})
    return {
        "total_cases": total_cases,
        "total_users": total_users,
        "total_enquiries": total_enquiries,
        "new_enquiries": new_enquiries,
        "by_stage": by_stage,
    }


# ---------------------------------------------------------------------------
# Mount router + middleware
# ---------------------------------------------------------------------------

app.include_router(api_router)

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
cors_origins = [frontend_url]
extra = os.environ.get("CORS_ORIGINS", "")
if extra and extra != "*":
    cors_origins.extend([o.strip() for o in extra.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https?://.*",
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("dcms")


# ---------------------------------------------------------------------------
# Startup: seed admin + indexes
# ---------------------------------------------------------------------------


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@dcms.in").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@12345")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one(
            {
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "DCMS Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc),
            }
        )
        logger.info("Seeded admin user: %s", admin_email)
    else:
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password), "role": "admin"}},
            )
            logger.info("Updated admin password for: %s", admin_email)
        elif existing.get("role") != "admin":
            await db.users.update_one(
                {"email": admin_email}, {"$set": {"role": "admin"}}
            )


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("phone")
    await db.login_attempts.create_index("identifier")
    await db.cases.create_index("user_id")
    await db.cases.create_index("reference")
    await db.documents.create_index("case_id")
    await db.otp_codes.create_index("phone")
    await db.otp_codes.create_index("expires_at", expireAfterSeconds=0)
    await seed_admin()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
