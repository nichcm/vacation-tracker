import { Check, ClipboardCheck, Inbox, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatPeriod, initials } from '../shared/dates'
import { EmptyState } from '../shared/empty-state'
import type { Vacation } from '../shared/types'
import { useApproveVacation, usePendingVacations, useRejectVacation } from './queries'
import { RejectDialog } from './reject-dialog'

export function ApprovalsPage() {
  const pending = usePendingVacations()
  const approve = useApproveVacation()
  const reject = useRejectVacation()
  const [rejecting, setRejecting] = useState<Vacation | null>(null)

  function handleApprove(vacation: Vacation) {
    approve.mutate(vacation.id, {
      onSuccess: () => toast.success(`Férias de ${vacation.employee?.name} aprovadas`),
      onError: (error) => toast.error(error.message),
    })
  }

  function handleReject(reason: string) {
    if (!rejecting) return
    const vacation = rejecting
    reject.mutate(
      { id: vacation.id, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(`Solicitação de ${vacation.employee?.name} recusada`)
          setRejecting(null)
        },
        onError: (error) => toast.error(error.message),
      },
    )
  }

  const busyId = approve.isPending ? approve.variables : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="size-5" /> Aprovações pendentes
        </CardTitle>
        <CardDescription>Aprove ou recuse os pedidos de férias da equipe.</CardDescription>
      </CardHeader>
      <CardContent>
        {pending.isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : pending.data?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Dias</TableHead>
                <TableHead className="hidden md:table-cell">Solicitado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.data.map((vacation) => (
                <TableRow key={vacation.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden sm:flex">
                        <AvatarFallback>{initials(vacation.employee?.name ?? '?')}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium">{vacation.employee?.name}</div>
                        <div className="hidden text-xs text-muted-foreground sm:block">{vacation.employee?.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPeriod(vacation.startDate, vacation.endDate)}</TableCell>
                  <TableCell className="text-right tabular-nums">{vacation.days}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(vacation.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRejecting(vacation)}
                        disabled={busyId === vacation.id}
                        aria-label={`Recusar férias de ${vacation.employee?.name}`}
                      >
                        <X /> <span className="hidden sm:inline">Recusar</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(vacation)}
                        disabled={busyId === vacation.id}
                        aria-label={`Aprovar férias de ${vacation.employee?.name}`}
                      >
                        <Check /> <span className="hidden sm:inline">Aprovar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={Inbox}
            title="Nenhuma solicitação pendente"
            description="Quando alguém da equipe pedir férias, o pedido aparecerá aqui."
          />
        )}
      </CardContent>

      <RejectDialog
        vacation={rejecting}
        pending={reject.isPending}
        onOpenChange={(open) => !open && setRejecting(null)}
        onConfirm={handleReject}
      />
    </Card>
  )
}
