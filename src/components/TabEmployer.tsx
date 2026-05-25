/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Copy, FileText, Check, Info } from "lucide-react";
import { calculateUoP, calculateZlecenie, formatPLN, UoPResult, ZlecenieResult } from "../types";
import AnimatedNumber from "./AnimatedNumber";

interface TabEmployerProps {
  isPro: boolean;
  onSaveCalculation: (title: string, amount: number, details: string, type: 'EMPLOYER_COST' | 'NET_PAY_COMPARISON' | 'HOURLY_CONVERSION') => void;
}

export default function TabEmployer({ isPro, onSaveCalculation }: TabEmployerProps) {
  // Stan wejściowy: wynagrodzenie brutto (zl)
  const [brutto, setBrutto] = useState<number>(8500);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Wyliczenia
  const uopRes: UoPResult = calculateUoP(brutto);
  const zlecenieRes: ZlecenieResult = calculateZlecenie(brutto, {
    isStudentUnder26: false,
    hasOtherJobWithZus: false,
    isSickPayChecked: true
  });

  const zlecenieKosztPracodawcy = brutto * 1.2048;

  // Różnica (narzut państwowy dla UoP): całkowity koszt - netto
  const uopNarzut = uopRes.calkowityKosztPracodawcy - uopRes.netto;
  const uopSocialProcent = uopRes.calkowityKosztPracodawcy > 0 ? (uopNarzut / uopRes.calkowityKosztPracodawcy) * 100 : 0;

  useEffect(() => {
    setIsSaved(false);
  }, [brutto]);

  // Funkcja kopiowania wyników do schowka
  const handleCopy = () => {
    const text = `--- KalkulatorB2B.pl - Wyniki dla kwoty brutto ${formatPLN(brutto)} ---
🏢 UMOWA O PRACĘ (UoP):
- Pełny koszt pracodawcy: ${formatPLN(uopRes.calkowityKosztPracodawcy)}
- Składki ZUS pracodawcy: ${formatPLN(uopRes.calkowityKosztPracodawcy - uopRes.brutto)}
- Wynagrodzenie brutto: ${formatPLN(uopRes.brutto)}
- Składki społeczne pracownika: ${formatPLN(uopRes.pracownikSocial.sumaSocial)}
- Składka zdrowotna pracownika: ${formatPLN(uopRes.pracownikZdrowotna)}
- Podatek dochodowy (PIT): ${formatPLN(uopRes.podatekDochodowy)}
- Wynagrodzenie netto (do kieszeni): ${formatPLN(uopRes.netto)}

📝 UMOWA ZLECENIE (Standard):
- Pełny koszt pracodawcy: ${formatPLN(zlecenieKosztPracodawcy)}
- Wynagrodzenie netto: ${formatPLN(zlecenieRes.netto)}

Różnica (ile pobiera państwo w składkach i podatkach): ${formatPLN(uopNarzut)} (${uopSocialProcent.toFixed(1)}% kosztu całkowitego)`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Zapisz wyliczenie do bazy LocalStorage
  const handleSave = () => {
    const details = `UoP Koszt: ${formatPLN(uopRes.calkowityKosztPracodawcy)} | Netto: ${formatPLN(uopRes.netto)}`;
    onSaveCalculation("Koszt pracownika", brutto, details, 'EMPLOYER_COST');
    setIsSaved(true);
  };

  // Slider percent position calculation (Zasada od 4242 do 40000)
  const sliderPercent = Math.min(100, Math.max(0, ((brutto - 4242) / (40000 - 4242)) * 100));

  return (
    <div className="space-y-8 print-full text-[#FAFAFA]">
      
      {/* Outer Calculator work area wrapping */}
      <div className="bg-[#1C1C1F] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_32px_64px_rgba(0,0,0,0.4)] space-y-6">
        
        <div>
          <label htmlFor="brutto-input" className="block text-[11px] font-medium tracking-wider uppercase text-[#A1A1AA] mb-2 font-sans">
            Miesięczne wynagrodzenie brutto z umowy
          </label>
          
          <div className="relative">
            <input
              type="number"
              name="brutto"
              id="brutto-input"
              value={brutto || ""}
              onChange={(e) => setBrutto(Math.max(0, parseFloat(e.target.value) || 0))}
              className="block h-12 w-full rounded-[10px] bg-[#09090B] border border-[#27272A] py-3 pl-4 pr-16 text-white font-mono text-base focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 focus:outline-none transition"
              placeholder="Wpisz np. 8500"
              aria-label="Wynagrodzenie brutto pracownika"
            />
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <span className="text-[#52525B] font-mono font-semibold text-sm">zł</span>
            </div>
          </div>
        </div>

        {/* Custom Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            id="brutto-slider"
            min="4242"
            max="40000"
            step="100"
            value={brutto}
            onChange={(e) => setBrutto(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:border-0 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#6366F1] [&::-moz-range-thumb]:border-0"
            style={{
              background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${sliderPercent}%, #27272A ${sliderPercent}%, #27272A 100%)`
            }}
            aria-label="Suwak wynagrodzenia brutto"
          />
          <div className="flex justify-between text-[11px] text-[#52525B] font-mono font-medium">
            <span>Min (4 242 zł)</span>
            <span>15 000 zł</span>
            <span>25 000 zł</span>
            <span>Max (40 000 zł)</span>
          </div>
        </div>

        {/* Style presets */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[5000, 8500, 12000, 15000, 20000, 25000].map((preset) => (
            <button
              key={preset}
              onClick={() => setBrutto(preset)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-tight transition cursor-pointer border ${
                brutto === preset
                  ? "bg-[#6366F1] border-transparent text-white"
                  : "bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1F]"
              }`}
            >
              {preset.toLocaleString("pl-PL")} PLN
            </button>
          ))}
        </div>

      </div>

      {/* Main output numbers cards panel */}
      <div className="grid gap-6 md:grid-cols-3 print-card-grid">
        
        {/* Cost card */}
        <div className="rounded-xl border border-[#27272A] bg-[#09090B] p-6">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            <span>Koszt Pracodawcy (UoP)</span>
            <div className="group relative">
              <Info className="h-3.5 w-3.5 text-[#52525B] hover:text-[#6366F1] cursor-pointer" />
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded bg-slate-950 p-2 text-[10px] normal-case text-[#A1A1AA] border border-[#27272A] opacity-0 transition group-hover:opacity-100 z-30">
                Łączny narzut (Składki ZUS po stronie przedsiębiorcy) wynosi 20.48% płacy zasadniczej brutto.
              </div>
            </div>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white font-mono print-mono">
            <AnimatedNumber value={uopRes.calkowityKosztPracodawcy} />
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#52525B]">
            <span>Płaca zasadnicza: {formatPLN(brutto)}</span>
          </div>
        </div>

        {/* Worker Netto card */}
        <div className="rounded-xl border border-[#10B981]/40 bg-[#10B981]/5 p-6">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#10B981]">
            <span>Wypłata Netto (Pracownik)</span>
            <span className="rounded bg-[#10B981]/15 px-1.5 py-0.5 text-[10px] text-[#10B981] font-semibold leading-none">Do kieszeni</span>
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#10B981] font-mono print-mono">
            <AnimatedNumber value={uopRes.netto} />
          </p>
          <p className="mt-2 text-xs text-[#A1A1AA]">
            Realny zysk na tradycyjnym etacie po odliczeniu PIT i składek ZUS.
          </p>
        </div>

        {/* Tax clamp card */}
        <div className="rounded-xl border border-[#27272A] bg-[#09090B] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
            Klin podatkowo-składkowy
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-rose-500 font-mono print-mono">
            <AnimatedNumber value={uopNarzut} />
          </p>
          <p className="mt-2 text-xs text-[#A1A1AA]">
            Klin państwowy odbiera <strong>{uopSocialProcent.toFixed(1)}%</strong> z całkowitej kwoty budżetu pracodawcy.
          </p>
        </div>
      </div>

      {/* Side-by-Side audit matrix table */}
      <div className="rounded-xl border border-[#27272A] bg-[#18181B] overflow-hidden shadow-xl print-full">
        <div className="border-b border-[#27272A] bg-[#1C1C1F] p-5">
          <h3 className="font-semibold text-white">Szczegółowa kalkulacja składowych (UoP vs Zlecenie)</h3>
          <p className="text-xs text-[#A1A1AA] mt-1">Suma opłat na ubezpieczenia przy kwocie {formatPLN(brutto)} brutto.</p>
        </div>
        
        <div className="overflow-x-auto border-t border-[#27272A]">
          <table className="min-w-full divide-y divide-[#27272A] text-sm font-sans">
            <thead>
              <tr className="bg-[#1C1C1F] text-[#A1A1AA]">
                <th className="px-6 py-3 text-left font-medium">Składnik/Składka</th>
                <th className="px-6 py-3 text-right font-medium">Umowa o Pracę (UoP)</th>
                <th className="px-6 py-3 text-right font-medium">Umowa Zlecenie (ZUS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A] text-[#A1A1AA]">
              {/* Employer Cost standard rows */}
              <tr>
                <td className="px-6 py-3.5 font-medium text-white">Suma kosztów pracodawcy</td>
                <td className="px-6 py-3.5 text-right font-mono font-bold text-white"><AnimatedNumber value={uopRes.calkowityKosztPracodawcy} /></td>
                <td className="px-6 py-3.5 text-right font-mono font-bold text-white"><AnimatedNumber value={zlecenieKosztPracodawcy} /></td>
              </tr>
              <tr className="text-xs text-[#52525B]">
                <td className="pl-10 px-6 py-2">Składki ZUS po stronie firmy (20.48%)</td>
                <td className="px-6 py-2 text-right font-mono">{formatPLN(uopRes.pracodawcaSocial.sumaSocial)}</td>
                <td className="px-6 py-2 text-right font-mono">{formatPLN(zlecenieKosztPracodawcy - uopRes.brutto)}</td>
              </tr>
              <tr className="font-medium text-white">
                <td className="px-6 py-3.5">Płaca podstawowa (Brutto)</td>
                <td className="px-6 py-3.5 text-right font-mono">{formatPLN(brutto)}</td>
                <td className="px-6 py-3.5 text-right font-mono">{formatPLN(brutto)}</td>
              </tr>
              <tr className="text-xs">
                <td className="pl-10 px-6 py-2">Składki emerytalno-rentowe pracownika</td>
                <td className="px-6 py-2 text-right font-mono">{formatPLN(uopRes.pracownikSocial.emerytalna + uopRes.pracownikSocial.rentowa)}</td>
                <td className="px-6 py-2 text-right font-mono">{formatPLN(zlecenieRes.zusSpoleczny * (11.26 / 13.71) || 0)}</td>
              </tr>
              <tr className="text-xs">
                <td className="pl-10 px-6 py-2">Ubezpieczenie chorobowe pracownika (2.45%)</td>
                <td className="px-6 py-2 text-right font-mono">{formatPLN(uopRes.pracownikSocial.chorobowa)}</td>
                <td className="px-6 py-2 text-right font-mono">{formatPLN(zlecenieRes.zusSpoleczny * (2.45 / 13.71) || 0)}</td>
              </tr>
              <tr className="text-xs">
                <td className="pl-10 px-6 py-2">Ubezpieczenie zdrowotne pracownika (9.00%)</td>
                <td className="px-6 py-2 text-right font-mono">{formatPLN(uopRes.pracownikZdrowotna)}</td>
                <td className="px-6 py-2 text-right font-mono">{formatPLN(zlecenieRes.zusZdrowotny)}</td>
              </tr>
              <tr>
                <td className="px-6 py-3">Należny podatek dochodowy (Zaliczka PIT)</td>
                <td className="px-6 py-3 text-right font-mono text-rose-500">-{formatPLN(uopRes.podatekDochodowy)}</td>
                <td className="px-6 py-3 text-right font-mono text-rose-500">-{formatPLN(zlecenieRes.podatekDochodowy)}</td>
              </tr>
              <tr className="bg-[#1C1C1F] font-bold text-white">
                <td className="px-6 py-4 flex items-center gap-2">
                  <span>Ostateczna wypłata NETTO</span>
                  <span className="rounded bg-[#10B981]/20 px-2 py-0.5 text-[10px] text-[#10B981] font-semibold border border-[#10B981]/30">Dla Pracownika</span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-[#10B981] text-lg"><AnimatedNumber value={uopRes.netto} /></td>
                <td className="px-6 py-4 text-right font-mono text-[#10B981] text-lg"><AnimatedNumber value={zlecenieRes.netto} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Control panel buttons row */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-[#27272A] print-hidden">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#1C1C1F] px-4 py-2.5 text-sm font-semibold text-white shadow-xs cursor-pointer transition"
            id="copy-btn-tab1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#10B981]" />
                <span>Skopiowano wyniki!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#A1A1AA]" />
                <span>Skopiuj wyliczenie do schowka</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#1C1C1F] px-4 py-2.5 text-sm font-semibold text-white shadow-xs cursor-pointer transition"
            id="pdf-btn-tab1"
          >
            <FileText className="h-4 w-4 text-[#A1A1AA]" />
            <span>Wygeneruj PDF</span>
          </button>
        </div>

        <div>
          {isPro ? (
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition duration-150 cursor-pointer ${
                isSaved
                  ? "bg-[#27272A] text-[#52525B]"
                  : "bg-[#6366F1] hover:bg-[#818CF8] text-white"
              }`}
            >
              {isSaved ? "Wyliczenie zapisane!" : "Zapisz w historii (PRO)"}
            </button>
          ) : (
            <div className="text-xs text-[#A1A1AA] italic max-w-xs text-right">
              Chcesz zachować ten raport? Kup wersję <span className="font-semibold text-[#818CF8]">Pro</span>, by włączyć historię scenariuszy.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
