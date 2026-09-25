import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout.tsx'
import { DepartmentPage } from './pages/DepartmentPage.tsx'
import { DetailPage } from './pages/DetailPage.tsx'
import { LandingPage } from './pages/LandingPage.tsx'
import { ListPage } from './pages/ListPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="all" element={<ListPage />} />
        <Route path="sale" element={<DepartmentPage mode="sale" />} />
        <Route path="d/:dept" element={<DepartmentPage mode="department" />} />
        <Route path="product/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
