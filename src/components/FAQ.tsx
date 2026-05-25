/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: FAQItem[] = [
    {
      question: "1. Ile kosztuje pracodawcę pracownik na UoP w 2026?",
      answer: "Koszt zatrudnienia pracownika na umowę o pracę (UoP) w 2026 roku znacznie przekracza samo wynagrodzenie brutto wpisywane na umowie. Pracodawca zobowiązany jest doliczyć tak zwane narzuty po swojej stronie, na które składają się składki emerytalne (9,76% płacy brutto), rentowe (6,50%), ubezpieczenie wypadkowe (standardowo przyjmuje się stawkę 1,67%), a także składki na Fundusz Pracy (2,45%) oraz Fundusz Gwarantowanych Świadczeń Pracowniczych (0,10%). Matematycznie sumaryczny narzut ZUS pracodawcy wynosi 20,48% płacy brutto. W praktyce oznacza to, że jeśli pracownik zarabia standardowe 10 000 zł brutto miesięcznie, realny całkowity koszt zatrudnienia po stronie przedsiębiorcy przekroczy 12 048 zł. Pozostała kwota tworzy tzw. klin podatkowo-składkowy, czyli bezlitosną różnicę pomiędzy tym, co płaci pracodawca, a tym, co ostatecznie trafia na konto bankowe zatrudnionego jako wypłata netto. Przez to przedsiębiorstwa coraz częściej szukają elastycznych form rozliczeń, takich jak współpraca bezpośrednia B2B."
    },
    {
      question: "2. Czy B2B zawsze się opłaca bardziej niż UoP?",
      answer: "Przejście na samozatrudnienie i wystawianie faktur (popularna formuła B2B) cieszy się olbrzymią popularnością, zwłaszcza w polskiej branży IT, marketingu oraz inżynieryjnej, ale nie jest ono rozwiązaniem optymalnym dla każdego i w każdym scenariuszu finansowym. Z zasady, B2B opłaca się najbardziej osobom, których miesięczne przychody brutto przekraczają próg około 10 000 - 12 000 zł. Na B2B masz bowiem możliwość wyboru ryczałtu ewidencjonowanego (np. dla branży IT preferencyjna stawka ryczałtu 12%) lub podatku liniowego 19%, co drastycznie redukuje wysokość płaconych podatków w porównaniu do standardowej skali podatkowej (12% i 32% powyżej drugiego progu rynkowego). Trzeba jednak pamiętać, że na JDG to Ty odpowiadasz za opłacanie księgowości, regularnych składek ZUS (niezależnie od tego, czy zarobisz w danym miesiącu, czy nie) oraz nie posiadasz płatnego urlopu wypoczynkowego (chyba że wynegocjujesz warunki kontraktu) ani ochrony kodeksowej. Przed podjęciem kluczowej decyzji o rezygnacji z bezpiecznego etatu warto zawsze gruntownie sprawdzić liczby na naszym kalkulatorze."
    },
    {
      question: "3. Jakie składki ZUS płaci pracownik w 2026?",
      answer: "Po stronie pracownika zatrudnionego na umowę o pracę, wynagrodzenie brutto jest pomniejszane o kilka istotnych i obowiązkowych składek ubezpieczeniowych, odprowadzanych bezpośrednio do Zakładu Ubezpieczeń Społecznych. Składają się na nie: składka emerytalna w wysokości 9,76%, składka rentowa w wymiarze 1,50% oraz składka chorobowa, która wynosi 2,45% i gwarantuje prawo do płatnego zwolnienia lekarskiego L4. Te trzy elementy stanowią tzw. składki społeczne pracownika i wynoszą w sumie 13,71% wynagrodzenia brutto. To jednak nie koniec obciążeń finansowych. Kolejnym elementem jest obowiązkowa składka na ubezpieczenie zdrowotne, wynosząca 9%. Co ważne, składka zdrowotna naliczana jest od podstawy, którą stanowi wynagrodzenie brutto pomniejszone o wyżej wspomniane składki na ubezpieczenia społeczne. Dopiero po odjęciu wszystkich składek ZUS i zaliczki na podatek dochodowy (12% lub 32%, z uwzględnieniem miesięcznej kwoty wolnej od podatku) wyliczana jest ostateczna kwota netto do wypłaty do ręki pracownika."
    },
    {
      question: "4. Czym różni się umowa zlecenie od umowy o dzieło?",
      answer: "Różnica między umową zlecenie a umową o dzieło w polskim systemie prawnym i podatkowym jest fundamentalna i dotyczy zarówno charakteru wykonywanej pracy, jak i naliczania składek ubezpieczeniowych. Umowa zlecenie jest tak zwaną umową starannego działania – zleceniobiorca zobowiązuje się do rzetelnego, powtarzalnego wykonywania określonych czynności (np. obsługa klienta, regularny nadzór systemów), a nie do osiągnięcia jednego, konkretnego rezultatu. Umowa zlecenie co do zasady podlega pełnemu oskładkowaniu ZUS (emerytalne, rentowe, zdrowotne, opcjonalnie chorobowe), chyba że wykonuje ją uczeń lub student do 26. roku życia, którzy są całkowicie zwolnieni z ZUS i PIT. Z kolei umowa o dzieło jest umową rezultatu. Jej celem jest stworzenie konkretnego, unikalnego, namacalnego lub cyfrowego efektu (np. napisanie aplikacji mobilnej, namalowanie obrazu, zaprojektowanie logo). Umowa o dzieło nie podlega oskładkowaniu ZUS, co czyni ją tańszą, ale wymaga zgłoszenia do rejestru ZUS w terminie 7 dni od zawarcia."
    },
    {
      question: "5. Jak obliczyć stawkę godzinową z wynagrodzenia miesięcznego?",
      answer: "Obliczanie stawki godzinowej z miesięcznego wynagrodzenia brutto lub netto wymaga dokładnego przeanalizowania liczby godzin roboczych w danym miesiącu kalendarzowym. Standardowy polski wymiar pracy na pełnym etacie opiera się na 5-dniowym tygodniu pracy po 8 godzin dziennie, co daje przeciętnie 40 godzin tygodniowo. W zależności od układu dni świątecznych i weekendów, nominalna liczba godzin pracy waha się od 160 godzin w krótszych miesiącach (np. luty), poprzez 168 godzin w miesiącach standardowych, aż do 176 godzin w najdłuższych okresach roboczych. Aby uzyskać stawkę godzinową brutto, należy pełną kwotę wynagrodzenia miesięcznego podzielić przez nominalną liczbę roboczogodzin w danym miesiącu. Nasze narzędzie w Trybie 3 automatycznie wylicza oraz rzetelnie pokazuje te stawki dla trzech najczęstszych horyzontów (160h, 168h, 176h) oraz błyskawicznie przelicza je na europejską walutę EUR po kursie Europejskiego Banku Centralnego, co jest niezastąpione podczas negocjowania kontraktów z zagranicznymi korporacjami."
    },
    {
      question: "6. Co to jest mały ZUS Plus i kto może z niego skorzystać?",
      answer: "Mały ZUS Plus to unikalne rozwiązanie pomocowe w Polsce, skierowane do najmniejszych przedsiębiorców prowadzących jednoosobową działalność gospodarczą. Pozwala ono na opłacanie obniżonych składek na ubezpieczenia społeczne, których ostateczna wysokość jest ściśle uzależniona od dochodu osiągniętego przez firmę w poprzednim roku kalendarzowym, a nie od stałej, odgórnie narzuconej podstawy krajowej. Aby móc skorzystać z programu Mały ZUS Plus w bieżącym roku, należy spełnić kilka ustawowych warunków krytycznych: roczny przychód z działalności gospodarczej w poprzednim roku ne może przekroczyć kwoty 120 000 złotych, a sama działalność musiała być prowadzona przez co najmniej 60 dni. Z rozwiązania tego nie mogą niestety skorzystać osoby, które dopiero co założyły firmę (dla nich przewidziano tzw. Ulgę na start przez pierwsze 6 miesięcy oraz Preferencyjny ZUS przez kolejne 24 miesiące) ani przedsiębiorcy świadczący usługi na rzecz swojego byłego pracodawcy, u którego pracowali na etacie w bieżącym lub ubiegłym roku."
    },
    {
      question: "7. Jak zmienią się składki ZUS w 2026 roku?",
      answer: "Składki ZUS w Polsce podlegają corocznej automatycznej waloryzacji, która jest ściśle powiązana ze wskaźnikami makroekonomicznymi kraju, a zwłaszcza z prognozowanym przeciętnym wynagrodzeniem miesięcznym w gospodarce narodowej. Podstawa wymiaru składek społecznych dla przedsiębiorców na pełnym ZUS-ie stanowi 60% tego przeciętnego wynagrodzenia. Wzrost średniej płacy krajowej bezpośrednio przekłada się na podwyższenie comiesięcznego obciążenia składkami społecznymi (emerytalne, rentowe, wypadkowe, chorobowe, Fundusz Pracy). W 2026 roku zaobserwowano istotne zmiany w wysokości tych obciążeń, przez co pełny ZUS społeczny bez ubezpieczenia zdrowotnego osiągnął poziom 1 485,31 zł. Dodatkowo składka zdrowotna, która dla ryczałtowców jest grupowana według trzech progów przychodowych (podstawa 60%, 100% lub 180% przeciętnego wynagrodzenia) została zwaloryzowana do stawki 381,78 zł w najczęstszej grupie przychodów programistów IT. Te nieustanne wzrosty sprawiają, że regularne przeliczanie rentowności jest koniecznością."
    },
    {
      question: "8. Kalkulator UoP vs B2B — jak korzystać z narzędzia?",
      answer: "Korzystanie z narzędzia KalkulatorB2B.pl zostało zaprojektowane z myślą o maksymalnej prostocie, intuicyjności oraz pełnej merytorycznej transparentności. Narzędzie składa się z trzech wyspecjalizowanych zakładek. W pierwszej zakładce, przeznaczonej dla firm, możesz bez trudu zweryfikować, jaki jest pełny koszt zatrudnienia pracownika na umowie o pracę i jak wygląda struktura składek na ubezpieczenia. W drugiej zakładce, stworzonej z myślą o pracownikach, możesz dynamicznie porównać, ile realnie trafi do Twojej kieszeni, wybierając tradycyjny etat (UoP) versus przejście na samozatrudnienie (B2B) z uwzględnieniem wybranej formy opodatkowania (np. ryczałt IT 12% czy liniówka 19%) oraz kosztów księgowości. Wystarczy wpisać stawkę, a nasz algorytm przeanalizuje optymalną drogę, pokazując wprost wysokość oszczędności w ujęciu miesięcznym i rocznym. Ostatnia zakładka pozwala na wygodne przeliczanie nominalnych stawek godzinowych, pomocnych przy planowaniu fakturowania."
    }
  ];

  return (
    <section id="faq" className="py-20 border-t border-[#27272A] bg-[#0F0F10]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 mb-3.5">
            <HelpCircle className="h-5 w-5 text-[#818CF8]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-sans">
            Najczęściej Zadawane Pytania (FAQ)
          </h2>
          <p className="mt-3 text-sm text-[#A1A1AA]">
            Wszystko, co musisz wiedzieć o podatkach, składkach ZUS i kalkulacji UoP/B2B na rok 2026.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-[#27272A] bg-[#18181B] transition-all hover:border-[#3F3F46]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-4.5 text-left font-semibold text-white hover:text-[#818CF8] transition duration-150"
                  aria-expanded={isOpen}
                  id={`faq-btn-${index}`}
                >
                  <span className="font-sans text-sm sm:text-base leading-snug">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4.5 w-4.5 text-[#818CF8] shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5 text-[#52525B] shrink-0 ml-4" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed border-t border-[#27272A] pt-4.5">
                    <p className="whitespace-pre-line text-justify">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Source citation labels with safe layouts */}
        <div className="mt-10 p-4.5 rounded-xl bg-[#18181B] border border-[#27272A] flex items-start gap-3">
          <span className="text-[10px] bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/20 font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0 uppercase">Źródła</span>
          <div className="text-xs text-[#52525B] leading-relaxed">
            Wszystkie algorytmy i stawki opierają się na oficjalnych wytycznych państwowych. Zweryfikuj aktualne przepisy bezpośrednio na portalach rządowych:{" "}
            <a
              href="https://www.zus.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6366F1] hover:text-[#818CF8] hover:underline font-semibold"
            >
              ZUS.pl
            </a>{" "}
            oraz{" "}
            <a
              href="https://www.podatki.gov.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6366F1] hover:text-[#818CF8] hover:underline font-semibold"
            >
              podatki.gov.pl
            </a>.
          </div>
        </div>

      </div>
    </section>
  );
}
