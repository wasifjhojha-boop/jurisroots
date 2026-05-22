// Central business config.
export const BUSINESS = {
  name: "Delhi-NCR Court Marriage",
  tagline: "Advocate-Led Legal Services",
  phone: "+919718790097",
  phone_display: "+91 97187 90097",
  whatsapp: "919718790097",
  email: "contact@dcms.in",
  address: "Advocate's Chamber, Patiala House Courts Complex, New Delhi 110001",
  hours: "Mon–Sat · 09:30 – 18:00",
};

export const WHATSAPP_DEFAULT_MSG =
  "Hello, I'd like to enquire about court marriage / marriage registration services.";

export function whatsappLink(message = WHATSAPP_DEFAULT_MSG) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  return `tel:${BUSINESS.phone}`;
}

export const CITIES = [
  {
    slug: "delhi",
    name: "Delhi",
    blurb:
      "All SDM offices across Delhi — Patiala House, Tis Hazari, Saket, Karkardooma, Rohini, Dwarka.",
    sdm: [
      "Patiala House (New Delhi)",
      "Tis Hazari (Central Delhi)",
      "Saket (South Delhi)",
      "Karkardooma (East Delhi)",
      "Rohini (North-West Delhi)",
      "Dwarka (South-West Delhi)",
    ],
    notes:
      "Delhi has the most active marriage registrar offices in NCR. Jurisdiction is decided by where either partner has resided for the last 30 days.",
  },
  {
    slug: "noida",
    name: "Noida",
    blurb:
      "Court marriage and registration at the Sub-Registrar Office, Sector 33, Noida.",
    sdm: [
      "Sub-Registrar — Sector 33, Noida",
      "Tehsildar Office — Sector 27",
      "ADM Office — Surajpur",
    ],
    notes:
      "For Noida residents, the Gautam Budh Nagar district administration handles applications under both the Special Marriage Act and Hindu Marriage Act.",
  },
  {
    slug: "greater-noida",
    name: "Greater Noida",
    blurb:
      "Registration via the District Magistrate's office at Surajpur, Greater Noida.",
    sdm: [
      "DM Office — Surajpur, Greater Noida",
      "Sub-Registrar — Greater Noida",
      "Tehsildar — Dadri",
    ],
    notes:
      "Greater Noida cases are filed at the Surajpur complex. Residence proof in the Gautam Budh Nagar district is mandatory for jurisdiction.",
  },
  {
    slug: "ghaziabad",
    name: "Ghaziabad",
    blurb: "Court marriage and registration at the Collectorate, Ghaziabad.",
    sdm: ["Collectorate — Ghaziabad", "Sub-Registrar — Vijay Nagar"],
    notes:
      "Ghaziabad applications are processed at the Collectorate. Witness presence and residence proof in the district are essential.",
  },
  {
    slug: "gurugram",
    name: "Gurugram (Gurgaon)",
    blurb: "Registration at the Mini Secretariat, Gurugram District Court.",
    sdm: ["Mini Secretariat — Gurugram", "Tehsildar Office — Sector 14"],
    notes:
      "Gurugram applications fall under Haryana's marriage registration framework. We handle filings under the Haryana Compulsory Marriage Registration Rules along with the central Acts.",
  },
  {
    slug: "faridabad",
    name: "Faridabad",
    blurb: "Court marriage support at the Faridabad District Court complex.",
    sdm: ["DC Office — Sector 12, Faridabad", "Sub-Registrar — Ballabhgarh"],
    notes:
      "Faridabad filings happen at the DC office. Residence proof from within the Faridabad district is required for jurisdiction.",
  },
];

export const CITIES_LINE = "Delhi · Noida · Greater Noida · Ghaziabad · Gurugram · Faridabad";

