import { useEffect, useState } from "react";
import { api, formatApiErrorDetail, SERVICE_LABELS, CASE_STAGES } from "@/lib/api";
import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users, FileText, Inbox, TrendingUp } from "lucide-react";

function formatDate(s) {
  if (!s) return "";
  try {
    return new Date(s).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return s;
  }
}

function Stat({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className={`border border-[#E7E5DF] p-6 ${
        accent ? "bg-[#8C4A32] text-[#FAF9F6]" : "bg-[#FAF9F6]"
      }`}
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className={`flex items-center gap-2 ${
          accent ? "text-[#F3F0E9]" : "text-[#57534E]"
        }`}
      >
        <Icon size={14} />
        <span className="overline">{label}</span>
      </div>
      <div
        className={`font-serif text-4xl mt-2 ${
          accent ? "text-[#FAF9F6]" : "text-[#1C1917]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StageUpdateDialog({ caseItem, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(caseItem.stage);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.patch(`/admin/cases/${caseItem.id}/stage`, { stage, note });
      toast.success("Stage updated");
      setOpen(false);
      setNote("");
      onUpdated();
    } catch (err) {
      toast.error(
        formatApiErrorDetail(err.response?.data?.detail) || err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-xs text-[#8C4A32] hover:underline"
          data-testid={`update-stage-btn-${caseItem.id}`}
        >
          Update stage
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#FAF9F6] border-[#E7E5DF]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-[#1C1917]">
            Update case stage
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          <div>
            <label className="overline text-[#57534E] block mb-2">Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
              data-testid="admin-stage-select"
            >
              {CASE_STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="overline text-[#57534E] block mb-2">
              Note for client
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-[#E7E5DF] bg-transparent px-4 py-3 focus:outline-none focus:border-[#8C4A32]"
              data-testid="admin-stage-note"
            />
          </div>
          <button
            onClick={submit}
            disabled={submitting}
            className="btn-primary w-full justify-center"
            data-testid="admin-stage-submit-btn"
          >
            {submitting ? "Saving…" : "Save update"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, c, e] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/cases"),
        api.get("/admin/enquiries"),
      ]);
      setStats(s.data);
      setCases(c.data);
      setEnquiries(e.data);
    } catch (err) {
      toast.error("Could not load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markEnquiry = async (id, status) => {
    try {
      await api.patch(`/admin/enquiries/${id}`, { status });
      toast.success("Enquiry updated");
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16"
      data-testid="admin-dashboard"
    >
      <div className="mb-10">
        <div className="overline text-[#8C4A32] mb-2">Admin console</div>
        <h1 className="font-serif text-3xl lg:text-5xl text-[#1C1917]">
          Chamber operations
        </h1>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Stat icon={FileText} label="Total cases" value={stats.total_cases} accent />
          <Stat icon={Users} label="Clients" value={stats.total_users} />
          <Stat icon={Inbox} label="Enquiries" value={stats.total_enquiries} />
          <Stat
            icon={TrendingUp}
            label="New enquiries"
            value={stats.new_enquiries}
          />
        </div>
      )}

      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="bg-[#F3F0E9] border border-[#E7E5DF] rounded-sm">
          <TabsTrigger value="cases" data-testid="tab-cases">
            Cases
          </TabsTrigger>
          <TabsTrigger value="enquiries" data-testid="tab-enquiries">
            Enquiries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-6">
          <div
            className="border border-[#E7E5DF] bg-[#FAF9F6] overflow-x-auto"
            data-testid="admin-cases-table"
          >
            <table className="w-full text-sm">
              <thead className="bg-[#F3F0E9] text-left">
                <tr>
                  <Th>Reference</Th>
                  <Th>Client</Th>
                  <Th>Service</Th>
                  <Th>Partners</Th>
                  <Th>Stage</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {cases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-[#57534E]">
                      No cases yet
                    </td>
                  </tr>
                ) : (
                  cases.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-[#E7E5DF]"
                      data-testid={`admin-case-row-${c.id}`}
                    >
                      <Td className="font-mono text-xs">{c.reference}</Td>
                      <Td>
                        <div>{c.user_name}</div>
                        <div className="text-xs text-[#57534E]">
                          {c.user_email}
                        </div>
                      </Td>
                      <Td>{SERVICE_LABELS[c.service_type]}</Td>
                      <Td>
                        {c.partner1_name} &amp; {c.partner2_name}
                      </Td>
                      <Td>
                        <span className="inline-block text-xs bg-[#F3F0E9] border border-[#E7E5DF] px-2 py-1">
                          {CASE_STAGES.find((s) => s.key === c.stage)?.label ||
                            c.stage}
                        </span>
                      </Td>
                      <Td className="text-[#57534E]">
                        {formatDate(c.created_at)}
                      </Td>
                      <Td>
                        <StageUpdateDialog caseItem={c} onUpdated={load} />
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="enquiries" className="mt-6">
          <div
            className="border border-[#E7E5DF] bg-[#FAF9F6] overflow-x-auto"
            data-testid="admin-enquiries-table"
          >
            <table className="w-full text-sm">
              <thead className="bg-[#F3F0E9] text-left">
                <tr>
                  <Th>Name</Th>
                  <Th>Contact</Th>
                  <Th>Service</Th>
                  <Th>Message</Th>
                  <Th>Status</Th>
                  <Th>Received</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-[#57534E]">
                      No enquiries yet
                    </td>
                  </tr>
                ) : (
                  enquiries.map((e) => (
                    <tr
                      key={e.id}
                      className="border-t border-[#E7E5DF]"
                      data-testid={`admin-enquiry-row-${e.id}`}
                    >
                      <Td>{e.name}</Td>
                      <Td>
                        <div>{e.phone}</div>
                        <div className="text-xs text-[#57534E]">{e.email}</div>
                      </Td>
                      <Td>
                        {e.service_type
                          ? SERVICE_LABELS[e.service_type] || e.service_type
                          : "—"}
                      </Td>
                      <Td className="max-w-xs">
                        <span className="line-clamp-2">{e.message}</span>
                      </Td>
                      <Td>
                        <span
                          className={`inline-block text-xs border px-2 py-1 ${
                            e.status === "new"
                              ? "bg-[#FFF7ED] border-[#FDBA74] text-[#9A3412]"
                              : "bg-[#F3F0E9] border-[#E7E5DF] text-[#57534E]"
                          }`}
                        >
                          {e.status}
                        </span>
                      </Td>
                      <Td className="text-[#57534E]">
                        {formatDate(e.created_at)}
                      </Td>
                      <Td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1 hover:bg-[#F3F0E9]"
                              data-testid={`enquiry-actions-${e.id}`}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#FAF9F6] border-[#E7E5DF]"
                          >
                            <DropdownMenuItem
                              onClick={() => markEnquiry(e.id, "contacted")}
                            >
                              Mark contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => markEnquiry(e.id, "converted")}
                            >
                              Mark converted
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => markEnquiry(e.id, "closed")}
                            >
                              Mark closed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {loading && (
        <div className="text-[#57534E] mt-4 text-sm">Refreshing…</div>
      )}
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="overline text-[#57534E] px-4 py-3 font-medium">{children}</th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
