import { useRef, type MouseEvent } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts.ts'
import { ErrorState } from '../common/ErrorState.tsx'
import { FallbackNotice } from '../common/FallbackNotice.tsx'
import { Skeleton, type SkeletonVariant } from '../common/Skeleton.tsx'
import { DeptNav } from './DeptNav.tsx'
import { Footer } from './Footer.tsx'
import { Header } from './Header.tsx'
import { PromoBanner } from './PromoBanner.tsx'
import { ScrollToTop } from './ScrollToTop.tsx'
import styles from './Layout.module.css'

// The loading placeholder that matches the page being opened
function skeletonFor(pathname: string): SkeletonVariant {
  if (pathname.startsWith('/product/')) return 'detail'
  if (pathname.startsWith('/all')) return 'list'
  if (pathname.startsWith('/d/') || pathname.startsWith('/sale')) return 'grid'
  return 'landing'
}

// Shared frame for every page. Pages only render once the products are
// loaded, so none of them needs its own loading or error handling.
export function Layout() {
  const { status, usedFallback, retry } = useProducts()
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  // Moves keyboard focus past the banner, search and nav. preventDefault keeps
  // "#main" out of the URL, which would add a history entry without the
  // list data previous / next rely on.
  function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    mainRef.current?.focus()
  }

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skip} onClick={skipToContent}>
        Skip to content
      </a>
      <ScrollToTop />
      <PromoBanner />
      <Header>
        <DeptNav />
      </Header>
      {status === 'ready' && usedFallback && <FallbackNotice onRetry={retry} />}
      <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
        {status === 'loading' && <Skeleton variant={skeletonFor(pathname)} />}
        {status === 'error' && <ErrorState onRetry={retry} />}
        {status === 'ready' && <Outlet />}
      </main>
      <Footer />
    </div>
  )
}