export const SERVICES = [
  {
    key: "court-marriage-sma",
    title: "Court Marriage (Special Marriage Act, 1954)",
    short: "Solemnisation of civil marriage",
    desc: "Civil marriage conducted by a Marriage Officer under the Special Marriage Act, 1954 — for Hindu, Muslim, Christian, Sikh, Jain, Buddhist, Parsi, or any other community. Purely legal, secular ceremony — no religious rites involved.",
    points: [
      "Inter-faith marriages (Hindu–Muslim, Hindu–Christian, etc.)",
      "Inter-caste and inter-community marriages",
      "Marriages where religion is not a factor",
      "Notice of intended marriage drafting & filing",
      "Mandatory 30-day notice compliance",
      "Objection handling (if raised)",
      "Solemnisation before Marriage Officer",
      "Certified marriage certificate",
    ],
  },
  {
    key: "nikah-registration",
    title: "Nikah Registration in Delhi",
    short: "For Muslim marriages — Nikahnama & civil registration",
    desc: "Nikah is a religious solemnisation under Muslim Personal Law. While it is legally valid on its own, formal registration under the Special Marriage Act, 1954 or the Delhi Compulsory Registration of Marriage Order is essential for passports, visas, joint accounts, and legal protection. We handle nikahnama drafting, witness coordination, and SDM registration end-to-end.",
    points: [
      "Nikahnama drafting & vetting (Urdu/English)",
      "Witness (two adult Muslim males or one male + two females) arrangement",
      "Mehr amount documentation",
      "Qazi coordination (where required)",
      "Civil registration at the SDM office for legal record",
      "Apostille / MEA attestation for use abroad",
    ],
  },
  {
    key: "arya-samaj-marriage",
    title: "Arya Samaj Marriage in Delhi",
    short: "Vedic ceremony + same-day legal registration",
    desc: "An Arya Samaj marriage is solemnised under the Arya Marriage Validation Act, 1937 and is fully recognised by Indian law. The ceremony is conducted at a registered Arya Samaj Mandir, followed by court registration under the Hindu Marriage Act, 1955 — usually within the same week.",
    points: [
      "Arya Samaj Mandir coordination across Delhi-NCR",
      "Vedic havan & saptapadi ceremony",
      "Arya Samaj certificate issuance",
      "Court registration under HMA, 1955",
      "Marriage certificate from the Registrar",
      "Photographer and witness arrangement (optional)",
    ],
  },
  {
    key: "registration-hma",
    title: "Marriage Registration — Hindu Marriage Act, 1955",
    short: "For already-solemnised Hindu/Sikh/Jain/Buddhist marriages",
    desc: "Statutory registration of a marriage already solemnised under Hindu rites. The Act also applies to Sikh, Jain, and Buddhist marriages. Typically the fastest registration route when both parties belong to these communities.",
    points: [
      "Marriage proof submission (wedding photos, invitation card)",
      "Application drafting & filing",
      "Verification & registrar appointment",
      "Certificate issuance",
    ],
  },
  {
    key: "registration-sma",
    title: "Marriage Registration — Special Marriage Act",
    short: "For civil marriages & all religions",
    desc: "Registration of marriages conducted under civil procedure — valid for couples of any religion (Muslim, Christian, Parsi, etc.) where the Hindu Marriage Act does not apply. Also used to officially document a marriage for visa, immigration, and joint financial purposes.",
    points: [
      "Documentation review",
      "Application filing",
      "Registrar coordination",
      "Certified record",
    ],
  },
  {
    key: "urgent",
    title: "Urgent / Time-Sensitive Cases",
    short: "Legally compliant fast-tracking",
    desc: "Where a couple has urgent travel or visa requirements, we provide a structured, lawful process — without the misleading 'same-day court marriage' claims made by agents.",
    points: [
      "Legal feasibility review",
      "Fastest compliant route under HMA",
      "Document preparation in 24–48 hours",
      "No illegal shortcuts",
    ],
  },
  {
    key: "protection",
    title: "Protection for Couples (Runaway / Parental Opposition)",
    short: "Legal shield for adult couples",
    desc: "Where parents or relatives oppose the marriage, we file protection petitions before the High Court, coordinate police protection, and ensure the couple can marry lawfully and safely.",
    points: [
      "Protection petition under Article 226 of the Constitution",
      "Police protection orders",
      "Safe-house coordination (where required)",
      "Representation in family objections",
      "Confidential handling throughout",
    ],
  },
  {
    key: "nri",
    title: "NRI / Foreign National Marriage",
    short: "Cross-border legal compliance",
    desc: "Specialist representation for NRI, OCI, and foreign-national couples — covering passport, visa, apostille, embassy attestations, and mixed-nationality cases.",
    points: [
      "Passport & visa documentation",
      "Apostille / MEA legalisation",
      "Embassy & consulate compliance",
      "Mixed-nationality cases",
      "Power of Attorney (where travel not possible)",
    ],
  },
  {
    key: "certificate",
    title: "Marriage Certificate Services",
    short: "Duplicate, correction & recovery",
    desc: "Post-issuance certificate services including duplicate certificate issuance, name corrections, and recovery of lost certificates from the registrar's records.",
    points: [
      "Duplicate certificate issuance",
      "Name & detail correction",
      "Lost certificate recovery",
      "Apostille for foreign use",
    ],
  },
];
