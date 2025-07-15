import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => (
  <header className={styles.header}>
    <div className={`${styles.headerContent} container`}>
      <Link to="/" className={styles.logo}>
        Lanfintech
      </Link>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Insights
        </NavLink>
        <NavLink
          to="/submit"
          className={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Share Insight
        </NavLink>
      </nav>
    </div>
  </header>
);

export default Header;