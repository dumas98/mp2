import { useEffect } from 'react'

// Runs onLeft / onRight for the ← and → keys, except while the shopper is
// typing in a field, holding a modifier key, or another handler used the key.
export function useArrowKeys(onLeft: () => void, onRight: () => void) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      if (event.key === 'ArrowLeft') onLeft()
      else if (event.key === 'ArrowRight') onRight()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onLeft, onRight])
}
