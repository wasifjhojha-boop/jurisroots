import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await register(form);
    setSubmitting(false);
    if (res.ok) {
      toast.success("Account created");
      nav("/dashboard", { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12"
      data-testid="register-page"
    >
      <div className="hidden lg:block">
        <div className="overline text-[#8C4A32] mb-4">Create a case file</div>
        <h1 className="font-serif text-4xl lg:text-6xl text-[#1C1917] leading-tight">
          Begin the journey in under two minutes.
        </h1>
        <p className="mt-6 text-[#57534E] leading-relaxed max-w-md">
          One secure portal for every stage — upload, track, and download your
          certified documents without visiting our chamber.
        </p>
      </div>

      <div className="border border-[#E7E5DF] bg-[#FAF9F6] p-8 lg:p-10">
        <h2 className="font-serif text-2xl text-[#1C1917]">Create account</h2>
        <p className="text-sm text-[#57534E] mt-1">
          Already registered?{" "}
          <Link to="/login" className="text-[#8C4A32] underline">
            Sign in
          </Link>
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
          data-testid="register-form"
        >
          <div>
            <label className="overline text-[#57534E] block mb-2">
              Full name
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
              data-testid="register-name-input"
            />
          </div>
          <div>
            <label className="overline text-[#57534E] block mb-2">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
              data-testid="register-email-input"
            />
          </div>
          <div>
            <label className="overline text-[#57534E] block mb-2">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
              data-testid="register-phone-input"
            />
          </div>
          <div>
            <label className="overline text-[#57534E] block mb-2">
              Password
            </label>
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
              data-testid="register-password-input"
            />
            <div className="text-xs text-[#57534E] mt-1">Minimum 6 characters.</div>
          </div>

          {error && (
            <div className="text-sm text-[#9A3412]" data-testid="register-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center"
            data-testid="register-submit-btn"
          >
            {submitting ? "Creating…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
