import styles from './Stars.module.css'

type StarFill = 'full' | 'half' | 'empty'

// Rounds to the nearest half star: 4.2 -> 4 full stars, 4.3 -> 4 full and a half
function starFills(value: number): StarFill[] {
  const halves = Math.round(value * 2)
  return [1, 2, 3, 4, 5].map((star) => {
    if (halves >= star * 2) return 'full'
    if (halves === star * 2 - 1) return 'half'
    return 'empty'
  })
}

export function Stars({ value, size = 'medium' }: { value: number; size?: 'small' | 'medium' }) {
  return (
    <span className={`${styles.stars} ${size === 'small' ? styles.small : ''}`}>
      <span aria-hidden="true">
        {starFills(value).map((fill, index) => (
          <span key={index} className={styles[fill]}>
            ★
          </span>
        ))}
      </span>
      <span className="visually-hidden">Rated {Number(value.toFixed(1))} out of 5</span>
    </span>
  )
}
