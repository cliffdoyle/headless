import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container">
      <p>
        © {new Date().getFullYear()} Lanfintech. Financial Technology Innovation Platform.
      </p>
    </div>
  </footer>
);

export default Footer;