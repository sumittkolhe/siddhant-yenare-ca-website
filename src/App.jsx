import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ScrollProgress from './components/layout/ScrollProgress'
import { useTracking } from './hooks/useTracking'

const HomePage = lazy(() => import('./pages/HomePage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  useTracking();
  return (
    <>
      <ScrollProgress />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
