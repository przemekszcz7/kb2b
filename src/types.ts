/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// AKTUALIZACJA STAWEK: STYCZEŃ 2026
// Poniższe stałe odzwierciedlają system podatkowy w Polsce na rok 2026.
// Przy zmianie przepisów, po prostu zaktualizuj poniższe wartości.
// ==========================================

export const TAX_RATES_2026 = {
  // Podatek dochodowy (Skala Podatkowa)
  SCALE_LIMIT_STAGE_1: 120000, // Próg II skali (120 000 zł)
  TAX_RATE_STAGE_1: 0.12,      // 12% do progu
  TAX_RATE_STAGE_2: 0.32,      // 32% powyżej progu
  TAX_FREE_AMOUNT: 30000,      // Kwota wolna od podatku (30 000 zł)
  TAX_FREE_REDUCTION_YEARLY: 3600, // 30 000 zł * 12% = 3 600 zł rocznie ulgi

  // Składki ZUS Pracownika UoP (oraz Zlecenie)
  EMP_PENSION_RATE: 0.0976,    // Emerytalna: 9,76%
  EMP_DISABILITY_RATE: 0.0150, // Rentowa: 1,5%
  EMP_SICKNESS_RATE: 0.0245,   // Chorobowa: 2,45%
  EMP_HEALTH_RATE: 0.0900,     // Zdrowotna: 9%

  // Koszty Pracodawcy UoP (od wynagrodzenia brutto)
  PRAC_PENSION_RATE: 0.0976,   // Emerytalna pracodawcy: 9,76%
  PRAC_DISABILITY_RATE: 0.0650,// Rentowa pracodawcy: 6,5%
  PRAC_ACCIDENT_RATE: 0.0167,  // Wypadkowa pracodawcy: 1,67% (standardowa)
  PRAC_FP_RATE: 0.0245,        // Fundusz Pracy: 2,45%
  PRAC_FGSP_RATE: 0.0010,      // FGŚP: 0,10%
  // Łączny koszt pracodawcy to brutto * 1.2048 (suma powyższych stawek to 20.48%)

  // B2B (Jednoosobowa działalność gospodarcza)
  B2B_HEALTH_RYCZALT_IT: 381.78,    // Składka zdrowotna ryczałt IT (podstawa = 60% przeciętnego wynagrodzenia)
  B2B_SOCIAL_PREFERENTIAL: 248.15, // Mały ZUS Plus (część społeczna preferencyjna - pierwsze 24 msc)
  B2B_SOCIAL_FULL: 1485.31,        // Pełny ZUS społeczny (składka emerytalna, rentowa, wypadkowa, chorobowa, tożsama na 2026)
  B2B_RYCZALT_IT_TAX_RATE: 0.12,   // Ryczałt IT: 12%
  B2B_LINEAR_TAX_RATE: 0.19,       // Podatek liniowy: 19%

  // Zlecenie
  ZLECENIE_KUP_RATE: 0.20,         // Koszty Uzyskania Przychodu (Standard: 20%)

  // Kurs wymiany walut (PLN/EUR)
  // Ręczna aktualizacja w razie wahań rynkowych
  EXCHANGE_RATE_EUR: 4.35           // 1 EUR = 4.35 PLN (Stan styczeń 2026)
};

// Typy darmowego i płatnego planu
export type PlanType = 'FREE' | 'PRO' | 'AGENCY';

// Opcje dla kalkulatora B2B
export interface B2BOptions {
  zusType: 'NONE' | 'PREFERENTIAL' | 'FULL'; // Ulga na start (0zł) / Mały ZUS Plus / Pełny ZUS
  taxType: 'RYCZALT' | 'LINEAR' | 'SCALE';   // Ryczałt 12% / Liniowy 19% / Skala (Zasady ogólne)
  expenses: number;                         // Koszty prowadzenia działalności (np. księgowość, biuro)
  isSickPayChecked: boolean;                // Czy opłaca dobrowolną składkę chorobową na B2B
}

// Opcje dla Umowy Zlecenie
export interface ZlecenieOptions {
  isStudentUnder26: boolean;                // Czy zwolniony z PIT (Student do 26 roku życia)
  hasOtherJobWithZus: boolean;              // Czy ma inny tytuł do ubezpieczeń (zwolnienie z ZUS społecznego)
  isSickPayChecked: boolean;                // Czy dobrowolne ubezpieczenie chorobowe
}

