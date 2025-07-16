import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container">
      <p>
        © {new Date().getFullYear()} Philimore Insights. Where diverse perspectives converge for modern living.
      </p>
    </div>
  </footer>
);

export default Footer;