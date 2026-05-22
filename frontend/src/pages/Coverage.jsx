import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { CITIES } from "@/data/business";
import useSEO from "@/hooks/useSEO";

export default function Coverage() {
  useSEO({
    title: "Coverage — Delhi, Noida, Ghaziabad, Gurugram, Faridabad",
    description: "Court marriage & registration coverage across all major SDM and registrar offices in Delhi-NCR. Jurisdiction-correct filings, every time.",
  });
  return (
    <div
      className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24"
      data-testid="coverage-page"
    >
      <div className="max-w-3xl mb-16">
        <div className="overline text-[#0B1F3A] mb-4">Service Coverage</div>
        <h1 className="font-serif text-4xl lg:text-6xl text-[#0A0A0A] leading-tight">
          Court marriage and registration across Delhi-NCR.
        </h1>
        <p className="mt-6 text-[#525252] leading-relaxed text-lg">
          Marriage registration is jurisdictional — applications must be filed
          where one partner has resided for at least 30 days. We are active
          across every major SDM and registrar office in the National Capital
          Region.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E5E5E2] border border-[#E5E5E2]">
        {CITIES.map((c) => (
          <Link
            key={c.slug}
            to={`/coverage/${c.slug}`}
            className="group bg-white p-8 lg:p-10 hover:bg-[#F6F6F4] transition-colors"
            data-testid={`coverage-city-${c.slug}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={18} strokeWidth={1.5} className="text-[#B89055]" />
              <div className="overline text-[#525252]">{c.name}</div>
            </div>
            <h2 className="font-serif text-2xl text-[#0A0A0A]">
              Court Marriage in {c.name}
            </h2>
            <p className="mt-4 text-[#525252] leading-relaxed">{c.blurb}</p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm text-[#0B1F3A] group-hover:underline">
              View {c.name} details <ArrowUpRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
