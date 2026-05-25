/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Copy, FileText, Check, Globe, Calendar, Settings } from "lucide-react";
import { formatPLN, formatEUR } from "../types";
import AnimatedNumber from "./AnimatedNumber";

interface TabHourlyProps {
  isPro: boolean;
  onSaveCalculation: (title: string, amount: number, details: string, type: 'EMPLOYER_COST' | 'NET_PAY_COMPARISON' | 'HOURLY_CONVERSION') => void;
}

export default function TabHourly({ isPro, onSaveCalculation }: TabHourlyProps) {
  // Stany: kwota wejściowa
  const [baseAmount, setBaseAmount] = useState<number>(18000);
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  
  // Customizacja kursu EUR
  const [useCustomEurRate, setUseCustomEurRate] = useState<boolean>(false);
  const [customEurRate, setCustomEurRate] = useState<number>(4.28); // Standardowy kurs np. ze stycznia 2026

  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(false);
  }, [baseAmount, isAnnual, useCustomEurRate, customEurRate]);

  // Pomocnicze obliczenia
  const monthlyAmount = isAnnual ? (baseAmount / 12) : baseAmount;
  const eurRateToUse = useCustomEurRate ? customEurRate : 4.28;

  // Obliczanie stawek godzinowych dla podstawowych godzin roboczych: 160, 168, 176
  const calcRates = (hours: number) => {
    const plnRate = monthlyAmount / hours;
    const eurRate = plnRate / eurRateToUse;
    return { plnRate, eurRate };
  };

  const r160 = calcRates(160);
  const r168 = calcRates(168);
  const r176 = calcRates(176);

  // Kopiowanie raportu do schowka
  const handleCopy = () => {
    const basisLabel = isAnnual ? "rocznego (rocznie)" : "miesięcznego (miesięcznie)";
    const text = `--- KalkulatorB2B.pl - Stawka Godzinowa PLN/EUR (2026) ---
Kwota bazowa: ${formatPLN(baseAmount)} brutto bazując na wymiarze ${basisLabel}.
Średni rozliczany kurs EUR: 1 EUR = ${eurRateToUse.toFixed(4)} PLN

WYLICZENIA STAWEK GODZINOWYCH:

1. Wymiar 160 godzin (krótki miesiąc roboczy):
   - PLN: ${formatPLN(r160.plnRate)} / godzinę
   - EUR: ${formatEUR(r160.eurRate)} / godzinę

2. Wymiar 168 godzin (standardowy miesiąc):
   - PLN: ${formatPLN(r168.plnRate)} / godzinę
   - EUR: ${formatEUR(r168.eurRate)} / godzinę

3. Wymiar 176 godzin (długi miesiąc roboczy):
   - PLN: ${formatPLN(r176.plnRate)} / godzinę
   - EUR: ${formatEUR(r176.eurRate)} / godzinę`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = () => {
    const details = `Dla ${formatPLN(monthlyAmount)}/msc | Stawka (168h): ${formatPLN(r168.plnRate)}/h`;
    onSaveCalculation("Przeliczenie stawki godzinowej", baseAmount, details, 'HOURLY_CONVERSION');
    setIsSaved(true);
  };

  // Slider percent position calculation (Zasada od 5000 do 60000)
  const minSliderVal = 5000;
  const maxSliderVal = 60000;
  const sliderPercent = Math.min(100, Math.max(0, ((baseAmount - minSliderVal) / (maxSliderVal - minSliderVal)) * 100));

  return (
    <div className="space-y-8 print-full text-[#FAFAFA]">
      
      {/* Outer Calculator workspace wrapping */}
      <div className="bg-[#1C1C1F] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_32px_64px_rgba(0,0,0,0.4)] space-y-6">
        
        {/* Toggle of Month / Year basis */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
          <div>
            <h4 className="font-semibold text-white text-sm">Horyzont czasowy kwoty bazowej</h4>
            <p className="text-xs text-[#A1A1AA] mt-0.5">Wybierz czy podajesz kwotę w ujęciu rocznym czy miesięcznym.</p>
          </div>
          <div className="inline-flex rounded-lg bg-[#09090B] p-1 border border-[#27272A]">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-md px-4 py-2 text-xs font-semibold cursor-pointer transition ${
                !isAnnual
                  ? "bg-[#6366F1] text-white"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Miesięcznie
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-md px-4 py-2 text-xs font-semibold cursor-pointer transition ${
                isAnnual
                  ? "bg-[#6366F1] text-white"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Rocznie
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="hourly-input" className="block text-[11px] font-medium tracking-wider uppercase text-[#A1A1AA] mb-2 font-sans">
            {isAnnual ? "Roczna kwota do przeliczenia (Brutto / B2B Netto)" : "Miesięczna kwota do przeliczenia (Brutto / B2B Netto)"}
          </label>
          <div className="relative">
            <input
              type="number"
              id="hourly-input"
              value={baseAmount || ""}
              onChange={(e) => setBaseAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="block h-12 w-full rounded-[10px] bg-[#09090B] border border-[#27272A] py-3 pl-4 pr-16 text-white font-mono text-base focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 focus:outline-none transition"
              aria-label="Kwota bazowa do przeliczenia stawki"
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
            id="hourly-slider"
            min={minSliderVal}
            max={maxSliderVal}
            step="500"
            value={baseAmount}
            onChange={(e) => setBaseAmount(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:border-0 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#6366F1] [&::-moz-range-thumb]:border-0"
            style={{
              background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${sliderPercent}%, #27272A ${sliderPercent}%, #27272A 100%)`
            }}
            aria-label="Suwak kwoty stawki godzinowej"
          />
          <div className="flex justify-between text-[11px] text-[#52525B] font-mono font-medium">
            <span>5 000 zł</span>
            <span>20 000 zł</span>
            <span>40 000 zł</span>
            <span>60 000 zł</span>
          </div>
        </div>

        {/* Currency setting toggle customized */}
        <div className="border-t border-[#27272A] pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#A1A1AA]" />
              <label htmlFor="custom-eur-toggle" className="text-xs font-semibold text-[#A1A1AA] cursor-pointer">
                Ręczny kurs EUR (domyślny: 4.28 zł)
              </label>
            </div>
            <input
              type="checkbox"
              id="custom-eur-toggle"
              checked={useCustomEurRate}
              onChange={(e) => setUseCustomEurRate(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-[#27272A] bg-[#09090B] accent-[#6366F1] cursor-pointer"
            />
          </div>

          {useCustomEurRate && (
            <div className="grid gap-3 sm:grid-cols-2 animate-fadeIn">
              <div>
                <label htmlFor="eur-rate-input" className="block text-[11px] font-medium tracking-wider uppercase text-[#A1A1AA] mb-1.5">Kurs przeliczenia (1 EUR)</label>
                <div className="relative">
                  <input
                    type="number"
                    id="eur-rate-input"
                    step="0.01"
                    min="1"
                    max="10"
                    value={customEurRate}
                    onChange={(e) => setCustomEurRate(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="block h-10 w-full rounded-[8px] bg-[#09090B] border border-[#27272A] py-2 pl-3 pr-12 text-white font-mono text-xs focus:border-[#6366F1] focus:outline-none"
                    aria-label="Niestandardowy kurs EUR"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <span className="text-[#52525B] font-mono text-[10px] font-semibold">PLN</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Grid of Results cards */}
      <div className="grid gap-6 md:grid-cols-3 print-card-grid">
        
        {/* Scenario 160h */}
        <div className="rounded-xl border border-[#27272A] bg-[#09090B] p-6 hover:border-[#3F3F46] transition-all">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            <span>160 h (Krótki miesiąc)</span>
            <Calendar className="h-3.5 w-3.5 text-[#52525B]" />
          </div>
          
          <div className="mt-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider block">Stawka robocza PLN</span>
              <p className="text-[28px] font-semibold font-mono tracking-tight text-white leading-none mt-1">
                <AnimatedNumber value={r160.plnRate} />
                <span className="text-xs text-[#52525B] font-sans font-medium"> / h</span>
              </p>
            </div>
            
            <div className="pt-3 border-t border-[#1C1C1F]">
              <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider block">Wymiar walutowy EUR</span>
              <p className="text-[24px] font-semibold font-mono tracking-tight text-[#818CF8] leading-none mt-1">
                <AnimatedNumber value={r160.eurRate} format="EUR" />
                <span className="text-xs text-[#52525B] font-sans font-medium"> / h</span>
              </p>
            </div>
          </div>
        </div>

        {/* Scenario 168h */}
        <div className="rounded-xl border border-[#6366F1]/50 bg-[#6366F1]/[0.05] p-6 hover:border-[#6366F1] transition-all">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#818CF8]">
            <span>168 h (Średni miesiąc)</span>
            <Calendar className="h-3.5 w-3.5 text-[#818CF8] animate-pulse" />
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider block">Stawka robocza PLN</span>
              <p className="text-[28px] font-bold font-mono tracking-tight text-white leading-none mt-1">
                <AnimatedNumber value={r168.plnRate} />
                <span className="text-xs text-[#52525B] font-sans font-medium"> / h</span>
              </p>
            </div>

            <div className="pt-3 border-t border-[#1C1C1F]">
              <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider block">Wymiar walutowy EUR</span>
              <p className="text-[24px] font-bold font-mono tracking-tight text-[#818CF8] leading-none mt-1">
                <AnimatedNumber value={r168.eurRate} format="EUR" />
                <span className="text-xs text-[#52525B] font-sans font-medium"> / h</span>
              </p>
            </div>
          </div>
        </div>

        {/* Scenario 176h */}
        <div className="rounded-xl border border-[#27272A] bg-[#09090B] p-6 hover:border-[#3F3F46] transition-all">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            <span>176 h (Długi miesiąc)</span>
            <Calendar className="h-3.5 w-3.5 text-[#52525B]" />
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider block">Stawka robocza PLN</span>
              <p className="text-[28px] font-semibold font-mono tracking-tight text-white leading-none mt-1">
                <AnimatedNumber value={r176.plnRate} />
                <span className="text-xs text-[#52525B] font-sans font-medium"> / h</span>
              </p>
            </div>

            <div className="pt-3 border-t border-[#1C1C1F]">
              <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider block">Wymiar walutowy EUR</span>
              <p className="text-[24px] font-semibold font-mono tracking-tight text-[#818CF8] leading-none mt-1">
                <AnimatedNumber value={r176.eurRate} format="EUR" />
                <span className="text-xs text-[#52525B] font-sans font-medium"> / h</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Buttons controls row */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-[#27272A] print-hidden">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#1C1C1F] px-4 py-2.5 text-sm font-semibold text-white shadow-xs cursor-pointer transition"
            id="copy-btn-tab3"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#10B981]" />
                <span>Skopiowano stawki!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#A1A1AA]" />
                <span>Skopiuj raport godzinowy</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#1C1C1F] px-4 py-2.5 text-sm font-semibold text-white shadow-xs cursor-pointer transition"
            id="pdf-btn-tab3"
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
              {isSaved ? "Scenariusz zapisany!" : "Zapisz scenariusz (PRO)"}
            </button>
          ) : (
            <div className="text-xs text-[#A1A1AA] italic max-w-xs text-right">
              Chcesz zachować to zestawienie? Wybierz pakiet <span className="font-semibold text-[#818CF8]">Pro</span>, by włączyć historię scenariuszy.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
