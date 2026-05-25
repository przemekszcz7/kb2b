/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sun, Moon, Menu, X, ShieldCheck } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onScrollTo: (id: string) => void;
}

export default function Header({ isDarkMode, toggleDarkMode, onScrollTo }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 h-[64px] w-full border-b border-[#27272A] bg-[#0F0F10]/80 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          
          {/* Logo Column */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onScrollTo("hero")}>
            <span className="font-mono text-[18px] font-bold tracking-tight text-[#6366F1]">
              KB2B<span className="text-zinc-500 font-normal">.pl</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onScrollTo("kalkulator")}
              className="text-[14px] text-[#A1A1AA] hover:text-white transition duration-150 font-medium cursor-pointer"
            >
              Kalkulator
            </button>
            <button
              onClick={() => onScrollTo("pricing")}
              className="text-[14px] text-[#A1A1AA] hover:text-white transition duration-150 font-medium cursor-pointer"
            >
              Cennik
            </button>
            <button
              onClick={() => onScrollTo("faq")}
              className="text-[14px] text-[#A1A1AA] hover:text-white transition duration-150 font-medium cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* Actions Column */}
          <div className="hidden md:flex items-center gap-4">
            {/* Version Badge info */}
            <div className="flex items-center gap-1.5 text-xs text-[#52525B]">
              <ShieldCheck className="h-4 w-4 text-[#10B981]" />
              <span className="font-medium">Stawki 2026</span>
            </div>

            {/* Dark Mode switcher */}
            <button
              onClick={toggleDarkMode}
              className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-[#18181B] transition-colors cursor-pointer"
              aria-label="Tryb jasny/ciemny"
              id="desktop-dark-mode-toggle"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Premium CTA Button */}
            <button
              onClick={() => onScrollTo("pricing")}
              className="px-4 py-2 text-[14px] rounded-lg font-medium text-white bg-[#6366F1] hover:bg-[#818CF8] shadow-[0_0_20px_rgba(99,102,241,0.3)] transition duration-150 cursor-pointer"
              id="desktop-cta-pro"
            >
              Kup Pro
            </button>
          </div>

          {/* Mobile hamburger Menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="rounded-lg p-2 text-zinc-400 hover:text-white"
              aria-label="Tryb ciemny"
              id="mobile-dark-mode-toggle"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-zinc-400 hover:text-white"
              aria-expanded={isOpen}
              id="mobile-hamburger-btn"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-[#27272A] bg-[#0F0F10]/95 px-4 pt-2 pb-4 shadow-xl backdrop-blur-lg">
          <div className="space-y-2 py-3">
            <button
              onClick={() => {
                onScrollTo("kalkulator");
                setIsOpen(false);
              }}
              className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-[#18181B] transition duration-150"
            >
              Kalkulator
            </button>
            <button
              onClick={() => {
                onScrollTo("pricing");
                setIsOpen(false);
              }}
              className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-[#18181B] transition duration-150"
            >
              Cennik
            </button>
            <button
              onClick={() => {
                onScrollTo("faq");
                setIsOpen(false);
              }}
              className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-[#18181B] transition duration-150"
            >
              FAQ
            </button>
          </div>

          <div className="mt-4 border-t border-[#27272A] pt-4">
            <button
              onClick={() => {
                onScrollTo("pricing");
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center rounded-lg bg-[#6366F1] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg hover:bg-[#818CF8]"
              id="mobile-cta-pro"
            >
              Kup wersję Pro — 29 zł
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
