import { Link } from 'react-router-dom'
import styles from './State.module.css'

export interface EmptyStateAction {
  label: string
  to: string
}

interface EmptyStateProps {
  title: string
  message?: string
  // The first action is the main (black) button, the rest are outlined
  actions?: EmptyStateAction[]
}

export function EmptyState({ title, message, actions = [] }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <h1 className={styles.title}>{title}</h1>
      {message && <p className={styles.message}>{message}</p>}
      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <Link
              key={action.to}
              to={action.to}
              className={index === 0 ? styles.button : styles.buttonSecondary}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
