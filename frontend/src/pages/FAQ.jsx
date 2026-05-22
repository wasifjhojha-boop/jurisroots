import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldAlert } from "lucide-react";
import useSEO from "@/hooks/useSEO";
import useFAQSchema from "@/hooks/useFAQSchema";
import Breadcrumbs from "@/components/Breadcrumbs";

const HOT_FAQS = [
  {
    q: "Can parents legally stop me from marrying?",
    a: "No. Once you are an adult (21 for men, 18 for women), you have an absolute legal right to marry a partner of your choice. Parents cannot block your marriage, and any attempt to forcibly prevent it — including confinement, threats, or violence — is a criminal offence. The Supreme Court has affirmed this right in multiple judgments (Lata Singh v. State of U.P., 2006; Shafin Jahan v. Asokan K.M., 2018).",
  },
  {
    q: "Can the police stop our court marriage?",
    a: "No. The police have no authority to prevent a lawful marriage between two consenting adults. In fact, under Supreme Court directions, the police are required to protect adult couples from harassment by family or community. If local police are pressured by your family, a High Court protection order to the SSP/DCP overrides it.",
  },
  {
    q: "My family is threatening us. What are our legal options?",
    a: "We file a protection petition under Article 226 of the Constitution in the High Court, seeking directions for police protection. These orders are typically granted within a week. Simultaneously, we begin the SMA notice process so the legal marriage can proceed in parallel with the protection. In urgent cases, we coordinate a safe meeting point and handle everything by phone/WhatsApp.",
  },
  {
    q: "Is a 'secret' or 'hidden' court marriage legally valid?",
    a: "Yes — any court marriage solemnised under the Special Marriage Act is legally valid regardless of whether your families know. However, we strongly recommend not hiding it from the legal system: file the 30-day notice, follow due process, and exercise your right openly with legal protection. This is safer and legally unimpeachable.",
  },
  {
    q: "Can my family file a case against us after we marry?",
    a: "Families sometimes file false complaints — kidnapping, wrongful confinement, or coercion — to harass adult couples. Such complaints are routinely quashed by the High Court when the woman is an adult and gives a statement of free consent. We represent both partners in any such proceedings.",
  },
  {
    q: "Do you handle runaway marriage cases?",
    a: "Yes. 'Runaway' cases — where a couple has left home due to parental opposition — are a regular part of our practice. We coordinate safe lodging (where needed), file protection petitions, and complete the legal marriage process. Every detail remains confidential.",
  },
  {
    q: "We are from different castes / religions and families are against it. Can you help?",
    a: "Yes. Inter-caste and inter-faith marriages are governed by the Special Marriage Act, 1954 — which is entirely secular. Neither caste nor religion is a legal barrier. We regularly represent Hindu–Muslim, Hindu–Christian, Hindu–Sikh, Sikh–Muslim, and other combinations. Parental approval is not required.",
  },
  {
    q: "What is court marriage in Delhi?",
    a: "A 'court marriage' is the civil solemnisation of marriage by a Marriage Officer under the Special Marriage Act, 1954. It is a purely legal ceremony — no religious rites are involved. Any two consenting adults of legal age can opt for it, irrespective of religion, caste, or community.",
  },
  {
    q: "What is the difference between court marriage and marriage registration?",
    a: "Court marriage (under SMA, 1954) is the actual solemnisation of the marriage by the Marriage Officer. Marriage registration (under HMA, 1955 or SMA) is the post-solemnisation legal recording of a marriage that has already taken place. The procedures and timelines are very different.",
  },
  {
    q: "Is the 30-day notice period mandatory?",
    a: "Yes — strictly. Section 5 of the Special Marriage Act, 1954 mandates a 30-day public notice period and it cannot legally be waived or 'fast-tracked' by anyone. Anybody promising same-day court marriage under SMA is misleading you.",
  },
  {
    q: "Can court marriage be done in one day?",
    a: "Court marriage under SMA cannot be completed in one day due to the mandatory 30-day notice. However, if both parties are Hindu (or Sikh/Jain/Buddhist) and already married by religious rites, the marriage can be registered under the Hindu Marriage Act, 1955 within 5–10 working days.",
  },
  {
    q: "Can we marry without parents' consent?",
    a: "Yes. The Special Marriage Act, 1954 does not require parental consent for adults. Both parties must be of legal age (21 for groom, 18 for bride) and capable of giving valid consent. Parents have no legal authority to block an adult's marriage.",
  },
  {
    q: "What documents are required for court marriage in Delhi?",
    a: "Identity proof (Aadhaar / Passport), address proof, age proof (10th certificate / birth certificate / passport), 6 passport-size photographs of each party, affidavit of marital status, and identity + photos of three witnesses. See the Documents page for a full checklist.",
  },
  {
    q: "How many witnesses are required?",
    a: "Three witnesses are required for solemnisation under the Special Marriage Act. For Hindu Marriage Act registration, two witnesses are typically required. Each witness must carry valid government-issued ID and address proof.",
  },
  {
    q: "Can Muslim, Christian, Parsi couples register marriage in Delhi-NCR?",
    a: "Yes. Muslim, Christian, Parsi, and all other-religion couples can register marriages either under their respective personal laws or under the secular Special Marriage Act, 1954. SMA is often chosen for its uniform procedure and wider international recognition.",
  },
  {
    q: "Can interfaith couples marry legally in India?",
    a: "Absolutely. Inter-faith marriages are legal and are registered under the Special Marriage Act, 1954 — a secular, civil statute that does not require either party to convert.",
  },
  {
    q: "What if both partners live in different states?",
    a: "The notice must be filed where one of the parties has resided for at least 30 continuous days prior to filing. So the couple may choose either party's jurisdiction. We help establish correct jurisdiction with valid residence proof.",
  },
  {
    q: "Can address proof be from another city?",
    a: "Yes — address proof may be from outside Delhi-NCR, but at least one party must have a valid 30-day residence proof in the district where the application is filed. This is non-negotiable for jurisdiction.",
  },
  {
    q: "What if the SDM rejects the application?",
    a: "Common reasons for rejection are wrong jurisdiction, missing or mismatched documents, or witness ID issues. We pre-vet every paper to avoid this. If a rejection still occurs, we file a corrective response or appeal as required.",
  },
  {
    q: "Is police verification required?",
    a: "Police verification is not a statutory requirement under SMA or HMA, but in some Delhi districts it is sought informally during the notice period. We coordinate with the relevant authorities on your behalf.",
  },
  {
    q: "Can an NRI marry an Indian citizen in Delhi?",
    a: "Yes. NRI / OCI / foreign national marriages are conducted under the Special Marriage Act. Additional documents — passport, visa, single-status certificate, embassy attestations — are required. We have a dedicated workflow for cross-border cases.",
  },
  {
    q: "What is the cost of court marriage in Delhi-NCR?",
    a: "Government fees are nominal (a few hundred rupees). Professional fees vary based on case complexity (HMA / SMA / NRI / protection). We share an itemised, fixed quotation upfront — no hidden charges.",
  },
  {
    q: "How long does the entire process take?",
    a: "HMA registration: 5–10 working days. SMA solemnisation: 35–45 days due to the statutory 30-day notice. NRI cases: 30–60 days depending on attestation timelines. Protection cases: High Court order in ~7 days, SMA notice runs in parallel.",
  },
  {
    q: "Can the marriage be kept confidential?",
    a: "Under SMA, the notice is legally required to be displayed publicly on the Marriage Officer's notice board for 30 days — this cannot be avoided. However, all communication with our chamber is strictly privileged and confidential. HMA registrations have no public notice requirement.",
  },
  {
    q: "What happens if someone files an objection during the notice period?",
    a: "The Marriage Officer hears the objection in a brief proceeding. Frivolous objections (merely by unhappy parents) are dismissed. We represent you through this process and ensure your application progresses lawfully.",
  },
  {
    q: "Is Aadhaar mandatory for court marriage?",
    a: "Aadhaar is one of the most commonly accepted documents for identity and address proof, but it is not the only option. Passport, Voter ID, and Driving Licence are also valid in most jurisdictions.",
  },
  {
    q: "Can divorced or widowed persons apply for court marriage?",
    a: "Yes. Divorced persons must submit a certified divorce decree. Widowed persons must submit the death certificate of the deceased spouse. The affidavit of marital status will reflect the same.",
  },
  {
    q: "What if there's a mismatch in documents (e.g., name spelling, DOB)?",
    a: "Document mismatches are the second-most-common cause of delays. We identify them upfront and either correct them through affidavits or guide you to update the underlying records (Aadhaar, PAN, passport) before filing.",
  },
  {
    q: "Are advocates better than agents for court marriage?",
    a: "Advocates are enrolled with the Bar Council, are accountable under the Advocates Act, and can represent you in any objection proceedings or appeals — including protection petitions in the High Court. Agents cannot. For a process this important, advocate representation is the safer route.",
  },
  {
    q: "Do I need to be physically present?",
    a: "Both parties must be physically present at the time of solemnisation under SMA. For NRI cases where one party absolutely cannot travel, a Power of Attorney can handle most procedural steps but solemnisation itself still requires personal presence.",
  },
];

