import { useParams, Link, Navigate } from "react-router-dom";
import {
  Phone,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Scale,
  Clock,
} from "lucide-react";
import {
  CITIES,
  BUSINESS,
  whatsappLink,
  telLink,
} from "@/data/business";
import useSEO from "@/hooks/useSEO";

export default function CityPage() {
  const { slug } = useParams();
  const city = CITIES.find((c) => c.slug === slug);
  useSEO(
    city
      ? {
          title: `Court Marriage in ${city.name} — Advocate-Led`,
          description: `Court marriage & registration services in ${city.name}. ${city.blurb} Advocate-led, SMA 1954 & HMA 1955.`,
        }
      : {}
  );
  if (!city) return <Navigate to="/coverage" replace />;

  return (
    <div data-testid={`city-page-${slug}`}>
      {/* Hero */}
      <section className="bg-[#0B1F3A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <Link
            to="/coverage"
            className="inline-flex items-center gap-1 text-sm text-[#CBD5E1] hover:text-white"
            data-testid="back-to-coverage"
          >
            <ArrowLeft size={14} /> All NCR coverage
          </Link>
          <div className="overline text-[#B89055] mt-6 mb-4">
            {city.name} · Delhi-NCR
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl leading-tight max-w-4xl">
            Court Marriage &amp; Registration Services in {city.name}
          </h1>
          <p className="mt-6 text-[#CBD5E1] max-w-3xl leading-relaxed text-lg">
            {city.blurb}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-accent" data-testid="city-book-btn">
              Book consultation
            </Link>
            <a href={telLink()} className="btn-ghost-light" data-testid="city-call-btn">
              <Phone size={14} /> {BUSINESS.phone_display}
            </a>
            <a
              href={whatsappLink(`Hello, I need help with court marriage in ${city.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              data-testid="city-whatsapp-btn"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="overline text-[#0B1F3A] mb-4">Filing offices we work with</div>
          <h2 className="font-serif text-3xl lg:text-4xl text-[#0A0A0A] leading-tight">
            Where your case will actually be filed.
          </h2>
          <p className="mt-5 text-[#525252] leading-relaxed">{city.notes}</p>

          <ul className="mt-8 border border-[#E5E5E2]">
            {city.sdm.map((s) => (
              <li
                key={s}
                className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E5E2] last:border-0"
              >
                <MapPin size={16} className="text-[#B89055]" />
                <span className="text-[#0A0A0A]">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-5 lg:pl-8">
          <div className="border border-[#E5E5E2] bg-[#F6F6F4] p-8">
            <div className="overline text-[#0B1F3A]">Services available in {city.name}</div>
            <ul className="mt-5 space-y-3">
              {[
                `Court Marriage in ${city.name} (Special Marriage Act)`,
                `Marriage Registration in ${city.name} (Hindu Marriage Act)`,
                "Notice drafting & filing",
                "Witness arrangement",
                "Apostille & embassy attestations (NRI)",
                "Certificate corrections & duplicates",
              ].map((it) => (
                <li key={it} className="flex items-start gap-2 text-sm text-[#0A0A0A]">
                  <CheckCircle2 size={14} className="mt-1 text-[#0B1F3A]" />
                  {it}
                </li>
              ))}
            </ul>
            <div className="divider-line my-6" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-[#0A0A0A]">
                <Scale size={14} className="text-[#B89055]" /> Advocate-led, not agents
              </div>
              <div className="flex items-center gap-2 text-[#0A0A0A]">
                <Clock size={14} className="text-[#B89055]" /> Quick response within working hours
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="bg-[#0B1F3A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
              Speak to an advocate handling {city.name} cases this week.
            </h2>
          </div>
          <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
            <Link to="/contact" className="btn-accent">Book now</Link>
            <a href={telLink()} className="btn-ghost-light">
              <Phone size={14} /> Call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
