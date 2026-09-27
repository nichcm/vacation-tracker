import { getDate, getDaysInMonth, isWeekend, max, min, setDate } from 'date-fns'
import { cn } from '@/lib/utils'
import { formatPeriod, parseDateOnly } from '../shared/dates'

type TimelineProps = {
  /** Primeiro dia do mês exibido. */
  month: Date
  /** Dia de hoje, se estiver dentro do mês exibido. */
  today?: Date
}

const percent = (value: number, total: number) => `${(value / total) * 100}%`

/** Cabeçalho com os números dos dias do mês. */
export function TimelineHeader({ month }: TimelineProps) {
  const total = getDaysInMonth(month)
  const labels = [1, 5, 10, 15, 20, 25, total]

  return (
    <div className="relative h-4 text-[10px] tabular-nums text-muted-foreground" aria-hidden>
      {labels.map((day) => (
        <span key={day} className="absolute -translate-x-1/2" style={{ left: percent(day - 0.5, total) }}>
          {day}
        </span>
      ))}
    </div>
  )
}

/** Faixa do mês com a barra do período de férias recortada ao mês. */
export function TimelineBar({
  month,
  today,
  startDate,
  endDate,
}: TimelineProps & { startDate: string; endDate: string }) {
  const total = getDaysInMonth(month)
  const monthStart = setDate(month, 1)
  const monthEnd = setDate(month, total)
  const from = max([parseDateOnly(startDate), monthStart])
  const to = min([parseDateOnly(endDate), monthEnd])
  const firstDay = getDate(from)
  const span = getDate(to) - firstDay + 1

  return (
    <div
      className="relative h-7 overflow-hidden rounded-md bg-muted"
      role="img"
      aria-label={`Férias: ${formatPeriod(startDate, endDate)}`}
    >
      {Array.from({ length: total }, (_, i) =>
        isWeekend(setDate(month, i + 1)) ? (
          <div
            key={i}
            className="absolute inset-y-0 bg-foreground/5"
            style={{ left: percent(i, total), width: percent(1, total) }}
          />
        ) : null,
      )}
      <div
        className={cn(
          'absolute inset-y-1 rounded-sm bg-primary',
          parseDateOnly(startDate) < monthStart && 'rounded-l-none',
          parseDateOnly(endDate) > monthEnd && 'rounded-r-none',
        )}
        style={{ left: percent(firstDay - 1, total), width: percent(span, total) }}
      />
      {today && (
        <div
          className="absolute inset-y-0 w-0.5 bg-destructive"
          style={{ left: percent(getDate(today) - 0.5, total) }}
          title="Hoje"
        />
      )}
    </div>
  )
}
