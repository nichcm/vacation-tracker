export const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
export const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

const pad = (n: number) => String(n).padStart(2, '0');

const toUtcMs = (value: string) => {
  const [y, m, d] = value.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

/** Converte um Date (no fuso local do processo) para AAAA-MM-DD. */
export function toDateOnly(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Verifica se a string é uma data de calendário válida (ex.: rejeita 2026-02-30). */
export function isValidDateOnly(value: string): boolean {
  const match = DATE_ONLY_PATTERN.exec(value);
  if (!match) return false;
  const [y, m, d] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

/** Quantidade de dias corridos entre duas datas, inclusive. */
export function daysBetweenInclusive(start: string, end: string): number {
  return Math.round((toUtcMs(end) - toUtcMs(start)) / 86_400_000) + 1;
}

/** Primeiro e último dia de um mês no formato AAAA-MM. */
export function monthRange(month: string): { first: string; last: string } {
  const [y, m] = month.split('-').map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    first: `${y}-${pad(m)}-01`,
    last: `${y}-${pad(m)}-${pad(lastDay)}`,
  };
}
