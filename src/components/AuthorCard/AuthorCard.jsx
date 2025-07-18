// src/components/AuthorCard/AuthorCard.jsx
import React from 'react';
import { urlFor } from '../../api/sanity';
import styles from './AuthorCard.module.css';

const AuthorCard = ({ author, showFullBio = false }) => {
  if (!author) return null;

  const authorImage = author.image ? urlFor(author.image).width(120).height(120).url() : null;
  
  // Enhanced bio for Vanessa as a top and vibrant author
  const enhancedBio = author.bio || "Hello! I am an article writer who loves to share insights on lifestyle, health, finance, and technology. As a top and vibrant author, I'm passionate about connecting with my readers and sharing valuable perspectives that can make a difference in your daily life. Join me on this journey of discovery and growth!";

  return (
    <div className={styles.authorCard}>
      <div className={styles.authorHeader}>
        <div className={styles.authorImageContainer}>
          {authorImage ? (
            <img 
              src={authorImage} 
              alt={author.name}
              className={styles.authorImage}
            />
          ) : (
            <div className={styles.authorImagePlaceholder}>
              {author.name?.charAt(0) || 'A'}
            </div>
          )}
          <div className={styles.authorBadge}>
            <span>✨ Top Author</span>
          </div>
        </div>
        
        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>{author.name || 'Vanessa Philimore'}</h3>
          <p className={styles.authorTitle}>Vibrant Content Creator & Lifestyle Expert</p>

          {author.social?.linkedin && (
            <div className={styles.socialLinks}>
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className={styles.authorBio}>
        <p className={showFullBio ? styles.fullBio : styles.shortBio}>
          {enhancedBio}
        </p>
        
        <div className={styles.authorStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Articles</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>50K+</span>
            <span className={styles.statLabel}>Readers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>4.9★</span>
            <span className={styles.statLabel}>Rating</span>
          </div>
        </div>
      </div>

      <div className={styles.authorFooter}>
        <div className={styles.expertise}>
          <h4>Expertise Areas</h4>
          <div className={styles.expertiseTags}>
            <span className={styles.tag}>Lifestyle</span>
            <span className={styles.tag}>Health & Wellness</span>
            <span className={styles.tag}>Finance</span>
            <span className={styles.tag}>Technology</span>
          </div>
        </div>
        
        <div className={styles.followCta}>
          <p>💫 <strong>Follow for more insights!</strong></p>
          <p className={styles.ctaSubtext}>Join thousands of readers who trust my content</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
