import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import { ToastProvider } from './components/Toast'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import NotFound from './pages/NotFound'
import Calculators from './pages/Calculators'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const PlanPage = lazy(() => import('./pages/PlanPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/plan" element={<PlanPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/calculators" element={<Calculators />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
