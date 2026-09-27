import { UsersRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ROLE_LABEL, type UserRole } from '@/features/auth/auth-context'
import { formatDate, initials } from '@/features/vacations/shared/dates'
import { EmptyState } from '@/features/vacations/shared/empty-state'
import { CreateUserDialog } from './create-user-dialog'
import { useUsers } from './queries'

const ROLE_VARIANT: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
  ADMIN: 'default',
  MANAGER: 'secondary',
  EMPLOYEE: 'outline',
}

export function UsersPage() {
  const users = useUsers()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersRound className="size-5" /> Usuários
        </CardTitle>
        <CardDescription>Cadastre colaboradores, gestores e administradores.</CardDescription>
        <CardAction>
          <CreateUserDialog />
        </CardAction>
      </CardHeader>
      <CardContent>
        {users.isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : users.data?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="hidden md:table-cell">Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden sm:flex">
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium">{user.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_VARIANT[user.role]}>{ROLE_LABEL[user.role]}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState icon={UsersRound} title="Nenhum usuário cadastrado" />
        )}
      </CardContent>
    </Card>
  )
}
