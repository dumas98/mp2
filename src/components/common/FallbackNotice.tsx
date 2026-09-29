import styles from './FallbackNotice.module.css'

// Shown only when the live API failed and the saved copy of the data is in use
export function FallbackNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.notice} role="status">
      <p>
        You're seeing saved product data because the live store couldn't be reached.{' '}
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      </p>
    </div>
  )
}
