import styles from './ResultCount.module.css'

// role="status" makes screen readers announce the new count while typing
export function ResultCount({ count, query }: { count: number; query: string }) {
  const trimmed = query.trim()
  const noun = trimmed ? (count === 1 ? 'result' : 'results') : count === 1 ? 'product' : 'products'

  return (
    <p className={styles.count} role="status">
      <strong className={styles.number}>{count}</strong> {noun}
      {trimmed && <> for “{trimmed}”</>}
    </p>
  )
}
