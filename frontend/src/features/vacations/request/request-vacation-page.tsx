import { differenceInCalendarDays, startOfToday } from 'date-fns'
import { CalendarPlus, History, Loader2, Send, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMediaQuery } from '@/hooks/use-media-query'
import { formatDate, formatPeriod, parseDateOnly, pluralDays, toDateOnly } from '../shared/dates'
import { EmptyState } from '../shared/empty-state'
import { StatusBadge } from '../shared/status-badge'
import { useMyVacations, useRequestVacation } from './queries'

export function RequestVacationPage() {
  const [range, setRange] = useState<DateRange | undefined>()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const today = startOfToday()

  const myVacations = useMyVacations()
  const requestVacation = useRequestVacation()

  // Bloqueia no calendário os dias já cobertos por solicitações pendentes/aprovadas
  const blockedRanges = useMemo(
    () =>
      (myVacations.data ?? [])
        .filter((v) => v.status !== 'REJECTED')
        .map((v) => ({ from: parseDateOnly(v.startDate), to: parseDateOnly(v.endDate) })),
    [myVacations.data],
  )

  const from = range?.from
  const to = range?.to ?? range?.from
  const selectedDays = from && to ? differenceInCalendarDays(to, from) + 1 : 0

  function handleSubmit() {
    if (!from || !to) return
    requestVacation.mutate(
      { startDate: toDateOnly(from), endDate: toDateOnly(to) },
      {
        onSuccess: () => {
          toast.success('Solicitação enviada para aprovação')
          setRange(undefined)
        },
        onError: (error) => toast.error(error.message),
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarPlus className="size-5" /> Nova solicitação
          </CardTitle>
          <CardDescription>Selecione a data de início e a data de fim no calendário.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="range"
            locale={ptBR}
            numberOfMonths={isDesktop ? 2 : 1}
            selected={range}
            onSelect={setRange}
            disabled={[{ before: today }, ...blockedRanges]}
            excludeDisabled
            startMonth={today}
            className="rounded-lg border [--cell-size:--spacing(9)]"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm" aria-live="polite">
            {from && to ? (
              <>
                <span className="font-medium">{formatPeriod(toDateOnly(from), toDateOnly(to))}</span>
                <span className="text-muted-foreground"> · {pluralDays(selectedDays)}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Nenhum período selecionado</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setRange(undefined)} disabled={!from}>
              <X /> Limpar
            </Button>
            <Button onClick={handleSubmit} disabled={!from || requestVacation.isPending}>
              {requestVacation.isPending ? <Loader2 className="animate-spin" /> : <Send />}
              Solicitar férias
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5" /> Minhas solicitações
          </CardTitle>
          <CardDescription>Acompanhe o status dos seus pedidos.</CardDescription>
        </CardHeader>
        <CardContent>
          {myVacations.isLoading ? (
            <div className="grid gap-2">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : myVacations.data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-right">Dias</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myVacations.data.map((vacation) => (
                  <TableRow key={vacation.id}>
                    <TableCell className="font-medium">
                      {formatPeriod(vacation.startDate, vacation.endDate)}
                      <div className="text-xs font-normal text-muted-foreground">
                        Solicitado em {formatDate(vacation.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{vacation.days}</TableCell>
                    <TableCell>
                      <StatusBadge status={vacation.status} />
                    </TableCell>
                    <TableCell className="hidden max-w-64 whitespace-normal text-muted-foreground sm:table-cell">
                      {vacation.rejectionReason ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={CalendarPlus}
              title="Nenhuma solicitação ainda"
              description="Escolha um período no calendário para fazer o seu primeiro pedido."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
