import { useEffect } from "react";

/**
 * Injects FAQPage structured data for rich snippets in Google search.
 * @param {Array} faqs - [{q: string, a: string}]
 */
export default function useFAQSchema(faqs) {
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    };
    let el = document.getElementById("faq-jsonld");
    if (!el) {
      el = document.createElement("script");
      el.id = "faq-jsonld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => {
      const ex = document.getElementById("faq-jsonld");
      if (ex) ex.remove();
    };
  }, [faqs]);
}
