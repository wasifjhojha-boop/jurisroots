import { MessageCircle, Phone } from "lucide-react";
import { whatsappLink, telLink } from "@/data/business";

export default function FloatingActions() {
  return (
    <div className="floating-actions" data-testid="floating-actions">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-whatsapp"
        aria-label="WhatsApp us"
        data-testid="floating-whatsapp-btn"
      >
        <MessageCircle size={22} strokeWidth={1.8} />
      </a>
      <a
        href={telLink()}
        className="floating-btn floating-call"
        aria-label="Call us"
        data-testid="floating-call-btn"
      >
        <Phone size={20} strokeWidth={1.8} />
      </a>
    </div>
  );
}