export default function FAQ() {
  useSEO({
    title: "FAQ — Court Marriage Delhi-NCR (30 questions answered)",
    description: "Can parents stop you? Can police stop you? Is 30-day notice mandatory? 30 legally accurate answers to the most common court marriage questions.",
  });
  useFAQSchema(HOT_FAQS);
  return (
    <div data-testid="faq-page">
      <Breadcrumbs />
      {/* Header */}
      <section className="bg-[#0B1F3A] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="overline text-[#B89055] mb-4">Frequently asked</div>
          <h1 className="font-serif text-4xl lg:text-6xl leading-tight">
            Thirty questions — answered with legal accuracy.
          </h1>
          <p className="mt-6 text-[#CBD5E1] leading-relaxed text-lg max-w-2xl">
            Including the difficult ones most websites avoid: parental
            opposition, police protection, and hidden marriage. We answer
            honestly, citing the relevant law wherever possible.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="mb-10 flex items-center gap-3 border border-[#E5E5E2] bg-[#F6F6F4] p-5">
          <ShieldAlert size={18} className="text-[#B89055]" />
          <p className="text-sm text-[#525252] leading-relaxed">
            If your family is opposing your marriage and you feel unsafe, skip
            the reading — call or WhatsApp us directly. We handle these cases
            discreetly, starting within hours.
          </p>
        </div>

        <Accordion type="single" collapsible className="border-t border-[#E5E5E2]">
          {HOT_FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-[#E5E5E2]"
              data-testid={`faq-item-${i}`}
            >
              <AccordionTrigger className="text-left font-serif text-lg text-[#0A0A0A] hover:text-[#0B1F3A] py-6">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#525252] text-base leading-relaxed pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