// Model zapisywanych danych w LocalStorage (historia kalkulacji dla wersji PRO/AGENCY)
export interface SavedCalculation {
  id: string;
  date: string;
  title: string;
  amount: number;
  calculatorType: 'EMPLOYER_COST' | 'NET_PAY_COMPARISON' | 'HOURLY_CONVERSION';
  details: string; // Krótkie podsumowanie
}

// Wyniki wyliczeń UoP
export interface UoPResult {
  brutto: number;
  pracownikSocial: {
    emerytalna: number;
    rentowa: number;
    chorobowa: number;
    sumaSocial: number;
  };
  pracownikZdrowotna: number;
  podstawaOpodatkowania: number;
  podatekDochodowy: number;
  netto: number;
  pracodawcaSocial: {
    emerytalna: number;
    rentowa: number;
    wypadkowa: number;
    fp: number;
    fgsp: number;
    sumaSocial: number;
  };
  calkowityKosztPracodawcy: number;
}

// Wyniki wyliczeń B2B
export interface B2BResult {
  fakturaNetto: number; // Kwota na fakturze netto (przychód)
  zusSpoleczny: number;
  zusZdrowotny: number;
  kosztyBiura: number;
  podstawaOpodatkowania: number;
  podatekDochodowy: number;
  netto: number;
  formaMaloZdyskredytowana: string;
}

// Wyniki wyliczeń Umowy Zlecenie
export interface ZlecenieResult {
  brutto: number;
  zusSpoleczny: number;
  zusZdrowotny: number;
  kosztyUzyskania: number;
  podstawaOpodatkowania: number;
  podatekDochodowy: number;
  netto: number;
}

// Wyniki przeliczenia stawek godzinowych
export interface HourlyResult {
  miesieczneWynagrodzenie: number;
  stawka160h: number;
  stawka168h: number;
  stawka176h: number;
  miesieczneEur: number;
  stawka160hEur: number;
}

// ==========================================
// FUNKCJE MATEMATYCZNE / WYGŁADZANIE payroll
// ==========================================

/**
 * Oblicza wysokość podatku na skali podatkowej rocznie (i dzieli przez 12 do celów porównawczych)
 */
export function calculateScaleTaxMonthly(monthlyTaxableBasis: number): number {
  const annualTaxableBasis = monthlyTaxableBasis * 12;
  let annualTax = 0;

  if (annualTaxableBasis <= TAX_RATES_2026.TAX_FREE_AMOUNT) {
    annualTax = 0;
  } else if (annualTaxableBasis <= TAX_RATES_2026.SCALE_LIMIT_STAGE_1) {
    annualTax = (annualTaxableBasis * TAX_RATES_2026.TAX_RATE_STAGE_1) - TAX_RATES_2026.TAX_FREE_REDUCTION_YEARLY;
  } else {
    const stage1Tax = (TAX_RATES_2026.SCALE_LIMIT_STAGE_1 * TAX_RATES_2026.TAX_RATE_STAGE_1) - TAX_RATES_2026.TAX_FREE_REDUCTION_YEARLY;
    const excess = annualTaxableBasis - TAX_RATES_2026.SCALE_LIMIT_STAGE_1;
    annualTax = stage1Tax + (excess * TAX_RATES_2026.TAX_RATE_STAGE_2);
  }

  return Math.max(0, annualTax / 12);
}

/**
 * Oblicza pełny koszt i składki UoP (Umowa o Pracę)
 */
