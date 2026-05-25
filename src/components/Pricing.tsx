/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, Lock, Star, ArrowRight } from "lucide-react";
import { PlanType } from "../types";

interface PricingProps {
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
}

export default function Pricing({ currentPlan, onSelectPlan }: PricingProps) {
  const tiers = [
    {
      name: "Free",
      id: "FREE" as PlanType,
      price: "0 zł",
      period: "na zawsze",
      description: "Nielimitowane, podstawowe kalkulacje podatkowe dla każdego freelancera i pracodawcy.",
      features: [
        "Wszystkie 3 kalkulatory bez limitów",
        "Zawsze aktualne stawki (styczeń 2026)",
        "Darmowy ruch SEO bez rejestracji i konta",
        "Podstawowe porównanie netto UoP vs B2B",
      ],
      notIncluded: [
        "90-dniowa historia kalkulacji (zapis auto)",
        "Eksport PDF w wersji premium (czysty, bez logo)",
        "Widget kalkulatora na własną stronę (iframe)",
        "Indywidualny klucz API do stawek ZUS 2026",
      ],
      cta: "Używaj za darmo",
      href: "#kalkulator",
      popular: false
    },
    {
      name: "Pro",
      id: "PRO" as PlanType,
      price: "29 zł",
      period: "miesięcznie",
      description: "Zalecany plan dla zaawansowanych freelancerów, doradców oraz szefów zespołów.",
      features: [
        "Wszystkie funkcje planu Free",
        "Zapisywanie historii obliczeń (LocalStorage do 90 dni)",
        "Porównanie wielu scenariuszy (ryczałt, liniowy, skala)",
        "Premium eksport PDF (czysta strona do druku)",
        "Możliwość nadawania własnych tytułów scenariuszom",
        "Wsparcie dla kursów walut EUR/USD na żywo",
      ],
      notIncluded: [
        "Widget kalkulatora na własną stronę (iframe)",
        "Indywidualny klucz API do stawek ZUS 2026",
      ],
      cta: "Kup Pro — 29 zł/msc",
      href: "https://buy.stripe.com/TWOJ_LINK_PRO",
      popular: true
    },
    {
      name: "Agencja",
      id: "AGENCY" as PlanType,
      price: "99 zł",
      period: "miesięcznie",
      description: "Dla agencji rekrutacyjnych IT, biur rachunkowych i integratorów HR.",
      features: [
        "Wszystkie funkcje planu Pro",
        "Indywidualny widget do osadzenia (iframe code generator)",
        "API-key placeholder UI z dostępem programistycznym",
        "Dostosowanie logo i kolorów w PDF",
        "Obsługa wielu walut (EUR, USD, PLN, CHF)",
        "Wsparcie techniczne agencji (SLA 24h)",
      ],
      notIncluded: [],
      cta: "Kup Agencja — 99 zł/msc",
      href: "https://buy.stripe.com/TWOJ_LINK_AGENCJA",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 border-t border-[#27272A] bg-[#0F0F10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            Wybierz plan dopasowany do Twoich potrzeb
          </h2>
          <p className="mt-4 text-base text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
            KalkulatorB2B jest darmowy dla ruchu SEO. Wybierz wersję <strong className="font-semibold text-[#818CF8]">Pro</strong> lub <strong className="font-semibold text-[#818CF8]">Agencja</strong>, by automatyzować procesy rekrutacyjne i historyczne wyliczenia.
          </p>
          
          {/* Interactive Toggle for Simulator */}
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-dashed border-[#27272A] bg-[#18181B] px-5 py-3 text-xs text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span><strong>Tryb demo:</strong> Wypróbuj natychmiast funkcje premium bez dokonywania płatności.</span>
            </div>
            <button
              onClick={() => {
                if (currentPlan === 'FREE') {
                  onSelectPlan('PRO');
                } else {
                  onSelectPlan('FREE');
                }
              }}
              className="rounded-lg bg-[#6366F1] hover:bg-[#818CF8] px-3.5 py-1.5 font-bold text-white shadow transition-all cursor-pointer"
              id="simulate-pricing-buy"
            >
              {currentPlan === 'FREE' ? "Symuluj aktywację PRO" : "Powróć do wersji darmowej"}
            </button>
          </div>
        </div>

        {/* Pricing tier cards */}
        <div className="mx-auto grid max-w-md gap-8 lg:max-w-7xl lg:grid-cols-3 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all hover:translate-y-[-4px] duration-300 ${
                tier.popular
                  ? "bg-[#1C1C1F] border-2 border-[#6366F1] shadow-[0_20px_40px_rgba(99,102,241,0.1)]"
                  : "bg-[#18181B] border border-[#27272A] shadow-sm hover:border-[#3F3F46]"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#6366F1] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  <Star className="h-3 w-3 fill-white text-white" />
                  Najpopularniejszy
                </span>
              )}

              <div>
                {/* Title */}
                <h3 className="font-sans text-xl font-bold text-white flex items-center justify-between">
                  <span>{tier.name}</span>
                  {tier.id === currentPlan && (
                    <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-[9px] text-emerald-400 font-bold uppercase border border-emerald-500/20">Aktywny</span>
                  )}
                </h3>
                <p className="mt-2 text-xs text-[#A1A1AA] leading-relaxed min-h-[40px]">{tier.description}</p>
                
                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-bold tracking-tight text-white">
                    {tier.price}
                  </span>
                  <span className="text-xs text-[#52525B]">/{tier.period}</span>
                </div>

                {/* Features divider */}
                <div className="mt-8 border-t border-[#27272A] pt-6">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-[#52525B]">Zawarte w pakiecie</h4>
                  <ul className="mt-4 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-[#A1A1AA]">
                        <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not included list for crisp transparency */}
                {tier.notIncluded.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-dashed border-[#27272A]">
                    <ul className="space-y-2.5">
                      {tier.notIncluded.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-xs text-[#52525B]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#27272A] mt-1.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-8">
                {tier.id === 'FREE' ? (
                  <a
                    href={tier.href}
                    className="flex w-full items-center justify-center rounded-xl bg-[#27272A] hover:bg-[#3F3F46] px-4 py-3.5 text-center text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <a
                    href={tier.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3.5 text-center text-xs font-semibold text-white transition-all shadow-sm cursor-pointer ${
                      tier.popular
                        ? "bg-[#6366F1] hover:bg-[#818CF8]"
                        : "bg-[#27272A] hover:bg-[#3F3F46]"
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Safety and payment icons footer */}
        <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
            <Lock className="h-4 w-4 text-emerald-500" />
            <span>Bezpieczne płatności zapewniane przez certyfikowaną bramkę <strong className="font-semibold text-white">Stripe 🔒</strong></span>
          </div>

          {/* Cards inline custom SVGs */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2 select-none">
            {/* Visa Custom SVG */}
            <div className="flex items-center h-6 w-11 justify-center rounded bg-[#18181B] px-2 py-1 border border-[#27272A]">
              <svg className="h-4 w-auto text-blue-400" viewBox="0 0 48 15" fill="none">
                <path d="M18.8 1.1l-2.4 12.8H12L9.6 4c-.2-.6-.5-.9-1.2-1.2C7 2.3 4.5 1.5 1.8 1.2c-.3 0-.5.2-.5.5l3.2 12.2H10L15.3 1.1h3.5zm19-1L35 13.9H31l-3-10c-.1-.4-.5-.6-.9-.6h-4.2c-.3 0-.5.2-.5.5l.1.5c1.4.3 2.7.9 3.6 1.7.3.3.4.6.3 1l-2.7 10.3H26.3l-2.3-9.5H21.2l-.3 1.1 5.3 12.1H31.5L36.3.1h1.5zM46.7 5.7c0 3.3-4.6 3.5-4.5 5 0 .5.4.9 1.3 1 1 .1 1.9-.1 2.7-.4V14c-1 .3-2 .5-3.1.5-3.3 0-5.6-1.6-5.6-4.2 0-3.3 4.7-3.5 4.6-5 0-.4-.4-.8-1.2-.9-.8-.1-1.6.1-2.4.4V1.8c.8-.3 1.8-.5 2.8-.5 3.3 0 5.6 1.6 5.6 4.4z" fill="currentColor"/>
              </svg>
            </div>

            {/* Mastercard Custom SVG */}
            <div className="flex items-center h-6 w-11 justify-center rounded bg-[#18181B] px-2 py-1 border border-[#27272A]">
              <svg className="h-4 w-auto" viewBox="0 0 35 22" fill="none">
                <ellipse cx="11" cy="11" rx="11" ry="11" fill="#EB001B" fillOpacity="0.8"/>
                <ellipse cx="24" cy="11" rx="11" ry="11" fill="#F79E1B" fillOpacity="0.8"/>
              </svg>
            </div>

            {/* BLIK indicator */}
            <div className="flex items-center gap-1 h-6 rounded bg-[#18181B] px-3 py-1 border border-[#27272A]">
              <span className="flex h-1.5 w-1.5 rounded-full bg-slate-400"></span>
              <span className="text-[10px] font-black tracking-widest text-[#A1A1AA]">BLIK</span>
            </div>
            
            {/* Apple pay info */}
            <div className="flex items-center gap-1 h-6 rounded bg-[#18181B] px-3 py-1 border border-[#27272A]">
              <span className="flex h-1.5 w-1.5 rounded-full bg-slate-400"></span>
              <span className="text-[10px] font-bold text-[#A1A1AA] uppercase">Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
