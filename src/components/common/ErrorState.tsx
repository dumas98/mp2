import styles from './State.module.css'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry: () => void
}

export function ErrorState({
  title = "We couldn't load the store",
  message = 'Check your internet connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.state} role="alert">
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  )
}
