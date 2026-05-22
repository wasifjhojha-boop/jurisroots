const SMA = [
  { n: "01", t: "Notice of Intended Marriage", d: "A formal written notice of marriage is filed with the Marriage Officer of the district where one party has resided for at least 30 days." },
  { n: "02", t: "30-day notice period", d: "The notice is publicly displayed on the Marriage Officer's notice board for 30 days. This period is mandatory under Section 5 of the SMA, 1954 and cannot be waived." },
  { n: "03", t: "Objection handling (if any)", d: "Any person may file an objection during the notice period. Objections are heard by the Marriage Officer; we represent you through this stage." },
  { n: "04", t: "Appearance before Marriage Officer", d: "After the notice period and any objections are resolved, both parties appear with three witnesses (each carrying valid ID and address proof)." },
  { n: "05", t: "Solemnisation & certificate issuance", d: "The marriage is solemnised before the Marriage Officer, the register is signed, and a certified marriage certificate is issued." },
];

const HMA = [
  { n: "01", t: "Marriage proof submission", d: "Photographs, invitation card, and supporting evidence of the religious ceremony are compiled." },
  { n: "02", t: "Application filing", d: "The registration application along with affidavits is filed at the SDM/Registrar office having jurisdiction." },
  { n: "03", t: "Verification", d: "Documents are verified, witnesses are presented, and an appointment is given by the Registrar." },
  { n: "04", t: "Certificate issuance", d: "The Registrar signs the entry and issues the certified marriage certificate, usually the same day." },
];

function Block({ steps, title, badge, time }) {
  return (
    <div>
      <div className="overline text-[#B89055] mb-3">{badge}</div>
      <h2 className="font-serif text-3xl lg:text-4xl text-[#0A0A0A] leading-tight">
        {title}
      </h2>
      <div className="mt-3 text-sm text-[#525252]">Typical timeline: {time}</div>
      <ol className="mt-10 space-y-8">
        {steps.map((s) => (
          <li
            key={s.n}
            className="grid grid-cols-[auto,1fr] gap-6 pb-6 border-b border-[#E5E5E2] last:border-0"
            data-testid={`step-${badge.toLowerCase()}-${s.n}`}
          >
            <div className="font-serif text-4xl text-[#0B1F3A]">{s.n}</div>
            <div>
              <h3 className="font-serif text-xl text-[#0A0A0A]">{s.t}</h3>
              <p className="mt-2 text-[#525252] leading-relaxed">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Process() {
  useSEO({
    title: "Process — SMA 1954 & HMA 1955 step-by-step",
    description: "Step-by-step legal process for court marriage under Special Marriage Act, 1954 and marriage registration under Hindu Marriage Act, 1955.",
  });
  return (
    <div
      className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24"
      data-testid="process-page"
    >
      <div className="max-w-3xl mb-16">
        <div className="overline text-[#0B1F3A] mb-4">The legal process</div>
        <h1 className="font-serif text-4xl lg:text-6xl text-[#0A0A0A] leading-tight">
          Two Acts. Two procedures. Mapped step-by-step.
        </h1>
        <p className="mt-6 text-[#525252] leading-relaxed text-lg">
          The procedure differs based on whether your marriage is being{" "}
          <em>solemnised</em> (Special Marriage Act) or{" "}
          <em>registered after solemnisation</em> (Hindu Marriage Act). Below
          is the legally accurate step-by-step for each.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <Block
          steps={SMA}
          title="Special Marriage Act, 1954"
          badge="SMA Process"
          time="35–45 days (statutory)"
        />
        <Block
          steps={HMA}
          title="Hindu Marriage Act, 1955"
          badge="HMA Process"
          time="5–10 working days"
        />
      </div>
    </div>
  );
}
