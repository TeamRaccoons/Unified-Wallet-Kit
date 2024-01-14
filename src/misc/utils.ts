import { Decimal } from 'decimal.js';
import { RefObject, useEffect, useRef } from 'react';

const userLocale =
  typeof window !== 'undefined'
    ? navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language
    : 'en-US';

export const numberFormatter = new Intl.NumberFormat(userLocale, {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 9,
});

export const formatNumber = {
  format: (val?: number, precision?: number) => {
    if (!val && val !== 0) {
      return '--';
    }

    if (precision !== undefined) {
      return val.toFixed(precision);
    } else {
      return numberFormatter.format(val);
    }
  },
};

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function fromLamports(lamportsAmount?: number, decimals?: number, rate: number = 1.0): number {
  if (!lamportsAmount) {
    return 0;
  }

  const amount = lamportsAmount;

  const base = 10;
  const precision = new Decimal(base).pow(decimals ?? 6);

  return new Decimal(amount.toString()).div(precision).mul(rate).toNumber();
}

export function toLamports(lamportsAmount: number, decimals: number): number {
  let amount = Number(lamportsAmount);

  if (Number.isNaN(amount)) {
    amount = 0;
  }
  const precision = Math.pow(10, decimals);

  return Math.floor(amount * precision);
}

// https://usehooks.com/useEventListener/
export function useReactiveEventListener(
  eventName: string,
  handler: (event: any) => void,
  element = typeof window !== 'undefined' ? window : null,
) {
  // Create a ref that stores handler
  const savedHandler = useRef<React.Ref<any>>();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        // Make sure element supports addEventListener
        // On
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;
        // Create event listener that calls handler function stored in ref
        const eventListener = (event: any) => typeof savedHandler.current === 'function' && savedHandler.current(event);
        // Add event listener
        element.addEventListener(eventName, eventListener);
        // Remove event listener on cleanup
        return () => {
          element.removeEventListener(eventName, eventListener);
        };
      }
    },
    [eventName, element], // Re-run if eventName or element changes
  );
}

export const isMobile = () => typeof window !== 'undefined' && screen && screen.width <= 480;

export const detectedSeparator = formatNumber.format(1.1).substring(1, 2);

export function useOutsideClick(ref: RefObject<HTMLElement>, handler: (e: MouseEvent) => void) {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mouseup', listener);
    return () => {
      document.removeEventListener('mouseup', listener);
    };
  }, [ref, handler]);
}

export function useDebouncedEffect(fn: Function, deps: any[], time: number) {
  const dependencies = [...deps, fn, time];
  useEffect(() => {
    const timeout = setTimeout(fn, time);
    return () => {
      clearTimeout(timeout);
    };
  }, dependencies);
}

/** Earlier items take precedence IF `getKey` is specified. */
export const dedupeList = <T, K>(arr: Array<T>, getKey?: (item: T) => K) => {
  if (!getKey) {
    return [...new Set(arr)];
  }

  const seen = new Set();
  const out: T[] = [];
  for (const item of arr) {
    const k = getKey(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
};
