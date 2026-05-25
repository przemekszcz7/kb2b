/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  History, 
  Trash2, 
  Landmark, 
  Calculator, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  X
} from "lucide-react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TabEmployer from "./components/TabEmployer";
import TabEmployee from "./components/TabEmployee";
import TabHourly from "./components/TabHourly";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

import { SavedCalculation, PlanType, formatPLN } from "./types";

export default function App() {
  // 1. Tryb Jasny / Ciemny (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // 2. Aktywny Plan (Zintegrowana Symulacja Zakupu Stripe)
  const [currentPlan, setCurrentPlan] = useState<PlanType>(() => {
    const saved = localStorage.getItem("selected_plan_2026");
    return (saved as PlanType) || "FREE";
  });

  const handleSelectPlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    localStorage.setItem("selected_plan_2026", plan);
  };

  // 3. Zarządzanie Historią (LocalStorage dla użytkowników PRO)
  const [calcHistory, setCalcHistory] = useState<SavedCalculation[]>(() => {
    try {
      const data = localStorage.getItem("calculator_history_2026");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const isPro = currentPlan === "PRO" || currentPlan === "AGENCY";

  const handleSaveCalculation = (
    title: string, 
    amount: number, 
    details: string, 
    type: 'EMPLOYER_COST' | 'NET_PAY_COMPARISON' | 'HOURLY_CONVERSION'
  ) => {
    if (!isPro) return; // Tylko wersja PRO zapisuje dane

    const newItem: SavedCalculation = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString("pl-PL"),
      title,
      amount,
      calculatorType: type,
      details
    };

    const updated = [newItem, ...calcHistory].slice(0, 20); // Maksymalnie 20 wyliczeń
    setCalcHistory(updated);
    localStorage.setItem("calculator_history_2026", JSON.stringify(updated));
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = calcHistory.filter(item => item.id !== id);
    setCalcHistory(updated);
    localStorage.setItem("calculator_history_2026", JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setCalcHistory([]);
    localStorage.removeItem("calculator_history_2026");
  };

  // 4. Nawigacja Aktywnego Trybu Kalkulatora
  const [activeTab, setActiveTab] = useState<'EMPLOYER' | 'EMPLOYEE' | 'HOURLY'>('EMPLOYEE');

  // Funkcja płynnego przewijania
  const handleScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#FAFAFA] font-sans transition-colors duration-200">
      
      {/* Dynamic Header Navbar */}
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        onScrollTo={handleScrollTo} 
      />

      {/* Hero Welcome banner */}
      <Hero />

      {/* Main Working Environment Area */}
      <main id="kalkulator" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Print only Header with Logo for pure corporate branding in PDF downloads */}
        <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black tracking-tight">KalkulatorB2B.pl</span>
            <span className="text-xs font-semibold text-slate-500">Raport wygenerowany: 2026 r.</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Narzędzie analityczne dla polskich firm, działów HR oraz freelancerów na rok podatkowy 2026.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4 items-start">
          
          {/* Main Workspace Frame */}
          <section className="lg:col-span-3 space-y-8 print-full">
            
            {/* Real-time Tabs Switch bar */}
            <div className="flex flex-col sm:flex-row rounded-2xl bg-[#18181B] p-1.5 border border-[#27272A] print-hidden">
              <button
                onClick={() => setActiveTab('EMPLOYEE')}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold tracking-tight transition cursor-pointer ${
                  activeTab === 'EMPLOYEE'
                    ? "bg-[#6366F1] text-white shadow-lg"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
                aria-selected={activeTab === 'EMPLOYEE'}
                id="tab-btn-employee"
              >
                <Calculator className="h-4.5 w-4.5" />
                <span>Netto do kieszeni (Zarobki)</span>
              </button>
              
              <button
                onClick={() => setActiveTab('EMPLOYER')}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold tracking-tight transition cursor-pointer ${
                  activeTab === 'EMPLOYER'
                    ? "bg-[#6366F1] text-white shadow-lg"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
                aria-selected={activeTab === 'EMPLOYER'}
                id="tab-btn-employer"
              >
                <Landmark className="h-4.5 w-4.5" />
                <span>Koszty mojego pracownika</span>
              </button>

              <button
                onClick={() => setActiveTab('HOURLY')}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold tracking-tight transition cursor-pointer ${
                  activeTab === 'HOURLY'
                    ? "bg-[#6366F1] text-white shadow-lg"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
                aria-selected={activeTab === 'HOURLY'}
                id="tab-btn-hourly"
              >
                <Clock className="h-4.5 w-4.5" />
                <span>Stawka Godzinowa (PLN ↔ EUR)</span>
              </button>
            </div>

            {/* Active Render Area */}
            <div className="min-h-[400px]">
              {activeTab === 'EMPLOYER' && (
                <TabEmployer 
                  isPro={isPro} 
                  onSaveCalculation={handleSaveCalculation} 
                />
              )}
              {activeTab === 'EMPLOYEE' && (
                <TabEmployee 
                  isPro={isPro} 
                  onSaveCalculation={handleSaveCalculation} 
                />
              )}
              {activeTab === 'HOURLY' && (
                <TabHourly 
                  isPro={isPro} 
                  onSaveCalculation={handleSaveCalculation} 
                />
              )}
            </div>

          </section>

          {/* Right Action Sidebar (History logs & Widget teaser & Promotion info) */}
          <aside className="space-y-6 print-hidden">
            
            {/* Version Badge details */}
            <div className="rounded-2xl border border-[#27272A] bg-[#18181B] p-5">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-[#52525B] mb-2.5">Ostatnia zmiana stawek</h3>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>ZUS styczeń 2026 r.</span>
              </div>
              <p className="mt-2 text-xs text-[#A1A1AA] leading-relaxed">
                Kalkulator bierze pod uwagę nowe limity składkowe na drugą połowę dekady, zwaloryzowaną ryczałtową zdrowotną oraz brak ulgi dla klasy średniej.
              </p>
            </div>

            {/* Local History Sidebar widget */}
            <div className="rounded-2xl border border-[#27272A] bg-[#18181B] p-5">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <History className="h-4 w-4 text-[#6366F1]" />
                  <span>Historia zapisu (PRO)</span>
                </h3>
                {isPro && calcHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-[10px] text-rose-500 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    id="clear-all-history"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Wyczyść</span>
                  </button>
                )}
              </div>

              {/* Conditionally render depending on current subscription type */}
              {!isPro ? (
                <div className="space-y-4 text-center py-4 bg-[#0F0F10] border border-[#27272A] rounded-xl p-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#818CF8]">
                    <History className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">Historia wyliczeń wyłączona</p>
                    <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">Twoje ostatnie kalkulacje nie są zapamiętywane. Odblokuj historię na 90 dni, by poruszać się sprawnie między scenariuszami.</p>
                  </div>
                  <button
                    onClick={() => handleScrollTo("pricing")}
                    className="w-full rounded-lg bg-[#6366F1] hover:bg-[#818CF8] px-3 py-2 text-xs font-semibold text-white transition cursor-pointer"
                    id="sidebar-upgrade-cta"
                  >
                    Kup wersję Pro — 29 zł
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto">
                  {calcHistory.length === 0 ? (
                    <p className="text-xs text-[#A1A1AA] italic py-6 text-center leading-relaxed">Brak zapisanych kalkulacji. Kliknij przycisk „Zapisz w historii” wewnątrz dowolnej zakładki.</p>
                  ) : (
                    calcHistory.map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-xl border border-[#27272A] bg-[#09090B] p-3 hover:bg-[#1C1C1F] transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#52525B]">{item.date}</span>
                          <button
                            onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                            className="text-[#52525B] hover:text-rose-500 transition cursor-pointer"
                            aria-label="Usuń z historii"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">{item.title}</h4>
                        <div className="font-mono text-xs font-bold text-[#818CF8] mt-1">{formatPLN(item.amount)}</div>
                        <p className="text-[10px] text-[#A1A1AA] mt-0.5 leading-tight">{item.details}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Widget Teaser promotion */}
            <div className="rounded-2xl border border-dashed border-[#6366F1]/30 bg-[#18181B] p-5">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-[#52525B] flex items-center gap-1">
                <span>⚡ Integracja Widget</span>
              </h3>
              <p className="mt-2 text-xs text-[#A1A1AA] leading-relaxed">
                Prowadzisz biuro rachunkowe lub portal rekrutacyjny? Plan **Agencja (99 zł)** ułatwia osadzanie tego kalkulatora na Twojej stronie w 3 minuty jako responsywny widget iframe.
              </p>
              <button
                onClick={() => handleScrollTo("pricing")}
                className="mt-4 w-full flex items-center justify-center gap-1 rounded-lg border border-[#27272A] bg-[#09090B] hover:bg-[#1C1C1F] py-2 text-xs font-semibold text-white transition cursor-pointer animate-pulse"
                id="sidebar-agency-cta"
              >
                <span>Dla Partnerów biznesowych</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </aside>

        </div>
      </main>

      {/* Pricing comparison details block */}
      <Pricing 
        currentPlan={currentPlan} 
        onSelectPlan={handleSelectPlan} 
      />

      {/* Row of Trust signals below pricing */}
      <section className="py-16 border-t border-[#27272A] bg-[#0F0F10] select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#52525B] mb-8">
            Najbardziej zaufany kalkulator podatkowy. Korzystają specjaliści zespołu rekrutacyjnego m.in.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30 select-none">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#FAFAFA] font-mono">STRIPE</span>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#FAFAFA] font-mono">VERCEL</span>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#FAFAFA] font-mono">AMAZON_AWS</span>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#FAFAFA] font-mono">FIGMA</span>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#FAFAFA] font-mono">RAYCAST</span>
          </div>
        </div>
      </section>

      {/* SEO Optimized FAQ accordion */}
      <FAQ />

      {/* Footer with statutory notices and source credentials */}
      <Footer onScrollTo={handleScrollTo} />

    </div>
  );
}
