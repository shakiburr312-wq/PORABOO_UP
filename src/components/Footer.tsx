import { Facebook, Instagram, Linkedin, Youtube, ExternalLink, ShieldCheck } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface FooterProps {
  onShowModal: (type: "privacy" | "terms" | "refund") => void;
}

export default function Footer({ onShowModal }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer id="poraboo-footer" className="bg-navy text-white pt-16 pb-8 border-t border-white/5 relative overflow-hidden">
      {/* Subtle bottom design accents */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/10 items-start">
          
          {/* Left Column: Brand & Slogan */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="logo-font text-3xl tracking-wider text-white select-none">
                PORABOO
              </span>
              <span className="px-2 py-0.5 text-[10px] bg-yellow/20 text-yellow border border-yellow/30 rounded-full font-bold">
                PRO
              </span>
            </div>
            <p className="text-sm font-medium text-white/80 max-w-sm">
              {t("footer_desc")}
            </p>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck className="w-4 h-4 text-teal" />
              <span>{t("footer_encrypted")}</span>
            </div>
          </div>

          {/* Middle Column: Useful Legal Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-yellow tracking-wider uppercase">{t("footer_policies")}</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onShowModal("privacy")}
                  className="text-sm text-white/70 hover:text-yellow flex items-center gap-1 group text-left transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">{t("footer_privacy")}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onShowModal("terms")}
                  className="text-sm text-white/70 hover:text-yellow flex items-center gap-1 group text-left transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">{t("footer_terms")}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onShowModal("refund")}
                  className="text-sm text-white/70 hover:text-yellow flex items-center gap-1 group text-left transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">{t("footer_refund")}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Right Column: Social Networks */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-yellow tracking-wider uppercase">{t("footer_connect")}</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              {t("footer_connect_desc")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 hover:bg-yellow hover:text-navy rounded-full transition-all duration-300 transform hover:-translate-y-1"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 hover:bg-yellow hover:text-navy rounded-full transition-all duration-300 transform hover:-translate-y-1"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 hover:bg-yellow hover:text-navy rounded-full transition-all duration-300 transform hover:-translate-y-1"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 hover:bg-yellow hover:text-navy rounded-full transition-all duration-300 transform hover:-translate-y-1"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p className="text-center sm:text-left select-none">
            {t("footer_copyright")}
          </p>
          <div className="flex items-center gap-4">
            <span>{t("footer_location")}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span>{t("footer_tagline")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
