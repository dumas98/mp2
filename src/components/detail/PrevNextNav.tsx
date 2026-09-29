import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useArrowKeys } from '../../hooks/useArrowKeys.ts'
import type { ProductNeighbors } from '../../hooks/useProductNeighbors.ts'
import styles from './PrevNextNav.module.css'

// "← Back to results" on the left, "← Previous · 3 of 21 · Next →" on the right.
// Previous / next replace the history entry, so the browser's Back button
// returns to the list instead of stepping through every product viewed.
export function PrevNextNav({ neighbors }: { neighbors: ProductNeighbors }) {
  const { position, total, previous, next, linkState, backTo, backLabel } = neighbors
  const navigate = useNavigate()
  const hasNeighbors = total > 1

  const goTo = useCallback(
    (id: number) => {
      if (hasNeighbors) navigate(`/product/${id}`, { state: linkState, replace: true })
    },
    [hasNeighbors, navigate, linkState],
  )
  useArrowKeys(
    useCallback(() => goTo(previous.id), [goTo, previous.id]),
    useCallback(() => goTo(next.id), [goTo, next.id]),
  )

  return (
    <nav className={styles.bar} aria-label="Product navigation">
      <Link to={backTo} className={styles.back}>
        <span aria-hidden="true">←</span> {backLabel}
      </Link>

      {hasNeighbors && (
        <div className={styles.pager}>
          <Link
            to={`/product/${previous.id}`}
            state={linkState}
            replace
            className={styles.button}
            aria-label={`Previous: ${previous.title}`}
            title={`Previous: ${previous.title}`}
          >
            <span aria-hidden="true">←</span>
            <span className={styles.word}>Previous</span>
          </Link>
          <span className={styles.position}>
            {position} of {total}
          </span>
          <Link
            to={`/product/${next.id}`}
            state={linkState}
            replace
            className={styles.button}
            aria-label={`Next: ${next.title}`}
            title={`Next: ${next.title}`}
          >
            <span className={styles.word}>Next</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </nav>
  )
}
