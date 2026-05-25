/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { formatPLN, formatEUR } from "../types";

interface AnimatedNumberProps {
  value: number;
  format?: 'PLN' | 'EUR';
}

export default function AnimatedNumber({ value, format = 'PLN' }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const prevValueRef = useRef<number>(0);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = value;
    
    let start: number | null = null;
    const duration = 400; // ms

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const currentVal = from + (to - from) * eased;
      
      setDisplayValue(currentVal);
      prevValueRef.current = currentVal;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(to);
        prevValueRef.current = to;
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <>
      {format === 'PLN' ? formatPLN(Math.round(displayValue)) : formatEUR(displayValue)}
    </>
  );
}
