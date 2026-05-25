/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Check, Copy, FileText, ArrowUpRight, Scale, Sparkles, Building2, HelpCircle, Briefcase } from "lucide-react";
import { calculateUoP, calculateB2B, formatPLN, B2BResult, UoPResult, B2BOptions } from "../types";
import AnimatedNumber from "./AnimatedNumber";

interface TabEmployeeProps {
  isPro: boolean;
  onSaveCalculation: (title: string, amount: number, details: string, type: 'EMPLOYER_COST' | 'NET_PAY_COMPARISON' | 'HOURLY_CONVERSION') => void;
}

export default function TabEmployee({ isPro, onSaveCalculation }: TabEmployeeProps) {
  // Stan: kwota podstawowa
  const [amount, setAmount] = useState<number>(15000);
  
  // Czy kwoty UoP/B2B są zsynchronizowane czy oddzielne
  const [syncAmounts, setSyncAmounts] = useState<boolean>(true);
  const [b2bAmount, setB2bAmount] = useState<number>(15000);

  // Ustawienia B2B
  const [b2bTax, setB2bTax] = useState<'RYCZALT' | 'LINEAR' | 'SCALE'>('RYCZALT');
  const [b2bZus, setB2bZus] = useState<'NONE' | 'PREFERENTIAL' | 'FULL'>('PREFERENTIAL');
  const [expenses, setExpenses] = useState<number>(300); // Standardowe koszty np. księgowa
  const [isSickPay, setIsSickPay] = useState<boolean>(true);

  // Zabezpieczenie synchronizacji kwot
  useEffect(() => {
    if (syncAmounts) {
      setB2bAmount(amount);
    }
  }, [amount, syncAmounts]);

  const uopValue = amount;
  const b2bValue = syncAmounts ? amount : b2bAmount;

  // Obliczenia
  const uopRes: UoPResult = calculateUoP(uopValue);
  
  const b2bOpts: B2BOptions = {
    taxType: b2bTax,
    zusType: b2bZus,
    expenses,
    isSickPayChecked: isSickPay
  };
  const b2bRes: B2BResult = calculateB2B(b2bValue, b2bOpts);

  // Analiza ostateczna: która opcja lepsza
  const uopNetto = uopRes.netto;
  const b2bNetto = b2bRes.netto;
  
  const b2bBetter = b2bNetto > uopNetto;
  const nettoDiff = Math.abs(b2bNetto - uopNetto);
  const annualDiff = nettoDiff * 12;

  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(false);
  }, [amount, b2bAmount, b2bTax, b2bZus, expenses, isSickPay, syncAmounts]);

  // Kopiowanie raportu porównawczego
  const handleCopy = () => {
    const text = `--- KalkulatorB2B.pl - Raport Porównawczy UoP vs B2B (2026) ---
Sytuacja:
- Umowa o Pracę (UoP): ${formatPLN(uopValue)} brutto
- Kontrakt B2B: ${formatPLN(b2bValue)} netto na fakturze

USTAWIENIA B2B:
- Podatek: ${b2bOpts.taxType === 'RYCZALT' ? 'Ryczałt IT 12%' : (b2bOpts.taxType === 'LINEAR' ? 'Podatek liniowy 19%' : 'Skala ogólna 12%/32%')}
- ZUS społeczny: ${b2bOpts.zusType === 'NONE' ? 'Zwolnienie (Ulga na start)' : (b2bOpts.zusType === 'PREFERENTIAL' ? 'ZUS preferencyjny (Mały ZUS)' : 'Pełny social ZUS')}
- Miesięczne koszty działalności: ${formatPLN(expenses)}

WYNIKI:
💰 UMOWA O PRACĘ (UoP):
- Netto "na rękę": ${formatPLN(uopNetto)}

💼 KONTRAKT B2B:
- Netto "do kieszeni": ${formatPLN(b2bNetto)}
- Składka zdrowotna ZUS: ${formatPLN(b2bRes.zusZdrowotny)}
- Składki społeczne ZUS: ${formatPLN(b2bRes.zusSpoleczny)}
- Podatek dochodowy: ${formatPLN(b2bRes.podatekDochodowy)}

Rekomendacja:
👉 Zdecydowanie bardziej opłaca się ${b2bBetter ? 'KONTRAKT B2B' : 'UMOWA O PRACĘ (UoP)'}!
👉 Twoje netto będzie WIĘKSZE o: ${formatPLN(nettoDiff)} miesięcznie (czyli ${formatPLN(annualDiff)} rocznie).`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = () => {
    const details = `Lepsza opcja: ${b2bBetter ? 'B2B' : 'UoP'} o +${formatPLN(nettoDiff)}/msc`;
    onSaveCalculation("Porównanie netto UoP vs B2B", amount, details, 'NET_PAY_COMPARISON');
    setIsSaved(true);
  };

  // Kalkulator slider fill percent (Zakres od 5000 do 35000)
  const uopSliderPercent = Math.min(100, Math.max(0, ((amount - 5000) / (35000 - 5000)) * 100));

  return (
    <div className="space-y-8 print-full text-[#FAFAFA]">
      
      {/* Outer Calculator workspace container */}
      <div className="bg-[#1C1C1F] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_32px_64px_rgba(0,0,0,0.4)] space-y-8">
        
        {/* Input parameters block */}
        <div className="grid gap-6 md:grid-cols-2 print-hidden">
          
          {/* Left panel: Salary configurations */}
          <div className="space-y-5">
            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.06em] uppercase text-[#52525B]">
              <Briefcase className="h-4 w-4 text-[#6366F1]" />
              <span>Kwota bazowa kontraktu</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="uop-salary" className="block text-[11px] font-medium tracking-wider uppercase text-[#A1A1AA] mb-2">
                  {syncAmounts ? "Wspólne Wynagrodzenie (UoP brutto / B2B netto)" : "UoP Brutto (Podstawa)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="uop-salary"
                    value={amount || ""}
                    onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="block h-12 w-full rounded-[10px] bg-[#09090B] border border-[#27272A] py-3 pl-4 pr-16 text-white font-mono text-base focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 focus:outline-none transition duration-150"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <span className="text-[#52525B] font-mono text-sm font-semibold">zł</span>
                  </div>
                </div>
              </div>

              {/* Synchronize Checkbox */}
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="sync-toggle"
                  checked={syncAmounts}
                  onChange={(e) => setSyncAmounts(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-[#27272A] bg-[#09090B] list-none accent-[#6366F1]"
                />
                <label htmlFor="sync-toggle" className="text-xs font-medium text-[#A1A1AA] cursor-pointer hover:text-white select-none transition">
                  Synchronizuj kwotę UoP i B2B (Faktura Netto)
                </label>
              </div>

              {/* Non-synced B2B Input */}
              {!syncAmounts && (
                <div className="pt-2 animate-fadeIn">
                  <label htmlFor="b2b-salary" className="block text-[11px] font-medium tracking-wider uppercase text-[#A1A1AA] mb-2">
                    Kontrakt B2B Netto na fakturze
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="b2b-salary"
                      value={b2bAmount || ""}
                      onChange={(e) => setB2bAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="block h-12 w-full rounded-[10px] bg-[#09090B] border border-[#27272A] py-3 pl-4 pr-16 text-white font-mono text-base focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 focus:outline-none transition duration-150"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                      <span className="text-[#52525B] font-mono text-sm font-semibold">zł</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Slider with fill background left indicator styled */}
              <div className="pt-4">
                <input
                  type="range"
                  id="employee-master-slider"
                  min="5000"
                  max="35000"
                  step="250"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:border-0 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#6366F1] [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:border-0"
                  style={{
                    background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${uopSliderPercent}%, #27272A ${uopSliderPercent}%, #27272A 100%)`
                  }}
                  aria-label="Ogólny suwak kwoty"
                />
                <div className="flex justify-between text-[11px] text-[#52525B] font-mono mt-1.5 font-medium">
                  <span>5 000 zł</span>
                  <span>15 000 zł</span>
                  <span>25 000 zł</span>
                  <span>35 000 zł</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: B2B parameters and details */}
          <div className="space-y-5">
            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.06em] uppercase text-[#52525B]">
              <Building2 className="h-4 w-4 text-[#6366F1]" />
              <span>Parametry podatkowe i ZUS</span>
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="b2b-tax-type" className="block text-[11px] font-medium tracking-wider uppercase text-[#A1A1AA] mb-1.5">Podatek B2B</label>
                <select
                  id="b2b-tax-type"
                  value={b2bTax}
                  onChange={(e) => setB2bTax(e.target.value as any)}
                  className="block h-12 w-full rounded-[10px] bg-[#09090B] border border-[#27272A] px-3 py-2 text-white text-xs sm:text-sm font-medium focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                >
                  <option value="RYCZALT">Ryczałt 12% (Programista IT)</option>
                  <option value="LINEAR">Podatek Liniowy 19%</option>
                  <option value="SCALE">Skala podatkowa (12% / 32%)</option>
                </select>
              </div>

              <div>
                <label htmlFor="b2b-zus-type" className="block text-[11px] font-medium tracking-wider uppercase text-[#A1A1AA] mb-1.5">Składki ZUS JDG</label>
                <select
                  id="b2b-zus-type"
                  value={b2bZus}
                  onChange={(e) => setB2bZus(e.target.value as any)}
                  className="block h-12 w-full rounded-[10px] bg-[#09090B] border border-[#27272A] px-3 py-2 text-white text-xs sm:text-sm font-medium focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                >
                  <option value="NONE">Ulga na start (Zwolnienie)</option>
                  <option value="PREFERENTIAL">Mały ZUS Plus (Preferencyjny)</option>
                  <option value="FULL">Pełny ZUS (Duży ZUS - 1485 zł)</option>
                </select>
              </div>

              <div>
                <label htmlFor="b2b-expenses" className="block text-[11px] font-medium tracking-wider uppercase text-[#A1A1AA] mb-1.5">Miesięczne koszty firmy</label>
                <div className="relative">
                  <input
                    type="number"
                    id="b2b-expenses"
                    value={expenses || ""}
                    onChange={(e) => setExpenses(Math.max(0, parseInt(e.target.value) || 0))}
                    className="block h-12 w-full rounded-[10px] bg-[#09090B] border border-[#27272A] py-3 pl-3 pr-12 text-white font-mono text-xs sm:text-sm focus:border-[#6366F1]"
                    placeholder="Np: biuro, księgowa"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <span className="text-[#52525B] font-mono text-xs">zł</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="sick-pay-toggle"
                  checked={isSickPay}
                  onChange={(e) => setIsSickPay(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-[#27272A] bg-[#09090B] accent-[#6366F1]"
                />
                <label htmlFor="sick-pay-toggle" className="text-xs font-semibold text-[#A1A1AA] cursor-pointer hover:text-white select-none transition">
                  Dobrowolne chorobowe B2B
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic visually rich Recommendation box */}
        <div className={`rounded-xl border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all ${
          b2bBetter
            ? "border-[#10B981]/40 bg-[#10B981]/5"
            : "border-[#6366F1]/40 bg-[#6366F1]/5"
        }`}>
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-lg flex items-center justify-center text-white shadow-sm ${
              b2bBetter ? "bg-[#10B981]" : "bg-[#6366F1]"
            }`}>
              {b2bBetter ? <Scale className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            </div>
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#52525B]">Rekomendacja podsumowująca</h4>
              <p className="mt-1 text-base font-bold text-white">
                Zalecana forma zatrudnienia:{" "}
                <span className={b2bBetter ? "text-[#10B981]" : "text-[#818CF8]"}>
                  {b2bBetter ? "Kontrakt B2B" : "Umowa o Pracę (UoP)"}
                </span>!
              </p>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                Różnica wynosi <strong className="font-mono text-[#FAFAFA] text-xs font-semibold"><AnimatedNumber value={nettoDiff} /></strong> miesięcznie na korzyść rekomendowanej formy.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center sm:items-end justify-center bg-[#09090B] border border-[#27272A] rounded-xl px-5 py-3 text-center sm:text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA]">Różnica roczna</span>
            <span className={`text-[24px] font-semibold font-mono tracking-tight ${b2bBetter ? "text-[#10B981]" : "text-[#818CF8]"}`}>
              +<AnimatedNumber value={annualDiff} />
            </span>
          </div>
        </div>

        {/* Results cards panel */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* UoP Option Card */}
          <div className={`relative rounded-xl border p-6 bg-[#09090B] ${
            !b2bBetter 
              ? "border-[#10B981]/50 bg-[#10B981]/[0.05]" 
              : "border-[#27272A]"
          }`}>
            {!b2bBetter && (
              <span className="absolute top-4 right-4 rounded-full bg-[#10B981]/20 text-[#10B981] px-2.5 py-0.5 text-[11px] font-semibold">
                Najlepsza opcja ✓
              </span>
            )}
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#52525B]">
              Zarobki na etacie (Umowa o Pracę)
            </span>
            <div className={`mt-3 text-[32px] sm:text-[36px] font-semibold font-mono tracking-tight leading-none ${
              !b2bBetter ? "text-white" : "text-zinc-300"
            }`}>
              <AnimatedNumber value={uopNetto} />
            </div>
            <span className="text-xs text-[#A1A1AA] mt-1.5 block">Netto miesięcznie do kieszeni</span>
            <div className="mt-4 pt-4 border-t border-[#27272A] flex flex-wrap justify-between text-[11px] text-[#A1A1AA]">
              <span>Podatek PIT: {formatPLN(uopRes.podatekDochodowy)}</span>
              <span>Składki ZUS: {formatPLN(uopRes.pracownikSocial.sumaSocial + uopRes.pracownikZdrowotna)}</span>
            </div>
          </div>

          {/* B2B Option Card */}
          <div className={`relative rounded-xl border p-6 bg-[#09090B] ${
            b2bBetter 
              ? "border-[#10B981]/50 bg-[#10B981]/[0.05]" 
              : "border-[#27272A]"
          }`}>
            {b2bBetter && (
              <span className="absolute top-4 right-4 rounded-full bg-[#10B981]/20 text-[#10B981] px-2.5 py-0.5 text-[11px] font-semibold">
                Najlepsza opcja ✓
              </span>
            )}
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#52525B]">
              Samozatrudnienie (Kontrakt B2B)
            </span>
            <div className={`mt-3 text-[32px] sm:text-[36px] font-semibold font-mono tracking-tight leading-none ${
              b2bBetter ? "text-white" : "text-zinc-300"
            }`}>
              <AnimatedNumber value={b2bNetto} />
            </div>
            <span className="text-xs text-[#A1A1AA] mt-1.5 block">Netto wypłata (Po opłaceniu podatków, ZUS i kosztów)</span>
            <div className="mt-4 pt-4 border-t border-[#27272A] flex flex-wrap justify-between text-[11px] text-[#A1A1AA]">
              <span>PIT/Ryczałt: {formatPLN(b2bRes.podatekDochodowy)}</span>
              <span>ZUS (JDG): {formatPLN(b2bRes.zusSpoleczny + b2bRes.zusZdrowotny)}</span>
            </div>
          </div>

        </div>

        {/* Difference callout */}
        <div className="text-center pt-2">
          <p className={`text-lg font-semibold ${b2bBetter ? "text-[#10B981]" : "text-[#818CF8]"}`}>
            {b2bBetter 
              ? `B2B daje Ci +${formatPLN(Math.round(nettoDiff))} netto miesięcznie więcej` 
              : `UoP daje Ci +${formatPLN(Math.round(nettoDiff))} netto miesięcznie więcej`
            }
          </p>
        </div>

      </div>

      {/* Side by side tabular matrix for detailed audit checks */}
      <div className="rounded-xl border border-[#27272A] bg-[#18181B] overflow-hidden shadow-xl print-full">
        <div className="border-b border-[#27272A] bg-[#1C1C1F] p-5">
          <h3 className="font-semibold text-white text-base">Roczne zestawienie obciążeń i wypłat</h3>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Porównanie przy kwocie: UoP ({formatPLN(uopValue)} brutto) vs B2B ({formatPLN(b2bValue)} netto faktura).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#27272A] text-sm font-sans">
            <thead>
              <tr className="bg-[#1C1C1F] text-[#A1A1AA]">
                <th className="px-6 py-3 text-left font-medium">Składnik kalkulacji</th>
                <th className="px-6 py-3 text-right font-medium">Umowa o Pracę</th>
                <th className="px-6 py-3 text-right font-medium">Klasyczne B2B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A] text-[#A1A1AA]">
              <tr>
                <td className="px-6 py-3.5 font-medium text-white">Przychód podstawowy (Brutto / Faktura Netto)</td>
                <td className="px-[#52525B] px-6 py-3.5 text-right font-mono">{formatPLN(uopValue)}</td>
                <td className="px-6 py-3.5 text-right font-mono text-white font-semibold">{formatPLN(b2bValue)}</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5">Koszty działalności (np: doradztwo, biuro, media)</td>
                <td className="px-6 py-3.5 text-right font-mono">—</td>
                <td className="px-6 py-3.5 text-right font-mono text-rose-500">-{formatPLN(expenses)}</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5">ZUS społeczne składki emerytalne i rentowe</td>
                <td className="px-6 py-3.5 text-right font-mono">-{formatPLN(uopRes.pracownikSocial.sumaSocial)}</td>
                <td className="px-6 py-3.5 text-right font-mono text-rose-500">-{formatPLN(b2bRes.zusSpoleczny)}</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5">ZUS ubezpieczenie zdrowotne</td>
                <td className="px-6 py-3.5 text-right font-mono">-{formatPLN(uopRes.pracownikZdrowotna)}</td>
                <td className="px-6 py-3.5 text-right font-mono text-rose-500">-{formatPLN(b2bRes.zusZdrowotny)}</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5">Zaliczka na podatek dochodowy (PIT / Ryczałt)</td>
                <td className="px-6 py-3.5 text-right font-mono text-rose-500">-{formatPLN(uopRes.podatekDochodowy)}</td>
                <td className="px-6 py-3.5 text-right font-mono text-rose-500">-{formatPLN(b2bRes.podatekDochodowy)}</td>
              </tr>
              <tr className="bg-[#1C1C1F] font-bold">
                <td className="px-6 py-4 text-white">Miesięcznie "do kieszeni"</td>
                <td className={`px-6 py-4 text-right font-mono ${!b2bBetter ? "text-[#10B981]" : "text-white"}`}>
                  {formatPLN(uopNetto)}
                </td>
                <td className={`px-6 py-4 text-right font-mono ${b2bBetter ? "text-[#10B981]" : "text-white"}`}>
                  {formatPLN(b2bNetto)}
                </td>
              </tr>
              <tr className="bg-[#1C1C1F]/40 font-bold border-t-2 border-[#27272A]">
                <td className="px-6 py-4 text-white">Rocznie na czysto</td>
                <td className={`px-6 py-4 text-right font-mono ${!b2bBetter ? "text-[#10B981]" : "text-white"}`}>
                  {formatPLN(uopNetto * 12)}
                </td>
                <td className={`px-6 py-4 text-right font-mono ${b2bBetter ? "text-[#10B981]" : "text-white"}`}>
                  {formatPLN(b2bNetto * 12)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Triggers links row */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-[#27272A] print-hidden">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#1C1C1F] px-4 py-2.5 text-sm font-semibold text-[#FAFAFA] shadow-xs cursor-pointer transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#10B981]" />
                <span>Skopiowano wyniki!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#A1A1AA]" />
                <span>Skopiuj raport i rekomendację</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#1C1C1F] px-4 py-2.5 text-sm font-semibold text-[#FAFAFA] shadow-xs cursor-pointer transition"
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
                  ? "bg-[#27272A] text-[#52525B] border border-transparent"
                  : "bg-[#6366F1] hover:bg-[#818CF8] text-white border border-transparent"
              }`}
            >
              {isSaved ? "Zapisano kalkulację!" : "Zapisz kalkulację (PRO)"}
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
