import styles from './Skeleton.module.css'

export type SkeletonVariant = 'landing' | 'grid' | 'list' | 'detail'

// Grey shapes of the page while the products load, so nothing jumps around
// when the data arrives. The shimmer stops for visitors who prefer less motion.
export function Skeleton({ variant }: { variant: SkeletonVariant }) {
  return (
    <div className={styles.skeleton} role="status">
      <span className="visually-hidden">Loading products…</span>
      <div aria-hidden="true">
        {variant === 'landing' && <LandingShape />}
        {variant === 'grid' && <GridShape />}
        {variant === 'list' && <ListShape />}
        {variant === 'detail' && <DetailShape />}
      </div>
    </div>
  )
}

function Block({ className }: { className: string }) {
  return <div className={`${styles.block} ${className}`} />
}

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      {Array.from({ length: 8 }, (_, i) => (
        <Block key={i} className={styles.line} />
      ))}
    </div>
  )
}

function LandingShape() {
  return (
    <div className={styles.landing}>
      <Block className={styles.titleCentered} />
      <div className={styles.threeTiles}>
        {Array.from({ length: 3 }, (_, i) => (
          <Block key={i} className={styles.square} />
        ))}
      </div>
    </div>
  )
}

function GridShape() {
  return (
    <>
      <Block className={styles.banner} />
      <div className={styles.withSidebar}>
        <Sidebar />
        <div className={styles.cards}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={styles.card}>
              <Block className={styles.square} />
              <Block className={styles.line} />
              <Block className={styles.shortLine} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ListShape() {
  return (
    <>
      <Block className={styles.title} />
      <div className={styles.withSidebar}>
        <Sidebar />
        <div className={styles.rows}>
          <Block className={styles.searchBar} />
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={styles.row}>
              <Block className={styles.thumb} />
              <div className={styles.rowText}>
                <Block className={styles.line} />
                <Block className={styles.shortLine} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function DetailShape() {
  return (
    <>
      <Block className={styles.bar} />
      <div className={styles.detail}>
        <Block className={styles.square} />
        <div className={styles.detailText}>
          <Block className={styles.title} />
          <Block className={styles.shortLine} />
          <Block className={styles.price} />
          {Array.from({ length: 4 }, (_, i) => (
            <Block key={i} className={styles.line} />
          ))}
        </div>
      </div>
    </>
  )
}
