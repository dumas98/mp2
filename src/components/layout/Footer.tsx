import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.logo}>corner</span>
        <span>
          Product data from{' '}
          <a href="https://dummyjson.com" target="_blank" rel="noreferrer" className={styles.external}>
            DummyJSON
          </a>
        </span>
        <span>CS 409 · MP2</span>
      </div>
    </footer>
  )
}