export function calculateUoP(brutto: number): UoPResult {
  const {
    EMP_PENSION_RATE,
    EMP_DISABILITY_RATE,
    EMP_SICKNESS_RATE,
    EMP_HEALTH_RATE,
    PRAC_PENSION_RATE,
    PRAC_DISABILITY_RATE,
    PRAC_ACCIDENT_RATE,
    PRAC_FP_RATE,
    PRAC_FGSP_RATE
  } = TAX_RATES_2026;

  // Składki społeczne pracownika
  const emEmp = brutto * EMP_PENSION_RATE;
  const reEmp = brutto * EMP_DISABILITY_RATE;
  const chEmp = brutto * EMP_SICKNESS_RATE;
  const sumaSocialEmp = emEmp + reEmp + chEmp;

  // Składka zdrowotna pracownika
  const basisZdrowotna = brutto - coldPrecision(sumaSocialEmp);
  const zdravEmp = basisZdrowotna * EMP_HEALTH_RATE;

  // Zaliczka na podatek dochodowy (Koszty Uzyskania Przychodu = 250 PLN standard)
  const kup = 250;
  const taxableBasis = Math.max(0, Math.round(brutto - sumaSocialEmp - kup));
  const podatek = calculateScaleTaxMonthly(taxableBasis);

  const netto = Math.max(0, brutto - sumaSocialEmp - zdravEmp - podatek);

  // Koszty pracodawcy
  const emPrac = brutto * PRAC_PENSION_RATE;
  const rePrac = brutto * PRAC_DISABILITY_RATE;
  const wyPrac = brutto * PRAC_ACCIDENT_RATE;
  const fpPrac = brutto * PRAC_FP_RATE;
  const fgspPrac = brutto * PRAC_FGSP_RATE;
  const sumaSocialPrac = emPrac + rePrac + wyPrac + fpPrac + fgspPrac;
  const calkowityKoszt = brutto + sumaSocialPrac;

  return {
    brutto,
    pracownikSocial: {
      emerytalna: emEmp,
      rentowa: reEmp,
      chorobowa: chEmp,
      sumaSocial: sumaSocialEmp
    },
    pracownikZdrowotna: zdravEmp,
    podstawaOpodatkowania: taxableBasis,
    podatekDochodowy: podatek,
    netto,
    pracodawcaSocial: {
      emerytalna: emPrac,
      rentowa: rePrac,
      wypadkowa: wyPrac,
      fp: fpPrac,
      fgsp: fgspPrac,
      sumaSocial: sumaSocialPrac
    },
    calkowityKosztPracodawcy: calkowityKoszt
  };
}

/**
 * Oblicza pełny koszt i podatki B2B
 * wejściem jest stawka netto (faktura bez VAT)
 */
export function calculateB2B(fakturaNetto: number, options: B2BOptions): B2BResult {
  const {
    B2B_HEALTH_RYCZALT_IT,
    B2B_SOCIAL_PREFERENTIAL,
    B2B_SOCIAL_FULL,
    B2B_RYCZALT_IT_TAX_RATE,
    B2B_LINEAR_TAX_RATE
  } = TAX_RATES_2026;

  // 1. Składki społeczne ZUS
  let socialSecurity = 0;
  if (options.zusType === 'PREFERENTIAL') {
    socialSecurity = B2B_SOCIAL_PREFERENTIAL;
  } else if (options.zusType === 'FULL') {
    socialSecurity = B2B_SOCIAL_FULL;
  }
  
  // Jeśli ma opłacanie chorobowej na preferencyjnym/pełnym zusie, doliczmy drobny ułamek (opcjonalny dla porządku, upraszczamy do ujętej stałej)
  if (options.isSickPayChecked && options.zusType === 'PREFERENTIAL') {
    socialSecurity += 31.50; // Szacunek dla chorobowego w małym zusie
  }

  // 2. Składka zdrowotna
  let healthInsurance = 0;
  if (options.taxType === 'RYCZALT') {
    healthInsurance = B2B_HEALTH_RYCZALT_IT;
  } else if (options.taxType === 'LINEAR') {
    // Podatek liniowy: zdrowotna to 4,9% dochodu, ale minimum 381,78 zł
    const dochod = Math.max(0, fakturaNetto - socialSecurity - options.expenses);
    healthInsurance = Math.max(B2B_HEALTH_RYCZALT_IT, dochod * 0.049);
  } else {
    // Skala: zdrowotna to 9% dochodu, ale minimum 381,78 zł
    const dochod = Math.max(0, fakturaNetto - socialSecurity - options.expenses);
    healthInsurance = Math.max(B2B_HEALTH_RYCZALT_IT, dochod * 0.09);
  }

  // 3. Podatek dochodowy
  let podatek = 0;
  let podstawa = 0;

  if (options.taxType === 'RYCZALT') {
    // Ryczałt 12% od przychodu. Przychód możemy obniżyć o 100% składek społecznych i 50% zdrowotnej (ryczałt ryczałt IT)
    podstawa = Math.max(0, fakturaNetto - socialSecurity - (healthInsurance * 0.5));
    podatek = podstawa * B2B_RYCZALT_IT_TAX_RATE;
  } else if (options.taxType === 'LINEAR') {
    // Podatek liniowy 19%. Podstawa: przychód minus koszty minus składki społeczne ZUS. Liniowcy mogą zaliczyć zdrowotną (do limitu) w koszty, ale upraszczamy standardowo.
    podstawa = Math.max(0, fakturaNetto - socialSecurity - options.expenses);
    podatek = podstawa * B2B_LINEAR_TAX_RATE;
  } else {
    // Skala 12% / 32%. Podstawa: przychód minus koszty minus składki społeczne
    podstawa = Math.max(0, fakturaNetto - socialSecurity - options.expenses);
    podatek = calculateScaleTaxMonthly(podstawa);
  }

  // Obliczenie ostatecznego zysku netto "do kieszeni"
  const netto = Math.max(0, fakturaNetto - socialSecurity - healthInsurance - podatek - options.expenses);

  return {
    fakturaNetto,
    zusSpoleczny: socialSecurity,
    zusZdrowotny: healthInsurance,
    kosztyBiura: options.expenses,
    podstawaOpodatkowania: podstawa,
    podatekDochodowy: podatek,
    netto,
    formaMaloZdyskredytowana: options.taxType === 'RYCZALT' ? 'Ryczałt IT (12%)' : (options.taxType === 'LINEAR' ? 'Podatek Liniowy (19%)' : 'Skala Podatkowa (Zasady ogólne)')
  };
}

