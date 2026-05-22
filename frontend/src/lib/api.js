import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const SERVICE_LABELS = {
  COURT_MARRIAGE: "Court Marriage Registration",
  MARRIAGE_CERTIFICATE: "Marriage Certificate Assistance",
  SPECIAL_MARRIAGE_ACT: "Special Marriage Act",
  HINDU_MARRIAGE_ACT: "Hindu Marriage Act",
  TATKAL_REGISTRATION: "Tatkal Marriage Registration",
  NRI_MARRIAGE: "NRI Marriage Registration",
  LEGAL_DOCUMENTATION: "Legal Documentation & Affidavits",
};

export const CASE_STAGES = [
  { key: "APPLIED", label: "Applied" },
  { key: "VERIFICATION", label: "Document Verification" },
  { key: "NOTICE", label: "Notice Period" },
  { key: "REGISTRATION", label: "Registration" },
  { key: "CERTIFICATE_ISSUED", label: "Certificate Issued" },
];

export function stageIndex(stage) {
  return CASE_STAGES.findIndex((s) => s.key === stage);
}
