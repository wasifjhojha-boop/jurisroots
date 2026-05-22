import { Check } from "lucide-react";
import useSEO from "@/hooks/useSEO";

const GROUPS = [
  {
    title: "For Special Marriage Act",
    items: [
      "Identity proof — Aadhaar / Passport / Voter ID",
      "Address proof — Aadhaar / utility bill / passport",
      "Age proof — 10th certificate / birth certificate / passport",
      "6 passport-size photographs of each party",
      "2 post-card size joint photographs",
      "Affidavit of marital status (single / divorced / widowed)",
      "Identity proof of three witnesses + 2 photos each",
    ],
  },
  {
    title: "For Hindu Marriage Registration",
    items: [
      "Wedding photographs (showing key rituals)",
      "Marriage invitation card",
      "Identity proof — both parties (Aadhaar / Passport)",
      "Address proof — both parties",
      "Age proof of both parties",
      "Joint affidavit of marriage",
      "Identity & address proof of two witnesses",
    ],
  },
  {
    title: "For NRI / Foreign Nationals",
    items: [
      "Passport (current) — both parties",
      "Valid Indian visa / OCI card",
      "Single-status / 'No-impediment' certificate from home country",
      "Embassy attestation of single status (where applicable)",
      "Apostille of foreign documents",
      "Proof of 30-day stay in India (for SMA)",
      "Power of Attorney (if travel is not possible)",
    ],
  },
];

export default function Documents() {
  useSEO({
    title: "Documents Required for Court Marriage in Delhi-NCR",
    description: "Complete document checklist for court marriage under Special Marriage Act, Hindu Marriage Act registration, and NRI marriages.",
  });
  return (
    <div
      className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24"
      data-testid="documents-page"
    >
      <div className="max-w-3xl mb-16">
        <div className="overline text-[#0B1F3A] mb-4">Documents Required</div>
        <h1 className="font-serif text-4xl lg:text-6xl text-[#0A0A0A] leading-tight">
          Three checklists, depending on your route.
        </h1>
        <p className="mt-6 text-[#525252] leading-relaxed text-lg">
          Document requirements vary slightly by Act and case type. Use the
          relevant checklist below — and contact us before submission so we
          can vet every paper for compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E5E5E2] border border-[#E5E5E2]">
        {GROUPS.map((g) => (
          <div
            key={g.title}
            className="bg-white p-8"
            data-testid={`document-group-${g.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <h3 className="font-serif text-xl text-[#0A0A0A] mb-5">
              {g.title}
            </h3>
            <ul className="space-y-3">
              {g.items.map((it) => (
                <li
                  key={it}
                  className="flex items-start gap-3 text-sm text-[#0A0A0A]"
                >
                  <div className="w-5 h-5 mt-0.5 flex items-center justify-center bg-[#F6F6F4] border border-[#E5E5E2] flex-shrink-0">
                    <Check size={12} className="text-[#0B1F3A]" />
                  </div>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
