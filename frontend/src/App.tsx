import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { LoginPage } from '@/features/auth/login-page'
import { APPROVER_ROLES } from '@/features/auth/auth-context'
import { ProtectedRoute } from '@/features/auth/protected-route'

// Páginas carregadas sob demanda (o calendário e o date-fns pesam no bundle inicial)
const MonthlyVacationsPage = lazy(() =>
  import('@/features/vacations/monthly/monthly-vacations-page').then((m) => ({ default: m.MonthlyVacationsPage })),
)
const RequestVacationPage = lazy(() =>
  import('@/features/vacations/request/request-vacation-page').then((m) => ({ default: m.RequestVacationPage })),
)
const ApprovalsPage = lazy(() =>
  import('@/features/vacations/approvals/approvals-page').then((m) => ({ default: m.ApprovalsPage })),
)
const UsersPage = lazy(() => import('@/features/users/users-page').then((m) => ({ default: m.UsersPage })))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/ferias/mes" element={<MonthlyVacationsPage />} />
            <Route path="/ferias/solicitar" element={<RequestVacationPage />} />
            <Route element={<ProtectedRoute roles={APPROVER_ROLES} />}>
              <Route path="/ferias/aprovacoes" element={<ApprovalsPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/usuarios" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/ferias/mes" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
