import { useState } from "react";
import { api, formatApiErrorDetail, SERVICE_LABELS } from "@/lib/api";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { BUSINESS, whatsappLink, telLink } from "@/data/business";
import useSEO from "@/hooks/useSEO";

const CASE_TYPES = [
  "Court Marriage (Special Marriage Act)",
  "Marriage Registration (Hindu Marriage Act)",
  "Marriage Registration (SMA)",
  "Urgent / Time-sensitive case",
  "NRI / Foreign National marriage",
  "Marriage Certificate (duplicate / correction)",
  "Not sure — need consultation",
];

export default function Contact() {
  useSEO({
    title: "Contact / Book Consultation — Delhi-NCR Court Marriage",
    description: "Book a confidential consultation with our advocate. Call, WhatsApp, or email — quick response within working hours.",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service_type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Map case type to legacy service_type field if matched, else send as note in message.
      const map = {
        "Court Marriage (Special Marriage Act)": "SPECIAL_MARRIAGE_ACT",
        "Marriage Registration (Hindu Marriage Act)": "HINDU_MARRIAGE_ACT",
        "Marriage Registration (SMA)": "SPECIAL_MARRIAGE_ACT",
        "Urgent / Time-sensitive case": "TATKAL_REGISTRATION",
        "NRI / Foreign National marriage": "NRI_MARRIAGE",
        "Marriage Certificate (duplicate / correction)": "MARRIAGE_CERTIFICATE",
      };
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        service_type: map[form.service_type] || null,
        message: form.service_type
          ? `Case type: ${form.service_type}\n\n${form.message}`
          : form.message,
      };
      await api.post("/enquiries", payload);
      toast.success("Enquiry received. We'll respond within working hours.");
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", service_type: "", message: "" });
    } catch (err) {
      toast.error(
        formatApiErrorDetail(err.response?.data?.detail) || err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      {/* Header */}
      <section className="bg-[#0B1F3A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="overline text-[#B89055] mb-4">Book a consultation</div>
          <h1 className="font-serif text-4xl lg:text-6xl leading-tight max-w-3xl">
            Confidential. Advocate-led. No obligation.
          </h1>
          <p className="mt-6 text-[#CBD5E1] max-w-2xl leading-relaxed">
            Share a brief note about your case. We respond within working hours
            with a clear next step and a fixed-fee quotation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-5">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Phone size={18} className="mt-0.5 text-[#B89055]" />
              <div>
                <div className="overline text-[#525252]">Call</div>
                <a href={telLink()} className="text-[#0A0A0A] font-medium hover:underline">
                  {BUSINESS.phone_display}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MessageCircle size={18} className="mt-0.5 text-[#25D366]" />
              <div>
                <div className="overline text-[#525252]">WhatsApp</div>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A0A0A] font-medium hover:underline"
                >
                  {BUSINESS.phone_display}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={18} className="mt-0.5 text-[#B89055]" />
              <div>
                <div className="overline text-[#525252]">Email</div>
                <a href={`mailto:${BUSINESS.email}`} className="text-[#0A0A0A] font-medium hover:underline">
                  {BUSINESS.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin size={18} className="mt-0.5 text-[#B89055]" />
              <div>
                <div className="overline text-[#525252]">Chambers</div>
                <div className="text-[#0A0A0A]">{BUSINESS.address}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={18} className="mt-0.5 text-[#B89055]" />
              <div>
                <div className="overline text-[#525252]">Hours</div>
                <div className="text-[#0A0A0A]">{BUSINESS.hours}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 border border-[#E5E5E2] bg-[#F6F6F4] p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#15803D]" />
              <div className="overline text-[#0B1F3A]">Privileged communication</div>
            </div>
            <p className="mt-3 text-sm text-[#525252] leading-relaxed">
              Every enquiry is treated as privileged advocate-client
              communication. Nothing you share is used elsewhere.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="border border-[#E5E5E2] bg-white p-8 lg:p-10"
            data-testid="enquiry-form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="overline text-[#525252] block mb-2">Full name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[#E5E5E2] bg-transparent px-4 py-3 focus:outline-none focus:border-[#0B1F3A]"
                  data-testid="enquiry-name-input"
                />
              </div>
              <div>
                <label className="overline text-[#525252] block mb-2">Phone</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-[#E5E5E2] bg-transparent px-4 py-3 focus:outline-none focus:border-[#0B1F3A]"
                  data-testid="enquiry-phone-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="overline text-[#525252] block mb-2">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-[#E5E5E2] bg-transparent px-4 py-3 focus:outline-none focus:border-[#0B1F3A]"
                  data-testid="enquiry-email-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="overline text-[#525252] block mb-2">Case type</label>
                <select
                  value={form.service_type}
                  onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                  className="w-full border border-[#E5E5E2] bg-transparent px-4 py-3 focus:outline-none focus:border-[#0B1F3A]"
                  data-testid="enquiry-service-select"
                >
                  <option value="">Select your case type</option>
                  {CASE_TYPES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="overline text-[#525252] block mb-2">
                  Brief about your case
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-[#E5E5E2] bg-transparent px-4 py-3 focus:outline-none focus:border-[#0B1F3A] resize-y"
                  data-testid="enquiry-message-input"
                />
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-[#525252] max-w-sm">
                By submitting, you agree we may contact you by phone, email, or WhatsApp.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                data-testid="enquiry-submit-btn"
              >
                {submitting ? "Sending…" : "Submit enquiry"}
              </button>
            </div>
            {submitted && (
              <div className="mt-6 text-sm text-[#15803D]" data-testid="enquiry-success">
                Thank you — an advocate will get in touch shortly.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
