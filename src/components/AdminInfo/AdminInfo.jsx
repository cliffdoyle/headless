import parse from 'html-react-parser';
import { urlFor } from '../../api/sanity';
import styles from './AdminInfo.module.css';

const AdminInfo = ({ admin }) => {
  if (!admin) return null;

  // Multi-topic focused default bio if none provided
  const defaultBio = `
    <p>🌟 Welcome! I'm a content creator passionate about exploring the diverse aspects of modern life through lifestyle, health, finance, and technology.</p>
    <p>💡 Through Lanfintech, I share insights across multiple domains - from wellness and lifestyle optimization to financial strategies and cutting-edge technology trends.</p>
    <p>📚 With expertise spanning health & wellness, financial planning, tech innovations, and lifestyle enhancement, I break down complex topics into actionable insights.</p>
    <p>🚀 Join me as we explore how lifestyle, health, finance, and technology interconnect to shape our daily lives and future possibilities.</p>
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
            src={admin.image ? urlFor(admin.image).width(96).height(96).url() : 'https://via.placeholder.com/96x96/f2f2f7/3a3a3c?text=Author'}
            alt={admin.name}
            className={styles.avatar}
          />
          <div className={styles.avatarBorder}></div>
        </div>

        <h4 className={styles.name}>{admin.name}</h4>
        <p className={styles.role}>Lifestyle • Health • Finance • Technology</p>
      </div>

      <div className={styles.bio}>
        {parse(admin.bio || defaultBio)}
      </div>

      <div className={styles.socialLinks}>
        <div className={styles.socialItem}>
          <span className={styles.socialIcon}>🌱</span>
          <span className={styles.socialText}>Health & Wellness</span>
        </div>
        <div className={styles.socialItem}>
          <span className={styles.socialIcon}>💰</span>
          <span className={styles.socialText}>Finance & Investment</span>
        </div>
        <div className={styles.socialItem}>
          <span className={styles.socialIcon}>🚀</span>
          <span className={styles.socialText}>Technology & Innovation</span>
        </div>
        <div className={styles.socialItem}>
          <span className={styles.socialIcon}>✨</span>
          <span className={styles.socialText}>Lifestyle & Optimization</span>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          "Exploring life's interconnected dimensions - one insight at a time."
        </p>
      </div>
    </div>
  );
};

export default AdminInfo;