import { useEffect } from "react";

const DEFAULT_TITLE = "Delhi-NCR Court Marriage — Advocate-Led Legal Services";
const DEFAULT_DESCRIPTION =
  "Advocate-led court marriage and marriage registration services across Delhi-NCR (Delhi, Noida, Greater Noida, Ghaziabad, Gurugram, Faridabad). Special Marriage Act 1954 & Hindu Marriage Act 1955. Full legal compliance, confidential, transparent fees.";

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Page-level SEO hook.
 * @param {object} opts
 *   title, description, canonical, ogImage, type (article|website)
 */
export default function useSEO({
  title,
  description,
  canonical,
  ogImage = "https://jurisroots.com/og-default.jpg",
  type = "website",
} = {}) {
  useEffect(() => {
    const finalTitle = title
      ? `${title} | Delhi-NCR Court Marriage`
      : DEFAULT_TITLE;
    const finalDesc = description || DEFAULT_DESCRIPTION;
    const finalCanonical =
      canonical ||
      (typeof window !== "undefined"
        ? `https://jurisroots.com${window.location.pathname}`
        : "");

    const prevTitle = document.title;
    document.title = finalTitle;

    setMeta("description", finalDesc);
    setMeta("og:title", finalTitle, "property");
    setMeta("og:description", finalDesc, "property");
    setMeta("og:url", finalCanonical, "property");
    setMeta("og:type", type, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:site_name", "Delhi-NCR Court Marriage", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", finalTitle);
    setMeta("twitter:description", finalDesc);
    setMeta("twitter:image", ogImage);
    setLink("canonical", finalCanonical);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonical, ogImage, type]);
}
