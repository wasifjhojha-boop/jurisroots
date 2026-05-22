# DCMS — Delhi Court Marriage Services Portal

## Original Problem Statement
> We are a Delhi-based legal service provider specializing in court marriage registration, marriage certificate assistance, and legal documentation services. With a strong focus on accuracy, confidentiality, and efficiency, we help couples complete their marriage process smoothly and legally.

User chose: **Full portal** — clients register, upload documents, track case status.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor). JWT auth via httpOnly cookies (bcrypt, brute-force lockout, admin seeding, Mongo indexes on startup).
- **Frontend**: React + Tailwind + Shadcn UI. Routes: `/`, `/services`, `/process`, `/documents`, `/faq`, `/contact`, `/login`, `/register`, `/dashboard`, `/dashboard/case/:id`, `/admin`.
- **Design**: Archetype 1 — Sandstone & Terracotta (Playfair Display + Work Sans).
- **Stages**: APPLIED → VERIFICATION → NOTICE → REGISTRATION → CERTIFICATE_ISSUED.

## User Personas
- **Couple (Client)**: Registers, creates case, uploads scanned docs, tracks timeline.
- **Advocate (Admin)**: Reviews cases & enquiries, moves stages, adds notes (visible on client timeline).

## Implemented (Dec 2025)
- Marketing site: Home (hero, services grid, process, testimonial, CTA), Services, Process, Documents checklist, FAQ (Accordion), Contact form (POSTs to `/api/enquiries`).
- Auth: register/login/logout/me/refresh with httpOnly cookies; role-based (client/admin); brute-force lockout.
- Client dashboard: list own cases, create case (shadcn Dialog), timeline card per case.
- Case detail: timeline + case details + document upload/list/download.
- Admin dashboard: stats, cases table with stage update dialog, enquiries table with status dropdown.
- Admin seeded on startup (`admin@dcms.in / Admin@12345`).
- 28/28 backend pytest passing, full frontend E2E verified.

## Backlog
- **P1**: Replace native `<select>` / date inputs in Dashboard & upload form with shadcn `Select` + `Calendar` for design consistency.
- **P1**: Add file-size and mime-type validation on document upload.
- **P1**: Password-reset flow (forgot/reset endpoints were scoped but deferred).
- **P2**: Split `server.py` into `auth.py`, `cases.py`, `admin.py`.
- **P2**: Email/WhatsApp notifications on stage changes (SendGrid/Twilio).
- **P2**: Razorpay/Stripe integration for service fee collection.
- **P2**: AI assistant for visitor queries about required documents / timelines.
- **P3**: Tighten CORS in production; enum-validate enquiry status.

## Test Credentials
See `/app/memory/test_credentials.md`.
