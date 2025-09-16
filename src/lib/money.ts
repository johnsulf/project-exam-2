export function formatMoney(
  amount: number,
  opts?: { currency?: string; locale?: string; minimumFractionDigits?: number },
) {
  const {
    currency = "USD",
    locale = undefined,
    minimumFractionDigits = 0,
  } = opts || {};
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
  }).format(amount);
}

export function calcBookingTotals(
  pricePerNight: number,
  dateFrom: Date,
  dateTo: Date,
) {
  const nights = Math.max(
    0,
    Math.round(
      (+new Date(toISO(dateTo)) - +new Date(toISO(dateFrom))) / 86_400_000,
    ),
  );
  const subtotal = pricePerNight * nights;
  const taxes = 0;
  const fees = 0;
  const total = subtotal + taxes + fees;
  return { nights, subtotal, taxes, fees, total };
}

// Tiny local helper (for avoiding cross-file import)
const pad = (n: number) => n.toString().padStart(2, "0");
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
