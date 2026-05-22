import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Scale } from "lucide-react";
import { BUSINESS, CITIES, telLink } from "@/data/business";

export default function Footer() {
  return (
    <footer className="bg-[#081530] text-[#E5E5E2] mt-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 flex items-center justify-center bg-white text-[#0B1F3A]">
              <Scale size={18} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-serif text-xl text-white">{BUSINESS.name}</div>
              <div className="overline text-[#94A3B8]">{BUSINESS.tagline}</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#CBD5E1] max-w-sm">
            Advocate-led court marriage and marriage registration services
            across Delhi-NCR. Compliant with the Special Marriage Act, 1954 and
            the Hindu Marriage Act, 1955.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="overline text-[#94A3B8] mb-4">Services</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-white">Court Marriage</Link></li>
            <li><Link to="/services" className="hover:text-white">Marriage Registration</Link></li>
            <li><Link to="/services" className="hover:text-white">NRI Services</Link></li>
            <li><Link to="/services" className="hover:text-white">Certificate Services</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="overline text-[#94A3B8] mb-4">Coverage</div>
          <ul className="space-y-2 text-sm">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/coverage/${c.slug}`} className="hover:text-white">
                  Court Marriage in {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="overline text-[#94A3B8] mb-4">Reach Chambers</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Phone size={15} className="mt-0.5 text-[#B89055]" />
              <a href={telLink()} className="hover:text-white">{BUSINESS.phone_display}</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={15} className="mt-0.5 text-[#B89055]" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-white">{BUSINESS.email}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={15} className="mt-0.5 text-[#B89055]" />
              <span>{BUSINESS.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={15} className="mt-0.5 text-[#B89055]" />
              <span>{BUSINESS.hours}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#1E2A47]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8]">
          <div>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</div>
          <div>Disclaimer: This website does not solicit work. Consultations are confidential.</div>
        </div>
      </div>
    </footer>
  );
}
