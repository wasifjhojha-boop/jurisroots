import { useEffect, useState } from "react";
import { Scale, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "dcms_bci_disclaimer_accepted_v1";

export default function Disclaimer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-6"
      data-testid="bci-disclaimer-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-white border border-[#E5E5E2] shadow-2xl">
        <div className="p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-[#0B1F3A] text-white">
              <Scale size={18} strokeWidth={1.5} />
            </div>
            <div>
              <div className="overline text-[#0B1F3A]">Bar Council of India</div>
              <div className="font-serif text-lg text-[#0A0A0A]">Disclaimer &amp; Terms of Use</div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-[#525252] leading-relaxed max-h-[45vh] overflow-y-auto pr-1">
            <p className="text-[#0A0A0A] font-medium">
              As per the rules of the Bar Council of India, advocates are not
              permitted to solicit work or advertise.
            </p>
            <p>
              By accessing or clicking <strong>I Agree</strong>, the user
              acknowledges that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                There has been no advertisement, personal communication,
                solicitation, invitation, or inducement of any sort whatsoever
                from the chamber or any of its members to create an
                advocate–client relationship through this website.
              </li>
              <li>
                The information provided on this website is solely for the
                user's own information and should not be interpreted as
                soliciting or advertisement.
              </li>
              <li>
                The information made available on this website is not, and
                should not be, construed as legal advice. No advocate–client
                relationship is created by browsing or contacting us through
                this website.
              </li>
              <li>
                The chamber is not liable for any consequence of any action
                taken by the user relying on material on this website.
              </li>
              <li>
                Readers are advised to seek independent legal counsel before
                acting on any information contained on this website.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={accept}
              className="btn-primary justify-center"
              data-testid="bci-disclaimer-accept-btn"
            >
              <ShieldCheck size={16} /> I Agree &amp; Enter
            </button>
            <a
              href="https://www.barcouncilofindia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost justify-center"
              data-testid="bci-disclaimer-learn-link"
            >
              Read BCI rules
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
