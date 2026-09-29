import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Router links don't scroll on their own, so a row clicked far down the list
// would open the next page scrolled down. Back / Forward ("POP") is left alone
// so returning to a list lands where the shopper was.
export function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}
