// src/pages/Home/Home.js
import { useState, useEffect } from 'react';
import { getPublishedPosts, getAdminData, testSanityAPI } from '../../api/sanity';
import BlogCard from '../../components/BlogCard/BlogCard';
import AuthorCard from '../../components/AuthorCard/AuthorCard';
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
        setError(null);

        // First test the Sanity API connectivity
        console.log('Testing Sanity API connectivity...');
        const apiTest = await testSanityAPI();
        console.log('API Test Result:', apiTest);

        if (!apiTest.success) {
          throw new Error(`Sanity API is not accessible: ${apiTest.error}`);
        }

        console.log('Sanity API is working, fetching data...');
        const [posts, admin] = await Promise.all([
          getPublishedPosts(),
          getAdminData(1) // Fetch data for admin user ID 1
        ]);

        console.log('Fetched posts:', posts.length);
        console.log('Fetched admin data:', admin ? 'Success' : 'Failed');

        setAllPosts(posts);
        setFilteredPosts(posts);
        setAdminData(admin);
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch data. Please try again later.';
        setError(errorMessage);
        console.error('Fetch data error:', err);
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
      post.title.toLowerCase().includes(lowercasedTerm) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(lowercasedTerm))
    );
    setFilteredPosts(filtered);
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className={styles.errorContainer}>
      <p className={styles.error}>{error}</p>
      <button
        className="btn btn-primary"
        onClick={() => window.location.reload()}
        style={{ marginTop: '1rem' }}
      >
        Retry Loading
      </button>
    </div>
  );

  return (
    <>
      {/* React 19 native SEO tags */}
      <title>Phil - Insights | Lifestyle, Health, Finance & Technology</title>
      <meta name="description" content="Discover insights across lifestyle, health, finance, and technology - where diverse perspectives converge for modern living." />

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.brandName}>Phil - Insights</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Discover insights across lifestyle, health, finance, and technology - where diverse perspectives converge for modern living
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
              <h2 className={styles.sectionTitle}>Latest Articles</h2>
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
            {adminData && <AuthorCard author={adminData} showFullBio={true} />}
          </aside>
        </div>
      </div>
    </>
  );
};

export default Home;