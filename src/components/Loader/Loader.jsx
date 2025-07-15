import styles from './Loader.module.css';

const Loader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.spinner}></div>
    <p className={styles.loadingText}>Loading...</p>
  </div>
);

export default Loader;