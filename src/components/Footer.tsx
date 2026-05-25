/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Landmark, ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

interface FooterProps {
  onScrollTo: (id: string) => void;
}

export default function Footer({ onScrollTo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#27272A] bg-[#0F0F10] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          
          {/* Brand block */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onScrollTo("hero")}>
              <span className="font-mono text-[18px] font-bold tracking-tight text-[#6366F1]">
                KB2B<span className="text-zinc-500 font-normal">.pl</span>
              </span>
            </div>
            
            <p className="text-xs text-[#A1A1AA] max-w-sm leading-relaxed">
              Twój niezawodny doradca podatkowy online na rok 2026. Porównaj Umowę o Pracę (UoP), kontrakt B2B z ryczałtem IT lub liniówką oraz umowy cywilnoprawne w kilka sekund.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10 w-fit">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Najnowsza aktualizacja stawek: <strong className="font-semibold text-white">styczeń 2026</strong></span>
            </div>
          </div>

          {/* Useful links */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-wider text-[#52525B] mb-4">Narzędzie</h3>
            <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
              <li>
                <button onClick={() => onScrollTo("kalkulator")} className="hover:text-white cursor-pointer text-left transition duration-150">
                  Kalkulator podatków 2026
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo("pricing")} className="hover:text-white cursor-pointer text-left transition duration-150">
                  Cennik planów Pro
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo("faq")} className="hover:text-white cursor-pointer text-left transition duration-150">
                  Najczęstsze pytania (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* External resources */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-wider text-[#52525B] mb-4">Weryfikacja rządowa</h3>
            <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
              <li>
                <a
                  href="https://www.zus.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition duration-150"
                >
                  <span>Portal ZUS Biznes</span>
                  <ArrowUpRight className="h-3 w-3 text-[#52525B]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.podatki.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition duration-150"
                >
                  <span>Kalkulator darmowy ministerstwa</span>
                  <ArrowUpRight className="h-3 w-3 text-[#52525B]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.biznes.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition duration-150"
                >
                  <span>Poradnik Mały ZUS Plus</span>
                  <ArrowUpRight className="h-3 w-3 text-[#52525B]" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer block & Copyright */}
        <div className="mt-12 pt-8 border-t border-[#27272A] text-center space-y-4">
          <div className="max-w-3xl mx-auto rounded-xl bg-amber-500/5 px-4 py-3 border border-amber-500/10 text-[11px] text-amber-500/80 leading-relaxed font-medium">
            ⚠️ <strong>Klauzula prawna (Disclaimer):</strong> Wyniki generowane przez KalkulatorB2B.pl mają charakter wyłącznie informacyjny, edukacyjny i są szacunkami matematycznymi opartymi o przepisy ustawowe aktualne na styczeń 2026 r. Nie mogą one zastępować profesjonalnej porady księgowej ani indywidualnego doradztwa podatkowego. Skonsultuj się z certyfikowanym księgowym przed formalnym podjęciem decyzji o wyborze formy opodatkowania lub podpisaniu kontraktu.
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#52525B]">
            <span>
              &copy; {currentYear} KalkulatorB2B.pl. Wszelkie prawa zastrzeżone. Wdrożono na rok 2026.
            </span>
            <span className="flex items-center gap-1.5">
              <span>Stworzone dla ambitnych przedsiębiorców z</span>
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
              <span>w Polsce.</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
