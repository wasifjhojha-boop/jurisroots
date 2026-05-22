import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";

const LABELS = {
  services: "Services",
  coverage: "Coverage",
  process: "Process",
  documents: "Documents",
  faq: "FAQ",
  reviews: "Reviews",
  blog: "Journal",
  contact: "Contact",
  delhi: "Delhi",
  noida: "Noida",
  "greater-noida": "Greater Noida",
  ghaziabad: "Ghaziabad",
  gurugram: "Gurugram",
  faridabad: "Faridabad",
};

function label(slug) {
  return (
    LABELS[slug] ||
    slug
      .split("-")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" ")
  );
}

export default function Breadcrumbs({ trail }) {
  const location = useLocation();
  const parts = (location.pathname || "/").split("/").filter(Boolean);

  // Build trail: [{name, url}]
  const items = trail
    ? trail
    : [
        { name: "Home", url: "/" },
        ...parts.map((p, i) => ({
          name: label(p),
          url: "/" + parts.slice(0, i + 1).join("/"),
        })),
      ];

  // Inject breadcrumb JSON-LD
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: `https://jurisroots.com${it.url}`,
      })),
    };
    let el = document.getElementById("breadcrumb-jsonld");
    if (!el) {
      el = document.createElement("script");
      el.id = "breadcrumb-jsonld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => {
      const ex = document.getElementById("breadcrumb-jsonld");
      if (ex) ex.remove();
    };
  }, [items]);

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 text-xs"
      data-testid="breadcrumbs"
    >
      <ol className="flex flex-wrap items-center gap-1 text-[#525252]">
        {items.map((it, i) => (
          <li key={it.url} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-[#A8A29E]" />}
            {i === items.length - 1 ? (
              <span className="text-[#0A0A0A] font-medium">{it.name}</span>
            ) : (
              <Link to={it.url} className="hover:text-[#0B1F3A]">
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
