import { useId } from 'react'
import { useFilterParams } from '../../hooks/useFilterParams.ts'
import { isSortKey, SORT_KEYS, SORT_OPTIONS } from '../../lib/sorting.ts'
import styles from './SortControls.module.css'

// "Sort by" dropdown plus a button that flips ascending / descending.
// The button spells the direction out so both orders are obvious.
export function SortControls() {
  const { sort, order, setSort, toggleOrder } = useFilterParams()
  const selectId = useId()
  const option = SORT_OPTIONS[sort]

  return (
    <div className={styles.controls}>
      <label htmlFor={selectId} className={styles.label}>
        Sort by
      </label>
      <select
        id={selectId}
        className={styles.select}
        value={sort}
        onChange={(event) => {
          if (isSortKey(event.target.value)) setSort(event.target.value)
        }}
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {SORT_OPTIONS[key].label}
          </option>
        ))}
      </select>
      <button type="button" className={styles.order} onClick={toggleOrder}>
        <span aria-hidden="true">{order === 'asc' ? '↑' : '↓'}</span>
        {order === 'asc' ? 'Ascending' : 'Descending'}
        <span className={styles.hint}>· {order === 'asc' ? option.asc : option.desc}</span>
      </button>
    </div>
  )
}
