import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatApiErrorDetail, SERVICE_LABELS, CASE_STAGES } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Plus, FileText, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CaseTimeline from "@/components/CaseTimeline";

function NewCaseForm({ onCreated }) {
  const [form, setForm] = useState({
    service_type: "COURT_MARRIAGE",
    partner1_name: "",
    partner2_name: "",
    partner1_dob: "",
    partner2_dob: "",
    marriage_date: "",
    contact_phone: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/cases", form);
      toast.success("Case created. Reference: " + data.reference);
      onCreated(data);
    } catch (err) {
      toast.error(
        formatApiErrorDetail(err.response?.data?.detail) || err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 mt-2" data-testid="new-case-form">
      <div>
        <label className="overline text-[#57534E] block mb-2">Service</label>
        <select
          value={form.service_type}
          onChange={(e) => setForm({ ...form, service_type: e.target.value })}
          className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
          data-testid="new-case-service-select"
        >
          {Object.entries(SERVICE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="overline text-[#57534E] block mb-2">
            Partner 1 name
          </label>
          <input
            required
            type="text"
            value={form.partner1_name}
            onChange={(e) =>
              setForm({ ...form, partner1_name: e.target.value })
            }
            className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
            data-testid="new-case-partner1-input"
          />
        </div>
        <div>
          <label className="overline text-[#57534E] block mb-2">
            Partner 2 name
          </label>
          <input
            required
            type="text"
            value={form.partner2_name}
            onChange={(e) =>
              setForm({ ...form, partner2_name: e.target.value })
            }
            className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
            data-testid="new-case-partner2-input"
          />
        </div>
        <div>
          <label className="overline text-[#57534E] block mb-2">
            Partner 1 DOB
          </label>
          <input
            type="date"
            value={form.partner1_dob}
            onChange={(e) =>
              setForm({ ...form, partner1_dob: e.target.value })
            }
            className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
          />
        </div>
        <div>
          <label className="overline text-[#57534E] block mb-2">
            Partner 2 DOB
          </label>
          <input
            type="date"
            value={form.partner2_dob}
            onChange={(e) =>
              setForm({ ...form, partner2_dob: e.target.value })
            }
            className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
          />
        </div>
        <div>
          <label className="overline text-[#57534E] block mb-2">
            Marriage date (if any)
          </label>
          <input
            type="date"
            value={form.marriage_date}
            onChange={(e) =>
              setForm({ ...form, marriage_date: e.target.value })
            }
            className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
          />
        </div>
        <div>
          <label className="overline text-[#57534E] block mb-2">
            Contact phone
          </label>
          <input
            required
            type="tel"
            value={form.contact_phone}
            onChange={(e) =>
              setForm({ ...form, contact_phone: e.target.value })
            }
            className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
            data-testid="new-case-phone-input"
          />
        </div>
      </div>
      <div>
        <label className="overline text-[#57534E] block mb-2">
          Delhi address (for jurisdiction)
        </label>
        <input
          required
          type="text"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
          data-testid="new-case-address-input"
        />
      </div>
      <div>
        <label className="overline text-[#57534E] block mb-2">
          Notes for your advisor
        </label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center"
        data-testid="new-case-submit-btn"
      >
        {submitting ? "Creating…" : "Create case file"}
      </button>
    </form>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/cases");
      setCases(data);
    } catch (e) {
      toast.error("Could not load cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div
      className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16"
      data-testid="client-dashboard"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <div className="overline text-[#8C4A32] mb-2">Your case file</div>
          <h1 className="font-serif text-3xl lg:text-5xl text-[#1C1917]">
            Good to see you, {user?.name?.split(" ")[0] || "there"}.
          </h1>
          <p className="mt-3 text-[#57534E]">
            Track every active case and upload supporting documents securely.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary" data-testid="new-case-btn">
              <Plus size={16} /> Start a new case
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#FAF9F6] border-[#E7E5DF]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-[#1C1917]">
                New case file
              </DialogTitle>
            </DialogHeader>
            <NewCaseForm
              onCreated={() => {
                setOpen(false);
                load();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-[#57534E]">Loading cases…</div>
      ) : cases.length === 0 ? (
        <div
          className="border border-[#E7E5DF] bg-[#F3F0E9] p-12 text-center"
          data-testid="dashboard-empty-state"
        >
          <FileText size={28} className="mx-auto text-[#8C4A32]" />
          <h2 className="font-serif text-2xl text-[#1C1917] mt-4">
            No cases yet
          </h2>
          <p className="text-[#57534E] mt-2 max-w-md mx-auto">
            Click "Start a new case" above to create your first case file with
            us.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {cases.map((c) => (
            <Link
              key={c.id}
              to={`/dashboard/case/${c.id}`}
              className="block border border-[#E7E5DF] bg-[#FAF9F6] p-6 lg:p-8 hover:border-[#8C4A32] transition-colors"
              data-testid={`case-row-${c.id}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="overline text-[#8C4A32]">{c.reference}</div>
                  <div className="font-serif text-xl text-[#1C1917] mt-1">
                    {SERVICE_LABELS[c.service_type]}
                  </div>
                  <div className="text-sm text-[#57534E] mt-1">
                    {c.partner1_name} &amp; {c.partner2_name}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8C4A32]">
                  View case <ArrowRight size={14} />
                </div>
              </div>
              <CaseTimeline stage={c.stage} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
