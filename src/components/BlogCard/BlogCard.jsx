import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import styles from './BlogCard.module.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&crop=center';

const BlogCard = ({ post }) => {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || FALLBACK_IMAGE;
  const authorName = post._embedded?.author?.[0]?.name || 'Anonymous';
  const excerpt = post.excerpt.rendered;
  
  // Calculate read time (rough estimate)
  const wordCount = post.content.rendered.replace(/<[^>]*>/g, '').split(' ').length;
  const readTime = Math.ceil(wordCount / 200);
  
  // Format date
  const postDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link to={`/post/${post.slug}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div style={{ overflow: 'hidden' }}>
          <img 
            src={imageUrl} 
            alt={post.title.rendered} 
            className={styles.cardImage}
            loading="lazy"
          />
        </div>
        <div className={styles.cardContent}>
          <h2 className={styles.cardTitle}>
            {parse(post.title.rendered)}
          </h2>
          <div className={styles.cardExcerpt}>
            {parse(excerpt)}
          </div>
          <div className={styles.cardFooter}>
            <div>
              <p className={styles.cardAuthor}>By {authorName}</p>
              <p className={styles.cardDate}>{postDate}</p>
            </div>
            <span className={styles.readTime}>
              {readTime} min read
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
