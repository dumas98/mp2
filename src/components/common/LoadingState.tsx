import styles from './State.module.css'

// Simple for now; step 6 replaces it with skeleton cards
export function LoadingState({ message = 'Loading products…' }: { message?: string }) {
  return (
    <div className={styles.state} role="status">
      <div className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  )
}
