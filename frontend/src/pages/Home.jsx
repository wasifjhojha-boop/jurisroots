import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  Scale,
  ShieldCheck,
  FileCheck2,
  Clock,
  MapPin,
  Quote,
  Star,
  AlertTriangle,
  Heart,
  Siren,
  Gavel,
  UserCheck,
} from "lucide-react";
import {
  BUSINESS,
  CITIES,
  CITIES_LINE,
  SERVICES,
  whatsappLink,
  telLink,
} from "@/data/business";
import { REVIEWS } from "@/data/reviews";
import useSEO from "@/hooks/useSEO";

const HERO_IMG =
  "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1600&q=80";

const TRUST = [
  { label: "Advocate-led", sub: "Not agents" },
  { label: "1,000+ cases", sub: "Successfully assisted" },
  { label: "Confidential", sub: "Strictly private" },
  { label: "Fixed fees", sub: "No hidden charges" },
];

const WHY_US = [
  { icon: Scale, t: "Advocates, not agents", d: "Every case is handled directly by enrolled advocates of the Bar Council." },
  { icon: MapPin, t: "Court Marriage Registration service in Delhi NCR", d: "Active across Delhi, Noida, Greater Noida, Ghaziabad, Gurugram, and Faridabad." },
  { icon: FileCheck2, t: "Error-free documentation", d: "Every paper vetted before submission to avoid rejections and delays." },
  { icon: ShieldCheck, t: "Strict confidentiality", d: "Your case is privileged. Nothing leaves our service without your consent." },
  { icon: Clock, t: "Transparent timelines", d: "No 'same-day court marriage' false promises. We follow the Act." },
  { icon: Heart, t: "All faiths, all communities", d: "Hindu, Muslim, Christian, Sikh, Jain, Buddhist, Parsi — handled with equal respect." },
];

const PROTECTION_POINTS = [
  {
    icon: UserCheck,
    t: "You don't need parents' consent to marry",
    d: "Once you are an adult (18+ for women, 21+ for men), you have an absolute legal right to marry a partner of your choice — irrespective of religion, caste, or parental approval. The Supreme Court has upheld this in Lata Singh v. State of U.P. (2006) and reinforced it repeatedly since.",
  },
  {
    icon: Gavel,
    t: "Protection petition under Article 226",
    d: "If your family is threatening you, we file a writ petition before the High Court seeking police protection. Orders are routinely granted — often the same week. You can marry safely under court-mandated police protection.",
  },
  {
    icon: Siren,
    t: "The police cannot stop a legal marriage",
    d: "Police officers are bound by the Constitution and Supreme Court directions to protect adult couples — not to interfere. If local police are approached by your family, a High Court order to the SSP/DCP neutralises any pressure.",
  },
  {
    icon: ShieldCheck,
    t: "Confidentiality throughout",
    d: "Your identity, address, and case details never leave the chamber. For couples in hiding, we coordinate entirely by phone and WhatsApp, with safe meeting points if a physical visit is required.",
  },
];

const TESTIMONIAL_PREVIEW = REVIEWS.slice(0, 9);

