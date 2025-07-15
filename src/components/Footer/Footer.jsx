import React from 'react'; import styles from './Footer.module.css';
const Footer = () => (<footer className={styles.footer}><div className="container"><p>© {new Date().getFullYear()} ModernBlog. A React & Headless WordPress Project.</p></div></footer>);
export default Footer;