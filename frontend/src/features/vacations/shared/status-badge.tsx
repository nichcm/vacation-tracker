import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { VacationStatus } from './types'

const STATUS = {
  PENDING: {
    label: 'Pendente',
    icon: Clock,
    className: 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300',
  },
  APPROVED: {
    label: 'Aprovada',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  REJECTED: {
    label: 'Recusada',
    icon: XCircle,
    className: 'bg-red-100 text-red-900 dark:bg-red-500/15 dark:text-red-300',
  },
} satisfies Record<VacationStatus, { label: string; icon: typeof Clock; className: string }>

export function StatusBadge({ status }: { status: VacationStatus }) {
  const { label, icon: Icon, className } = STATUS[status]
  return (
    <Badge variant="secondary" className={cn(className)}>
      <Icon data-icon="inline-start" />
      {label}
    </Badge>
  )
}
