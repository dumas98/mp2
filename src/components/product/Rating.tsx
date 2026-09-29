import styles from './Rating.module.css'

export function Rating({ value }: { value: number }) {
  const rounded = value.toFixed(1)
  return (
    <span className={styles.rating}>
      <span aria-hidden="true">
        <span className={styles.star}>★</span> {rounded}
      </span>
      <span className="visually-hidden">Rated {rounded} out of 5</span>
    </span>
  )
}
