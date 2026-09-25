import { NavLink } from 'react-router-dom'
import { DEPARTMENTS } from '../../data/departments.ts'
import styles from './DeptNav.module.css'

// NavLink highlights only the current section, so nothing is highlighted
// on the landing page or on product pages.
function linkClass({ isActive }: { isActive: boolean }, extra?: string) {
  return [styles.link, extra, isActive && styles.active].filter(Boolean).join(' ')
}

export function DeptNav() {
  return (
    <nav className={styles.nav} aria-label="Departments">
      <NavLink to="/all" className={(state) => linkClass(state)}>
        Shop all
      </NavLink>
      <NavLink to="/sale" className={(state) => linkClass(state, styles.sale)}>
        Sale
      </NavLink>
      {DEPARTMENTS.map((department) => (
        <NavLink key={department.slug} to={`/d/${department.slug}`} className={(state) => linkClass(state)}>
          {department.name}
        </NavLink>
      ))}
    </nav>
  )
}
