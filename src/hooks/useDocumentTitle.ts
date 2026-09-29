import { useEffect } from 'react'

const SITE_NAME = 'Corner'

// Sets the browser tab title, e.g. "Rolex Submariner Watch · Corner",
// and puts the plain site name back when the page closes.
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    return () => {
      document.title = SITE_NAME
    }
  }, [title])
}
