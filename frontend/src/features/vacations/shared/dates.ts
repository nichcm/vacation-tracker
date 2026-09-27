import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/** 'AAAA-MM-DD' → Date no fuso local (sem deslocamento de UTC). */
export const parseDateOnly = (value: string) => parseISO(value)

/** Date → 'AAAA-MM-DD'. */
export const toDateOnly = (date: Date) => format(date, 'yyyy-MM-dd')

/** Date → 'AAAA-MM'. */
export const toMonthKey = (date: Date) => format(date, 'yyyy-MM')

export const formatDate = (value: string | Date) =>
  format(typeof value === 'string' ? parseISO(value) : value, 'dd/MM/yyyy', { locale: ptBR })

export const formatShortDate = (value: string | Date) =>
  format(typeof value === 'string' ? parseISO(value) : value, "dd 'de' MMM", { locale: ptBR })

export const formatPeriod = (start: string, end: string) =>
  start === end ? formatDate(start) : `${formatDate(start)} – ${formatDate(end)}`

export const pluralDays = (days: number) => `${days} ${days === 1 ? 'dia' : 'dias'}`

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
