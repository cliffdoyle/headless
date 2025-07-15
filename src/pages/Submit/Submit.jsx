// src/pages/Submit/Submit.js
import React, { useState } from 'react';
import { createPost } from '../../api/wordpress';
import styles from './Submit.module.css';

const Submit = () => {
  const [formData, setFormData] = useState({
    title: '', content: '', author: '', image: null,
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author || !formData.image) {
      setStatus({ ...status, error: 'All fields, including an image, are required.' });
      return;
    }
    
    setStatus({ loading: true, error: null, success: null });
    
    try {
      await createPost(formData);
      setStatus({ loading: false, success: 'Your post has been submitted for review! Thank you.', error: null });
      setFormData({ title: '', content: '', author: '', image: null });
      setImagePreview(null);
      e.target.reset(); // Also reset the form element itself
    } catch (err) {
      console.error("Submission failed:", err);
      setStatus({ loading: false, error: 'There was an error submitting your post. Please check your credentials or contact an admin.', success: null });
    }
  };

  return (
    <>
      {/* React 19 native SEO tags */}
      <title>Submit a Post - ModernBlog</title>

      <div className={styles.submitContainer}>
        <h1>Submit Your Blog Post</h1>
        <p>Share your story with our community. All submissions will be reviewed by an admin before publishing.</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="author">Your Name</label>
            <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="title">Post Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Your Content (HTML is supported)</label>
            <textarea id="content" name="content" value={formData.content} onChange={handleChange} rows="10" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Featured Image</label>
            <input type="file" id="image" name="image" accept="image/png, image/jpeg" onChange={handleFileChange} required />
            {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
          </div>
          
          <button type="submit" disabled={status.loading} className={styles.submitButton}>
            {status.loading ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>

        {status.error && <p className={styles.errorMessage}>{status.error}</p>}
        {status.success && <p className={styles.successMessage}>{status.success}</p>}
      </div>
    </>
  );
};

export default Submit;