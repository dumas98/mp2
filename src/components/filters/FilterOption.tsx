import styles from './FilterOption.module.css'

interface FilterOptionProps {
  type: 'checkbox' | 'radio'
  name: string
  label: string
  // Results this option would give; 0 dims it (still clickable)
  count: number
  checked: boolean
  onChange: () => void
}

export function FilterOption({ type, name, label, count, checked, onChange }: FilterOptionProps) {
  const dimmed = count === 0 && !checked

  return (
    <label className={`${styles.option} ${dimmed ? styles.dimmed : ''}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} />
      <span className={styles.label}>{label}</span>
      <span className={styles.count}>{count}</span>
    </label>
  )
}
