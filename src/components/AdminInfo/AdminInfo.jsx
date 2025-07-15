import parse from 'html-react-parser';
import styles from './AdminInfo.module.css';

const AdminInfo = ({ admin }) => {
  if (!admin) return null;

  // Fintech-focused default bio if none provided
  const defaultBio = `
    <p>💼 Welcome! I'm a financial technology expert passionate about democratizing access to innovative financial solutions and insights.</p>
    <p>🚀 Through Lanfintech, I share cutting-edge analysis on fintech trends, blockchain innovations, digital banking, and the future of financial services.</p>
    <p>📊 With years of experience in financial technology, I break down complex concepts into actionable insights for professionals and enthusiasts alike.</p>
    <p>🌟 Join me as we explore the intersection of finance and technology, shaping the future of how we manage, invest, and think about money.</p>
  `;

  return (
    <div className={styles.adminBox}>
      <div className={styles.header}>
        <h3 className={styles.title}>Meet the Author</h3>
        <div className={styles.decorativeLine}></div>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.avatarContainer}>
          <img
            src={admin.avatar_urls['96']}
            alt={admin.name}
            className={styles.avatar}
          />
          <div className={styles.avatarBorder}></div>
        </div>

        <h4 className={styles.name}>{admin.name}</h4>
        <p className={styles.role}>Fintech Expert & Analyst</p>
      </div>

      <div className={styles.bio}>
        {parse(admin.description || defaultBio)}
      </div>

      <div className={styles.socialLinks}>
        <div className={styles.socialItem}>
          <span className={styles.socialIcon}>💼</span>
          <span className={styles.socialText}>Fintech Industry Expert</span>
        </div>
        <div className={styles.socialItem}>
          <span className={styles.socialIcon}>📈</span>
          <span className={styles.socialText}>Market Analysis & Insights</span>
        </div>
        <div className={styles.socialItem}>
          <span className={styles.socialIcon}>🚀</span>
          <span className={styles.socialText}>Innovation & Technology</span>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          "The future of finance is being written today."
        </p>
      </div>
    </div>
  );
};

export default AdminInfo;