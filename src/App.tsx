import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { OwnerProtectedRoute, ProtectedRoute } from './components/ProtectedRoute'
import { DashboardShell } from './layouts/DashboardShell'
import { Layout } from './layouts/Layout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ServicesPage } from './pages/ServicesPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ContactPage } from './pages/ContactPage'
import { BookPage } from './pages/BookPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { CustomerDashboardPage } from './pages/CustomerDashboardPage'
import { OwnerSignInPage } from './pages/OwnerSignInPage'
import { OwnerDashboardPage } from './pages/OwnerDashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/price-list" element={<Navigate to="/services" replace />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>
      <Route path="/owner/sign-in" element={<OwnerSignInPage />} />
      <Route path="/owner" element={<Navigate to="/404" replace />} />
      <Route
        path="/owner/dashboard"
        element={
          <OwnerProtectedRoute>
            <DashboardShell>
              <ErrorBoundary title="Owner dashboard error">
                <OwnerDashboardPage />
              </ErrorBoundary>
            </DashboardShell>
          </OwnerProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
