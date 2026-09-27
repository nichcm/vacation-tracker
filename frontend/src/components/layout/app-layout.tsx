import { CalendarDays, CalendarPlus, ClipboardCheck, Loader2, LogOut, Palmtree } from 'lucide-react'
import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/auth-context'
import { usePendingVacations } from '@/features/vacations/approvals/queries'
import { initials } from '@/features/vacations/shared/dates'
import { cn } from '@/lib/utils'

const ROLE_LABEL = { EMPLOYEE: 'Colaborador', MANAGER: 'Gestor' } as const

export function AppLayout() {
  const { user, logout } = useAuth()
  const isManager = user?.role === 'MANAGER'
  const pending = usePendingVacations(isManager)
  const pendingCount = pending.data?.length ?? 0

  const links = [
    { to: '/ferias/mes', label: 'Quem está de férias', icon: CalendarDays },
    { to: '/ferias/solicitar', label: 'Solicitar férias', icon: CalendarPlus },
    ...(isManager ? [{ to: '/ferias/aprovacoes', label: 'Aprovações', icon: ClipboardCheck }] : []),
  ]

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <NavLink to="/ferias/mes" className="flex items-center gap-2 font-semibold" aria-label="Controle de Férias">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Palmtree className="size-4" />
            </span>
            <span className="hidden sm:inline">Controle de Férias</span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {links.map((link) => (
              <NavItem key={link.to} {...link} badge={link.to === '/ferias/aprovacoes' ? pendingCount : 0} />
            ))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-auto h-9 gap-2 px-2" aria-label="Menu do usuário">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">{initials(user?.name ?? '')}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm sm:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="font-medium text-foreground">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
                <div className="text-xs text-muted-foreground">{user && ROLE_LABEL[user.role]}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout}>
                <LogOut /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navegação compacta para telas pequenas */}
        <nav className="flex gap-1 border-t px-2 py-1 md:hidden" aria-label="Principal">
          {links.map((link) => (
            <NavItem key={link.to} {...link} compact badge={link.to === '/ferias/aprovacoes' ? pendingCount : 0} />
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Suspense
          fallback={
            <div className="flex justify-center py-20 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" aria-label="Carregando" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

type NavItemProps = {
  to: string
  label: string
  icon: typeof CalendarDays
  badge?: number
  compact?: boolean
}

function NavItem({ to, label, icon: Icon, badge = 0, compact }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
          isActive && 'bg-muted text-foreground',
          compact && 'flex-1 flex-col gap-0.5 px-1 text-[11px]',
        )
      }
    >
      <span className="relative">
        <Icon className="size-4" />
        {compact && badge > 0 && (
          <span className="absolute -top-1 -right-2 size-2 rounded-full bg-destructive" aria-hidden />
        )}
      </span>
      <span className="text-center">{label}</span>
      {!compact && badge > 0 && (
        <Badge variant="destructive" className="h-4 min-w-4 px-1 tabular-nums">
          {badge}
        </Badge>
      )}
    </NavLink>
  )
}
