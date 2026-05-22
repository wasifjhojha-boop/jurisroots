# Test Credentials

## Phone OTP Login (primary, for both admin & clients)
- Admin phone: +91 97187 90097 (any phone matching ADMIN_PHONE in .env gets admin role)
- Any other phone: gets client role
- OTP is currently MOCKED (MOCK_SMS=true in /app/backend/.env). The OTP is returned in `dev_otp` field of POST /api/auth/otp/request response and shown in the UI as a yellow banner.

## Legacy email/password login (still works as fallback)
- Email: admin@dcms.in
- Password: Admin@12345
- Used directly via POST /api/auth/login

## OTP Endpoints
- POST /api/auth/otp/request  body: {"phone":"9718790097"}
- POST /api/auth/otp/verify   body: {"phone":"+919718790097","otp":"123456"}
- GET  /api/auth/me

## To enable real SMS later
Edit `send_sms_otp()` in /app/backend/server.py to call Twilio/MSG91 and set MOCK_SMS=false.
