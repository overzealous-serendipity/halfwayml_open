export function convertMillisecondsToTime(ms: number): string {
  let milliseconds: number = ms % 1000;
  let seconds: number = Math.floor(ms / 1000);
  let minutes: number = Math.floor(seconds / 60);
  let hours: number = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;

  const hoursStr: string = String(hours).padStart(2, "0");
  const minutesStr: string = String(minutes).padStart(2, "0");
  const secondsStr: string = String(seconds).padStart(2, "0");
  const millisecondsStr: string = String(milliseconds).padStart(3, "0");

  return `${hoursStr}:${minutesStr}:${secondsStr}:${millisecondsStr}`;
}

export const secondsToHms = (d: number) => {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  // Pad each value to ensure they are at least two digits
  const hDisplay = String(h).padStart(2, "0");
  const mDisplay = String(m).padStart(2, "0");
  const sDisplay = String(s).padStart(2, "0");

  return `${hDisplay}:${mDisplay}:${sDisplay}`;
};

/**
 * Formats a number as a currency string.
 *
 * @param amount - The amount to format.
 * @param currencyCode - The ISO 4217 currency code.
 * @returns The formatted currency string.
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  });
  const amountInDollars = (amount / 100).toFixed(0) as unknown as number;
  return formatter.format(amountInDollars); // Assuming amount is in the smallest unit like cents
};
