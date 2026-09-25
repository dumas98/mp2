import { Outlet } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts.ts'
import { ErrorState } from '../common/ErrorState.tsx'
import { LoadingState } from '../common/LoadingState.tsx'
import { DeptNav } from './DeptNav.tsx'
import { Footer } from './Footer.tsx'
import { Header } from './Header.tsx'
import { PromoBanner } from './PromoBanner.tsx'
import styles from './Layout.module.css'

// Shared frame for every page. Pages only render once the products are
// loaded, so none of them needs its own loading or error handling.
export function Layout() {
  const { status, retry } = useProducts()

  return (
    <div className={styles.shell}>
      <PromoBanner />
      <Header>
        <DeptNav />
      </Header>
      <main className={styles.main}>
        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState onRetry={retry} />}
        {status === 'ready' && <Outlet />}
      </main>
      <Footer />
    </div>
  )
}
