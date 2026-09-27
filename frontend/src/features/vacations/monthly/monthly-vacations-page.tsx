import { addMonths, format, isSameMonth, isWithinInterval, startOfMonth, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight, Palmtree, Users } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatShortDate, initials, parseDateOnly, pluralDays, toMonthKey } from '../shared/dates'
import { EmptyState } from '../shared/empty-state'
import { TimelineBar, TimelineHeader } from './month-timeline'
import { useMonthlyVacations } from './queries'

const MONTH_PARAM = /^\d{4}-(0[1-9]|1[0-2])$/

export function MonthlyVacationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const today = startOfToday()
  const param = searchParams.get('mes')
  const month = param && MONTH_PARAM.test(param) ? parseDateOnly(`${param}-01`) : startOfMonth(today)
  const monthKey = toMonthKey(month)
  const isCurrentMonth = isSameMonth(month, today)

  const { data } = useMonthlyVacations(monthKey)
  const isLoading = data?.month !== monthKey
  const items = data?.items ?? []
  const onVacationToday = isCurrentMonth
    ? items.filter((v) => isWithinInterval(today, { start: parseDateOnly(v.startDate), end: parseDateOnly(v.endDate) }))
        .length
    : null

  const goTo = (target: Date) => setSearchParams(isSameMonth(target, today) ? {} : { mes: toMonthKey(target) })
  const monthLabel = format(month, "MMMM 'de' yyyy", { locale: ptBR })
  const title = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quem está de férias</h1>
          <p className="text-sm text-muted-foreground">Férias aprovadas da equipe, mês a mês.</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => goTo(addMonths(month, -1))} aria-label="Mês anterior">
            <ChevronLeft />
          </Button>
          <div className="min-w-40 text-center font-medium" aria-live="polite">
            {title}
          </div>
          <Button variant="outline" size="icon" onClick={() => goTo(addMonths(month, 1))} aria-label="Próximo mês">
            <ChevronRight />
          </Button>
          <Button variant="ghost" onClick={() => goTo(today)} disabled={isCurrentMonth}>
            Hoje
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Users className="size-4" /> De férias neste mês
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">{isLoading ? '–' : items.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Palmtree className="size-4" /> De férias hoje
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {onVacationToday === null || isLoading ? '–' : onVacationToday}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5" /> Calendário do mês
          </CardTitle>
          <CardDescription>{title}</CardDescription>
          {isCurrentMonth && (
            <CardAction className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span className="h-3 w-0.5 bg-destructive" /> hoje
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length ? (
            <div className="grid gap-4">
              <div className="hidden md:grid md:grid-cols-[16rem_1fr] md:gap-4">
                <span />
                <TimelineHeader month={month} />
              </div>
              {items.map((vacation) => {
                const name = vacation.employee?.name ?? 'Colaborador'
                const isToday =
                  isCurrentMonth &&
                  isWithinInterval(today, {
                    start: parseDateOnly(vacation.startDate),
                    end: parseDateOnly(vacation.endDate),
                  })
                return (
                  <div key={vacation.id} className="grid gap-2 md:grid-cols-[16rem_1fr] md:items-center md:gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials(name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{name}</span>
                          {isToday && (
                            <Badge variant="secondary" className="shrink-0">
                              Hoje
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatShortDate(vacation.startDate)} – {formatShortDate(vacation.endDate)} ·{' '}
                          {pluralDays(vacation.days)}
                        </div>
                      </div>
                    </div>
                    <TimelineBar
                      month={month}
                      today={isCurrentMonth ? today : undefined}
                      startDate={vacation.startDate}
                      endDate={vacation.endDate}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={Palmtree}
              title="Ninguém de férias neste mês"
              description="Só aparecem aqui as férias já aprovadas pelo gestor."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
