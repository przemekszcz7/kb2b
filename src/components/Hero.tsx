/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star } from "lucide-react";

export default function Hero() {
  const handleScrollToKalkulator = () => {
    const el = document.getElementById("kalkulator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero relative overflow-hidden bg-[#0F0F10] pt-[120px] pb-[80px]" id="hero">
      {/* Background ambient radial glowing effects */}
      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 bg-radial from-[#6366F1]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-[680px] px-4 text-center sm:px-6 lg:px-8">
        {/* Above H1 Badge */}
        <div className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3.5 py-1 text-xs font-medium text-[#818CF8]">
          <span>✦ Aktualne stawki — styczeń 2026</span>
        </div>

        {/* Dynamic Display Typography H1 */}
        <h1 className="font-sans text-[36px] sm:text-[48px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.1] text-white">
          Ile naprawdę kosztuje Twój pracownik? <br className="hidden sm:inline" />
          <span className="text-[#818CF8]">Sprawdź w 10 sekund.</span>
        </h1>

        {/* Subheadline body text */}
        <p className="mx-auto mt-6 max-w-[520px] text-base sm:text-[18px] text-[#A1A1AA] leading-relaxed">
          Zoptymalizuj koszty zatrudnienia i podatki. Porównaj Umowę o Pracę (UoP) i B2B bazując na zmianach ZUS i progach podatkowych 2026.
        </p>

        {/* Two side-by-side SaaS CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleScrollToKalkulator}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#6366F1] hover:bg-[#818CF8] transition duration-150 cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            Oblicz teraz →
          </button>
          <button
            onClick={handleScrollToPricing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white bg-transparent border border-zinc-700 hover:border-zinc-500 transition duration-150 cursor-pointer"
          >
            Zobacz plany
          </button>
        </div>

        {/* Social Proof Line */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#52525B]">
          <div className="flex gap-1 text-amber-500 font-bold">
            <Star className="h-4 w-4 fill-current text-amber-500" />
            <Star className="h-4 w-4 fill-current text-amber-500" />
            <Star className="h-4 w-4 fill-current text-amber-500" />
            <Star className="h-4 w-4 fill-current text-amber-500" />
            <Star className="h-4 w-4 fill-current text-amber-500" />
          </div>
          <span className="font-medium">
            Używają: <strong className="text-[#A1A1AA] font-semibold">4 200+</strong> specjalistów HR i freelancerów
          </span>
        </div>

      </div>
    </div>
  );
}
