import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatPeriod } from '../shared/dates'
import type { Vacation } from '../shared/types'

type RejectDialogProps = {
  vacation: Vacation | null
  pending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
}

export function RejectDialog({ vacation, pending, onOpenChange, onConfirm }: RejectDialogProps) {
  const [reason, setReason] = useState('')

  return (
    <Dialog
      open={vacation !== null}
      onOpenChange={(open) => {
        if (!open) setReason('')
        onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recusar solicitação</DialogTitle>
          <DialogDescription>
            {vacation && `${vacation.employee?.name} · ${formatPeriod(vacation.startDate, vacation.endDate)}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="reject-reason">Motivo (opcional)</Label>
          <Textarea
            id="reject-reason"
            placeholder="Ex.: período de fechamento do trimestre"
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <p className="text-right text-xs text-muted-foreground">{reason.length}/500</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" disabled={pending} onClick={() => onConfirm(reason)}>
            {pending ? <Loader2 className="animate-spin" /> : <X />}
            Recusar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
