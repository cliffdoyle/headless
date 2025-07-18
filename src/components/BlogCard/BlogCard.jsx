import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { urlFor } from '../../api/sanity';
import styles from './BlogCard.module.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&crop=center';

const BlogCard = ({ post }) => {
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(400).height(250).url() : FALLBACK_IMAGE;
  const authorName = post.author?.name || 'Anonymous';
  const excerpt = post.excerpt || '';

  // Calculate read time (rough estimate)
  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(' ').length : 0;
  const readTime = Math.ceil(wordCount / 200) || 1;

  // Format date
  const postDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link to={`/post/${post.slug?.current || post.slug}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div style={{ overflow: 'hidden' }}>
          <img
            src={imageUrl}
            alt={post.title}
            className={styles.cardImage}
            loading="lazy"
          />
        </div>
        <div className={styles.cardContent}>
          <h2 className={styles.cardTitle}>
            {post.title}
          </h2>
          <div className={styles.cardExcerpt}>
            {excerpt && parse(excerpt)}
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