/**
 * Oblicza pełny koszt i podatki Umowy Zlecenie
 */
export function calculateZlecenie(brutto: number, options: ZlecenieOptions): ZlecenieResult {
  const {
    EMP_PENSION_RATE,
    EMP_DISABILITY_RATE,
    EMP_SICKNESS_RATE,
    EMP_HEALTH_RATE,
    ZLECENIE_KUP_RATE
  } = TAX_RATES_2026;

  // 1. Składki społeczne ZUS (pracownik płaci, jeśli nie ma innego tytułu lub nie jest studentem)
  let pension = 0;
  let disability = 0;
  let sickness = 0;

  const standardZus = !options.isStudentUnder26 && !options.hasOtherJobWithZus;

  if (standardZus) {
    pension = brutto * EMP_PENSION_RATE;
    disability = brutto * EMP_DISABILITY_RATE;
    if (options.isSickPayChecked) {
      sickness = brutto * EMP_SICKNESS_RATE; // Dobrowolne chorobowe
    }
  }

  const sumaSocial = pension + disability + sickness;

  // 2. Składka zdrowotna (jeśli nie student do 26 r.ż., to podlega zdrowotnej, chyba że to uczeń)
  let health = 0;
  if (!options.isStudentUnder26) {
    health = (brutto - sumaSocial) * EMP_HEALTH_RATE;
  }

  // 3. Koszty uzyskania przychodów (KUP) - zazwyczaj 20% od podstawy pomniejszonej o społeczne
  const kup = Math.max(0, (brutto - coldPrecision(sumaSocial)) * ZLECENIE_KUP_RATE);

  // 4. Podatek dochodowy (Student do 26 r.ż. ma "Ulga dla Młodych" i nie płaci PIT do 85 528 zł rocznie)
  let taxableBasis = 0;
  let podatek = 0;

  if (!options.isStudentUnder26) {
    taxableBasis = Math.max(0, Math.round(brutto - sumaSocial - kup));
    podatek = calculateScaleTaxMonthly(taxableBasis);
  }

  const netto = Math.max(0, brutto - sumaSocial - health - podatek);

  return {
    brutto,
    zusSpoleczny: coldPrecision(sumaSocial),
    zusZdrowotny: health,
    kosztyUzyskania: kup,
    podstawaOpodatkowania: taxableBasis,
    podatekDochodowy: podatek,
    netto
  };
}

/**
 * Przelicza stawkę godzinową z podanego wynagrodzenia brutto/miesięcznego
 */
export function calculateHourlyPrices(monthlyAmount: number): HourlyResult {
  const stawka160h = monthlyAmount / 160;
  const stawka168h = monthlyAmount / 168;
  const stawka176h = monthlyAmount / 176;
  const monthlyEur = monthlyAmount / TAX_RATES_2026.EXCHANGE_RATE_EUR;
  const stawka160hEur = stawka160h / TAX_RATES_2026.EXCHANGE_RATE_EUR;

  return {
    miesieczneWynagrodzenie: monthlyAmount,
    stawka160h,
    stawka168h,
    stawka176h,
    miesieczneEur: monthlyEur,
    stawka160hEur
  };
}

/**
 * Formatowanie polskiej waluty w standardzie PLN 'X XXX,YY zł'
 */
export function formatPLN(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formatowanie waluty EUR
 */
export function formatEUR(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Uproszczenie do zaokrąglenia groszy
function coldPrecision(num: number): number {
  return Math.round(num * 100) / 100;
}
