import { AlertCircle, Loader2, UserPlus } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROLE_LABEL, type UserRole } from '@/features/auth/auth-context'
import { type CreateUserInput, useCreateUser } from './queries'

const EMPTY: CreateUserInput = { name: '', email: '', password: '', role: 'EMPLOYEE' }

const ROLE_HINT: Record<UserRole, string> = {
  EMPLOYEE: 'Solicita férias e consulta o calendário.',
  MANAGER: 'Também aprova e recusa pedidos de férias (inclusive de outros gestores).',
  ADMIN: 'Cadastra usuários e também aprova e recusa pedidos.',
}

export function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateUserInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const createUser = useCreateUser()

  const set = <K extends keyof CreateUserInput>(key: K, value: CreateUserInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setForm(EMPTY)
      setError(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    createUser.mutate(form, {
      onSuccess: (user) => {
        toast.success(`Usuário ${user.name} criado`)
        handleOpenChange(false)
      },
      onError: (err) => setError(err.message),
    })
  }

  const canSubmit = form.name.trim() && form.email.trim() && form.password.length >= 8

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus /> Novo usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
          <DialogDescription>A pessoa entra com o e-mail e a senha definidos aqui.</DialogDescription>
        </DialogHeader>

        <form id="create-user-form" onSubmit={handleSubmit} className="grid gap-4" noValidate>
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="user-name">Nome</Label>
            <Input
              id="user-name"
              value={form.name}
              maxLength={120}
              onChange={(e) => set('name', e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-email">E-mail</Label>
            <Input
              id="user-email"
              type="email"
              autoComplete="off"
              placeholder="nome@empresa.com"
              value={form.email}
              maxLength={180}
              onChange={(e) => set('email', e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-password">Senha inicial</Label>
            <Input
              id="user-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              minLength={8}
              maxLength={72}
              onChange={(e) => set('password', e.target.value)}
              aria-describedby="user-password-hint"
              required
            />
            <p id="user-password-hint" className="text-xs text-muted-foreground">
              Mínimo de 8 caracteres.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-role">Papel</Label>
            <Select value={form.role} onValueChange={(value) => set('role', value as UserRole)}>
              <SelectTrigger id="user-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABEL) as UserRole[]).map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABEL[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{ROLE_HINT[form.role]}</p>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="create-user-form" disabled={!canSubmit || createUser.isPending}>
            {createUser.isPending ? <Loader2 className="animate-spin" /> : <UserPlus />}
            Criar usuário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
