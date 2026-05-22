import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, formatApiErrorDetail, SERVICE_LABELS, CASE_STAGES } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Upload, Download, FileText } from "lucide-react";
import CaseTimeline from "@/components/CaseTimeline";

const DOC_TYPES = [
  { value: "ID_PROOF", label: "ID Proof" },
  { value: "ADDRESS_PROOF", label: "Address Proof" },
  { value: "AGE_PROOF", label: "Age Proof" },
  { value: "PHOTO", label: "Photograph" },
  { value: "AFFIDAVIT", label: "Affidavit" },
  { value: "WITNESS", label: "Witness Document" },
  { value: "OTHER", label: "Other" },
];

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

export default function CaseDetail() {
  const { id } = useParams();
  const [kase, setKase] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docType, setDocType] = useState("ID_PROOF");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [c, d] = await Promise.all([
        api.get(`/cases/${id}`),
        api.get(`/cases/${id}/documents`),
      ]);
      setKase(c.data);
      setDocs(d.data);
    } catch (err) {
      toast.error("Could not load case");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose a file");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("doc_type", docType);
    try {
      await api.post(`/cases/${id}/documents`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document uploaded");
      setFile(null);
      e.target.reset();
      load();
    } catch (err) {
      toast.error(
        formatApiErrorDetail(err.response?.data?.detail) || err.message
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadDoc = async (docId, name) => {
    try {
      const res = await api.get(`/documents/${docId}/download`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-[#57534E]">
        Loading…
      </div>
    );
  }
  if (!kase) return null;

  return (
    <div
      className="max-w-6xl mx-auto px-6 lg:px-12 py-12 lg:py-16"
      data-testid="case-detail-page"
    >
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-[#8C4A32] hover:underline"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft size={14} /> Back to dashboard
      </Link>

      <div className="mt-6 border border-[#E7E5DF] bg-[#FAF9F6] p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div>
            <div className="overline text-[#8C4A32]">{kase.reference}</div>
            <h1 className="font-serif text-3xl text-[#1C1917] mt-1">
              {SERVICE_LABELS[kase.service_type]}
            </h1>
            <div className="text-[#57534E] mt-1">
              {kase.partner1_name} &amp; {kase.partner2_name}
            </div>
          </div>
          <div className="text-sm text-[#57534E]">
            Created {formatDate(kase.created_at)}
          </div>
        </div>

        <CaseTimeline stage={kase.stage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <section className="lg:col-span-2 border border-[#E7E5DF] bg-[#FAF9F6] p-6 lg:p-8">
          <h2 className="font-serif text-xl text-[#1C1917] mb-5">Timeline</h2>
          <ol className="space-y-5">
            {(kase.timeline || []).map((t, i) => (
              <li
                key={i}
                className="grid grid-cols-[auto,1fr] gap-4 pb-5 border-b border-[#E7E5DF] last:border-0"
                data-testid={`timeline-event-${i}`}
              >
                <div className="text-xs text-[#57534E] w-32">
                  {formatDate(t.at)}
                </div>
                <div>
                  <div className="font-medium text-[#1C1917]">
                    {CASE_STAGES.find((s) => s.key === t.stage)?.label ||
                      t.stage}
                  </div>
                  {t.note && (
                    <div className="text-sm text-[#57534E] mt-1">{t.note}</div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="border border-[#E7E5DF] bg-[#FAF9F6] p-6 lg:p-8">
          <h2 className="font-serif text-xl text-[#1C1917] mb-5">Case details</h2>
          <dl className="space-y-3 text-sm">
            <Row label="Contact" value={kase.contact_phone} />
            <Row label="Address" value={kase.address} />
            {kase.partner1_dob && (
              <Row label="Partner 1 DOB" value={kase.partner1_dob} />
            )}
            {kase.partner2_dob && (
              <Row label="Partner 2 DOB" value={kase.partner2_dob} />
            )}
            {kase.marriage_date && (
              <Row label="Marriage date" value={kase.marriage_date} />
            )}
            {kase.notes && <Row label="Notes" value={kase.notes} />}
          </dl>
        </aside>
      </div>

      <section className="border border-[#E7E5DF] bg-[#FAF9F6] p-6 lg:p-8 mt-8">
        <h2 className="font-serif text-xl text-[#1C1917] mb-5">Documents</h2>

        <form
          onSubmit={handleUpload}
          className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-3 items-end border border-[#E7E5DF] bg-[#F3F0E9] p-5 mb-6"
          data-testid="document-upload-form"
        >
          <div>
            <label className="overline text-[#57534E] block mb-2">Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full border border-[#E7E5DF] bg-[#FAF9F6] px-3 py-2 focus:outline-none focus:border-[#8C4A32]"
              data-testid="document-type-select"
            >
              {DOC_TYPES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="overline text-[#57534E] block mb-2">File</label>
            <input
              required
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
              data-testid="document-file-input"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary"
            data-testid="document-upload-btn"
          >
            <Upload size={14} /> {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>

        {docs.length === 0 ? (
          <div className="text-sm text-[#57534E]">No documents uploaded yet.</div>
        ) : (
          <ul className="divide-y divide-[#E7E5DF] border border-[#E7E5DF]">
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between p-4 hover:bg-[#F3F0E9]"
                data-testid={`document-row-${d.id}`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-[#8C4A32]" />
                  <div>
                    <div className="text-sm text-[#1C1917]">
                      {d.original_name}
                    </div>
                    <div className="text-xs text-[#57534E]">
                      {d.doc_type} · {(d.size / 1024).toFixed(1)} KB ·{" "}
                      {formatDate(d.uploaded_at)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadDoc(d.id, d.original_name)}
                  className="text-sm text-[#8C4A32] hover:underline inline-flex items-center gap-1"
                  data-testid={`document-download-${d.id}`}
                >
                  <Download size={14} /> Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[100px,1fr] gap-3">
      <dt className="overline text-[#57534E]">{label}</dt>
      <dd className="text-[#1C1917]">{value}</dd>
    </div>
  );
}
