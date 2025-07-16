// src/pages/PostDetail/PostDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { getPostBySlug } from '../../api/wordpress';
import Loader from '../../components/Loader/Loader';
import styles from './PostDetail.module.css';

const FALLBACK_IMAGE = 'https://via.placeholder.com/1200x500/f2f2f7/3a3a3c?text=ModernBlog';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await getPostBySlug(slug);
        if (postData) {
          setPost(postData);
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        setError('Failed to fetch the post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);
  
  // Helper function to strip HTML for the meta description
  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!post) return null;

  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || FALLBACK_IMAGE;
  const authorName = post._embedded?.author?.[0]?.name || 'Anonymous';
  const postDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  
  const postTitle = parse(post.title.rendered).toString();
  const metaDescription = stripHtml(post.excerpt.rendered).substring(0, 160);

  return (
    <>
      {/* React 19 native SEO tags */}
      <title>{`${postTitle} - Philimore Insights`}</title>
      <meta name="description" content={metaDescription} />

      <article className={styles.post}>
        <h1 className={styles.postTitle}>{parse(post.title.rendered)}</h1>
        <div className={styles.postMeta}>
          <span>By {authorName}</span>
          <span>•</span>
          <span>{postDate}</span>
        </div>
        <img src={imageUrl} alt={postTitle} className={styles.featuredImage} />
        <div className={styles.postContent}>
          {parse(post.content.rendered)}
        </div>
      </article>
    </>
  );
};

export default PostDetail;