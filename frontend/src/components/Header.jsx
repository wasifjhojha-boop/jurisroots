import { Link } from "react-router-dom";
import { Menu, X, Phone, Scale } from "lucide-react";
import { useState } from "react";
import { BUSINESS, telLink } from "@/data/business";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/coverage", label: "Coverage" },
  { to: "/process", label: "Process" },
  { to: "/documents", label: "Documents" },
  { to: "/reviews", label: "Reviews" },
  { to: "/blog", label: "Journal" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-header sticky top-0 z-50" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3"
          data-testid="brand-logo-link"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-[#0B1F3A] text-white">
            <Scale size={18} strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg text-[#0A0A0A]">
              {BUSINESS.name}
            </div>
            <div className="overline text-[#525252]">
              {BUSINESS.tagline}
            </div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-[#0A0A0A] hover:text-[#0B1F3A] transition-colors font-medium"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          <a
            href={telLink()}
            className="btn-ghost"
            data-testid="nav-call-btn"
          >
            <Phone size={14} /> Call
          </a>
          <Link
            to="/login"
            className="btn-ghost"
            data-testid="nav-login-btn"
          >
            Sign in
          </Link>
          <Link
            to="/contact"
            className="btn-primary"
            data-testid="nav-book-btn"
          >
            Book consultation
          </Link>
        </div>

        <button
          className="xl:hidden"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden bg-white border-t border-[#E5E5E2]">
          <div className="px-6 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-[#0A0A0A] font-medium"
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="divider-line my-2" />
            <a
              href={telLink()}
              className="btn-ghost justify-center"
              data-testid="mobile-call-btn"
            >
              <Phone size={14} /> Call now
            </a>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="btn-ghost justify-center"
              data-testid="mobile-login-btn"
            >
              Sign in
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary justify-center"
              data-testid="mobile-book-btn"
            >
              Book consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