export default function Home() {
  useSEO({
    title: "Court Marriage in Delhi-NCR by Advocates",
    description: "Court marriage & marriage registration across Delhi, Noida, Greater Noida, Ghaziabad, Gurugram, Faridabad. Advocate-led, SMA 1954 & HMA 1955, confidential, transparent fees.",
  });
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="bg-[#0B1F3A] text-white relative overflow-hidden" data-testid="hero-section">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/95 to-[#0B1F3A]/60" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-9">
              <div className="overline text-[#B89055] mb-6">{CITIES_LINE}</div>
             <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-tight">
  Court Marriage Registration Services in Delhi NCR
</h1>

<p className="mt-8 text-base lg:text-lg text-[#CBD5E1] max-w-2xl leading-relaxed">
  Professional legal assistance for court marriage, marriage registration, interfaith marriage, and documentation in Delhi NCR. Fast, secure, and legally compliant services for all communities.
</p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="btn-accent"
                  data-testid="hero-book-btn"
                >
                  Book confidential consultation
                  <ArrowUpRight size={16} />
                </Link>
                <a
                  href={telLink()}
                  className="btn-ghost-light"
                  data-testid="hero-call-btn"
                >
                  <Phone size={14} /> Call now
                </a>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  data-testid="hero-whatsapp-btn"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>

              <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {TRUST.map((t) => (
                  <div key={t.label} className="border-l border-[#B89055] pl-4">
                    <div className="font-serif text-2xl text-white">{t.label}</div>
                    <div className="text-xs text-[#94A3B8] mt-1">{t.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section
        className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24"
        data-testid="coverage-section"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-6">
            <div className="overline text-[#0B1F3A] mb-4">Jurisdiction matters</div>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#0A0A0A] leading-tight">
              Active across every major SDM &amp; registrar office in Delhi-NCR.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="text-[#525252] leading-relaxed">
              Marriage registration in India is jurisdictional — it must be filed
              where one of the partners has resided for at least 30 days. A wrong
              jurisdiction is the single biggest reason applications get returned.
              We file in the correct office, every time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E2] border border-[#E5E5E2]">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              to={`/coverage/${c.slug}`}
              className="group bg-white p-7 hover:bg-[#F6F6F4] transition-colors"
              data-testid={`coverage-card-${c.slug}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-serif text-xl text-[#0A0A0A]">
                  {c.name}
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-[#0B1F3A] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="mt-3 text-sm text-[#525252] leading-relaxed">
                {c.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* PROTECTION FOR COUPLES (parental opposition) */}
      <section
        className="bg-[#F6F6F4] border-y border-[#E5E5E2]"
        data-testid="protection-section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-7">
              <div className="overline text-[#0B1F3A] mb-4">
                Protection for couples · When families don't agree
              </div>
              <h2 className="font-serif text-3xl lg:text-5xl text-[#0A0A0A] leading-tight">
                Your legal right as an adult is absolute. We make sure you get to exercise it — safely.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-3">
              <p className="text-[#525252] leading-relaxed">
                Parental disapproval is the number-one reason couples across
                Delhi-NCR feel forced to marry in secret. It doesn't have to be
                that way. The law is entirely on your side — you just need
                someone who knows how to invoke it.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E5E5E2] border border-[#E5E5E2]">
            {PROTECTION_POINTS.map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="bg-white p-8"
                data-testid={`protection-card-${t.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`}
              >
                <Icon size={22} strokeWidth={1.4} className="text-[#B89055]" />
                <h3 className="mt-5 font-serif text-xl text-[#0A0A0A]">{t}</h3>
                <p className="mt-3 text-sm text-[#525252] leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={whatsappLink("Hi, my family is opposing our marriage. I need urgent advice on protection.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              data-testid="protection-whatsapp-btn"
            >
              <MessageCircle size={14} /> Urgent — WhatsApp now
            </a>
            <Link to="/contact" className="btn-primary" data-testid="protection-consult-btn">
              Confidential consultation
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24"
        data-testid="services-section"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-7">
            <div className="overline text-[#0B1F3A] mb-4">Our Services</div>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#0A0A0A] leading-tight">
              A clear legal route for every situation.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="text-[#525252] leading-relaxed">
              Every service is delivered under the correct statute — SMA 1954,
              HMA 1955, or the Constitution — by enrolled advocates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E5E5E2] border border-[#E5E5E2]">
          {SERVICES.map((s, i) => (
            <div
              key={s.key}
              className="bg-white p-8 lg:p-10"
              data-testid={`service-card-${s.key}`}
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-serif text-2xl text-[#B89055]">
                  0{i + 1}
                </span>
                <div className="overline text-[#525252]">{s.short}</div>
              </div>
              <h3 className="font-serif text-2xl text-[#0A0A0A]">
                {s.title}
              </h3>
              <p className="mt-4 text-[#525252] leading-relaxed">
                {s.desc}
              </p>
              <ul className="mt-5 space-y-2">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-sm text-[#0A0A0A]"
                  >
                    <CheckCircle2 size={14} className="mt-1 text-[#0B1F3A] flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* LEGAL CLARIFICATION */}
      <section
        className="bg-[#0B1F3A] text-white"
        data-testid="legal-clarification-section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-6">
              <div className="overline text-[#B89055] mb-4">Legal clarity</div>
              <h2 className="font-serif text-3xl lg:text-5xl leading-tight">
                What honest advocates will tell you (and most agents won't).
              </h2>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-2 border-[#B89055] pl-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-[#F59E0B]" />
                <div className="font-medium text-white">30-day notice is mandatory under SMA.</div>
              </div>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Section 5 of the Special Marriage Act, 1954 mandates a 30-day
                notice period. No advocate, agent, or office can legally waive
                it. Anyone promising "same-day court marriage" under SMA is
                misleading you.
              </p>
            </div>

            <div className="border-l-2 border-[#B89055] pl-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-[#F59E0B]" />
                <div className="font-medium text-white">
                  Same-day registration only under HMA — if already solemnised.
                </div>
              </div>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                The Hindu Marriage Act, 1955 allows registration of an existing
                Hindu/Sikh/Jain/Buddhist marriage in days, not weeks. We tell
                you upfront whether HMA applies.
              </p>
            </div>

            <div className="border-l-2 border-[#B89055] pl-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-[#4ADE80]" />
                <div className="font-medium text-white">
                  Only legally valid procedures are followed.
                </div>
              </div>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                No backdated affidavits, no fake witnesses, no manipulated
                jurisdiction. Every case stands up to scrutiny — including
                from foreign embassies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24" data-testid="why-us-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-7">
            <div className="overline text-[#0B1F3A] mb-4">Why us</div>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#0A0A0A] leading-tight">
              Six reasons couples across NCR choose our service.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E2] border border-[#E5E5E2]">
          {WHY_US.map(({ icon: Icon, t, d }) => (
            <div
              key={t}
              className="bg-white p-8"
              data-testid={`why-card-${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              <Icon size={22} strokeWidth={1.4} className="text-[#B89055]" />
              <h3 className="mt-5 font-serif text-xl text-[#0A0A0A]">{t}</h3>
              <p className="mt-3 text-sm text-[#525252] leading-relaxed">
                {d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS / CLIENT SATISFACTION */}
      <section
        className="bg-[#F6F6F4] border-y border-[#E5E5E2]"
        data-testid="reviews-section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 items-end">
            <div className="lg:col-span-8">
              <div className="overline text-[#0B1F3A] mb-4">Client Satisfaction</div>
              <h2 className="font-serif text-3xl lg:text-5xl text-[#0A0A0A] leading-tight">
                Reviews from couples we've represented.
              </h2>
              <p className="mt-4 text-[#525252] max-w-2xl">
                Across 1,000+ cases spanning every jurisdiction in NCR. A few
                reviews are anonymised on request — those in protection or
                sensitive cases.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <div className="flex items-center gap-2 lg:justify-end text-[#B89055]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <div className="mt-2 font-serif text-2xl text-[#0A0A0A]">
                4.9 / 5 · {REVIEWS.length} reviews
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIAL_PREVIEW.map((t, i) => (
              <div
                key={i}
                className="border border-[#E5E5E2] p-6 bg-white flex flex-col"
                data-testid={`review-preview-${i}`}
              >
                <Quote size={18} className="text-[#B89055]" />
                <p className="mt-4 text-[#0A0A0A] leading-relaxed text-sm flex-1">
                  {t.q}
                </p>
                <div className="flex items-center gap-1 mt-5 text-[#B89055]">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} fill="currentColor" />
                  ))}
                </div>
                <div className="mt-3">
                  <div className="font-medium text-[#0A0A0A] text-sm">{t.n}</div>
                  <div className="text-xs text-[#525252]">
                    {t.loc} · {t.c}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/reviews" className="btn-ghost" data-testid="all-reviews-btn">
              View all {REVIEWS.length} reviews <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B1F3A] text-white" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="overline text-[#B89055] mb-3">Limited consultation slots</div>
            <h2 className="font-serif text-3xl lg:text-5xl leading-tight">
              Speak to an advocate today.
            </h2>
            <p className="mt-4 text-[#CBD5E1] max-w-xl">
              Quick response within working hours. Confidential consultation —
              no obligation.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <Link to="/contact" className="btn-accent" data-testid="cta-book-btn">
              Book consultation
            </Link>
            <a href={telLink()} className="btn-ghost-light" data-testid="cta-call-btn">
              <Phone size={14} /> Call now
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              data-testid="cta-whatsapp-btn"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
