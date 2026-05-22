import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ArrowRight, Phone, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const { refresh } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [devOtp, setDevOtp] = useState(""); // shown only when SMS is mocked
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  const requestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/otp/request", { phone });
      setNormalizedPhone(data.phone);
      setStep(2);
      if (data.mock_sms && data.dev_otp) {
        setDevOtp(data.dev_otp);
        toast.success("OTP sent (test mode)");
      } else {
        toast.success("OTP sent to your phone");
      }
      setResendIn(30);
      const t = setInterval(() => {
        setResendIn((s) => {
          if (s <= 1) {
            clearInterval(t);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/otp/verify", {
        phone: normalizedPhone,
        otp,
      });
      await refresh();
      toast.success("Signed in");
      const to = data.role === "admin"
        ? "/admin"
        : location.state?.from || "/dashboard";
      nav(to, { replace: true });
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="login-page" className="min-h-[80vh] grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-[#0B1F3A] text-white p-12">
        <div className="overline text-[#B89055] mb-4">Client portal</div>
        <h1 className="font-serif text-4xl xl:text-5xl leading-tight max-w-md">
          Track your case securely with phone-based login.
        </h1>
        <p className="mt-6 text-[#CBD5E1] max-w-md leading-relaxed">
          Sign in with your phone number — we'll send you a one-time password.
          No passwords to remember, no email required.
        </p>
        <ul className="mt-10 space-y-3 text-sm text-[#CBD5E1]">
          <li className="flex items-center gap-2">
            <Lock size={14} className="text-[#B89055]" /> Privileged
            advocate–client communication
          </li>
          <li className="flex items-center gap-2">
            <Phone size={14} className="text-[#B89055]" /> One-time password
            valid for 10 minutes
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <form onSubmit={requestOTP} data-testid="phone-form">
              <div className="overline text-[#0B1F3A] mb-3">Step 1 of 2</div>
              <h2 className="font-serif text-3xl text-[#0A0A0A]">Sign in</h2>
              <p className="text-sm text-[#525252] mt-2">
                Enter your phone number to receive a one-time password.
              </p>

              <div className="mt-8">
                <label className="overline text-[#525252] block mb-2">
                  Phone number
                </label>
                <div className="flex">
                  <span className="border border-[#E5E5E2] border-r-0 bg-[#F6F6F4] px-4 py-3 text-[#525252]">
                    +91
                  </span>
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9 ]*"
                    placeholder="98xxx xxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 border border-[#E5E5E2] bg-transparent px-4 py-3 focus:outline-none focus:border-[#0B1F3A]"
                    data-testid="phone-input"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 text-sm text-[#B45309]" data-testid="phone-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || phone.replace(/\D/g, "").length < 10}
                className="btn-primary w-full justify-center mt-6"
                data-testid="phone-submit-btn"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Sending OTP…
                  </>
                ) : (
                  <>
                    Send OTP <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="mt-6 text-xs text-[#525252] leading-relaxed">
                By signing in, you agree to our terms of use. Your phone number
                is used only to verify your identity.
              </p>
            </form>
          ) : (
            <form onSubmit={verifyOTP} data-testid="otp-form">
              <div className="overline text-[#0B1F3A] mb-3">Step 2 of 2</div>
              <h2 className="font-serif text-3xl text-[#0A0A0A]">Enter OTP</h2>
              <p className="text-sm text-[#525252] mt-2">
                We've sent a {6}-digit code to{" "}
                <span className="font-medium text-[#0A0A0A]">{normalizedPhone}</span>.{" "}
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setDevOtp("");
                    setError("");
                  }}
                  className="text-[#0B1F3A] underline"
                  data-testid="change-phone-btn"
                >
                  Change number
                </button>
              </p>

              {devOtp && (
                <div
                  className="mt-6 border border-[#FBBF24] bg-[#FEF3C7] p-4 text-sm"
                  data-testid="dev-otp-banner"
                >
                  <div className="font-medium text-[#92400E]">
                    Test mode (no SMS provider connected yet)
                  </div>
                  <div className="text-[#92400E] mt-1">
                    Your OTP is <span className="font-mono font-bold">{devOtp}</span>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <label className="overline text-[#525252] block mb-2">
                  6-digit OTP
                </label>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-[#E5E5E2] bg-transparent px-4 py-3 text-center text-2xl tracking-[0.6em] font-mono focus:outline-none focus:border-[#0B1F3A]"
                  data-testid="otp-input"
                />
              </div>

              {error && (
                <div className="mt-4 text-sm text-[#B45309]" data-testid="otp-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || otp.length < 4}
                className="btn-primary w-full justify-center mt-6"
                data-testid="otp-submit-btn"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Verifying…
                  </>
                ) : (
                  <>
                    Verify & sign in <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="mt-6 text-sm text-[#525252] text-center">
                Didn't receive it?{" "}
                {resendIn > 0 ? (
                  <span>Resend in {resendIn}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={requestOTP}
                    className="text-[#0B1F3A] underline"
                    data-testid="resend-otp-btn"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
