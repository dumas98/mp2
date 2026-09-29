import { Children, useState, type ReactNode } from 'react'
import styles from './FilterGroup.module.css'

interface FilterGroupProps {
  title: string
  children: ReactNode
  // Show only this many options until "Show all" is clicked
  limit?: number
  // Start with every option visible, e.g. when a hidden one is already checked
  startExpanded?: boolean
}

// Collapsible with no JavaScript (<details>); the fieldset and legend make
// screen readers announce which group each option belongs to.
export function FilterGroup({ title, children, limit, startExpanded = false }: FilterGroupProps) {
  const [showAll, setShowAll] = useState(startExpanded)
  const options = Children.toArray(children)
  const canCollapse = limit !== undefined && options.length > limit
  const visible = canCollapse && !showAll ? options.slice(0, limit) : options

  return (
    <details className={styles.group} open>
      <summary className={styles.summary}>{title}</summary>
      <fieldset className={styles.fieldset}>
        <legend className="visually-hidden">{title}</legend>
        {visible}
        {canCollapse && (
          <button type="button" className={styles.more} onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show fewer' : `Show all (${options.length})`}
          </button>
        )}
      </fieldset>
    </details>
  )
}
