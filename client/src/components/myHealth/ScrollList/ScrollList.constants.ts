/** Room for `count` one-line items (min-h-10 each, gap-1.5 between, p-1.5 around) */
export const roomFor = (count: number) => `calc(${count} * 2.5rem + ${count - 1} * 0.375rem + 0.75rem)`
