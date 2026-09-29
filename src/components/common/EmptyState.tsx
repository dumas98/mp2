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
  // 2 when the page already has its own h1, e.g. "No results" on the list page
  headingLevel?: 1 | 2
}

export function EmptyState({ title, message, actions = [], headingLevel = 1 }: EmptyStateProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h1'

  return (
    <div className={styles.state}>
      <Heading className={styles.title}>{title}</Heading>
      {message && <p className={styles.message}>{message}</p>}
      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <Link
              key={action.label}
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
