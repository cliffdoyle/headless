// src/pages/Home/Home.js
import { useState, useEffect } from 'react';
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
      <title>Lanfintech - Financial Technology Insights & Innovation</title>
      <meta name="description" content="Discover cutting-edge financial technology insights, innovations, and expert analysis from industry leaders and innovators." />

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.brandName}>Lanfintech</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Discover insights across lifestyle, health, finance, and technology - where diverse topics converge for modern living
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{allPosts.length}</span>
                <span className={styles.statLabel}>Diverse Articles</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4</span>
                <span className={styles.statLabel}>Core Topics</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>∞</span>
                <span className={styles.statLabel}>Possibilities</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className={styles.homeLayout}>
          <main className={styles.mainContent}>
            <div className={styles.searchSection}>
              <SearchBar onSearch={handleSearch} />
            </div>

            <section className={styles.postsSection}>
              <h2 className={styles.sectionTitle}>Latest Fintech Insights</h2>
              {filteredPosts.length > 0 ? (
                <div className={styles.postsGrid}>
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <p>No blog posts found matching your search.</p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleSearch('')}
                  >
                    Show All Posts
                  </button>
                </div>
              )}
            </section>
          </main>

          <aside className={styles.sidebar}>
            {adminData && <AdminInfo admin={adminData} />}
          </aside>
        </div>
      </div>
    </>
  );
};

export default Home;