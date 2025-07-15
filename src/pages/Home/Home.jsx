// src/pages/Home/Home.js
import React, { useState, useEffect } from 'react';
import { getPublishedPosts, getAdminData } from '../../api/wordpress';
import BlogCard from '../../components/BlogCard/BlogCard';
import AdminInfo from '../../components/AdminInfo/AdminInfo';
import Loader from '../../components/Loader/Loader';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Home.module.css';

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [posts, admin] = await Promise.all([
          getPublishedPosts(),
          getAdminData(1) // Fetch data for admin user ID 1
        ]);
        setAllPosts(posts);
        setFilteredPosts(posts);
        setAdminData(admin);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPosts(allPosts);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = allPosts.filter(post =>
      post.title.rendered.toLowerCase().includes(lowercasedTerm) ||
      post.excerpt.rendered.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredPosts(filtered);
  };


  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      {/* React 19 native SEO tags */}
      <title>ModernBlog - Stunning User-Submitted Articles</title>
      <meta name="description" content="A stunning and aesthetic blog built with React and a headless WordPress CMS, featuring user submissions." />

      <div className={styles.homeLayout}>
        <div className={styles.mainContent}>
          <SearchBar onSearch={handleSearch} />
          <h1 className={styles.pageTitle}>Published Blogs</h1>
          {filteredPosts.length > 0 ? (
            <div className={styles.postsGrid}>
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p>No blog posts found matching your search.</p>
          )}
        </div>
        <aside className={styles.sidebar}>
          {adminData && <AdminInfo admin={adminData} />}
        </aside>
      </div>
    </>
  );
};

export default Home;