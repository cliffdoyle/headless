// src/pages/Submit/Submit.js
import { useState, useEffect } from 'react';
import { createPost } from '../../api/wordpress';
import { testConnection, testAuthConnection, testPostCreation, testMediaUpload, testUserPermissions } from '../../utils/testConnection';
import styles from './Submit.module.css';

const Submit = () => {
  const [formData, setFormData] = useState({
    title: '', content: '', author: '', image: null,
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [testResults, setTestResults] = useState(null);

  // Apply light theme to body when component mounts
  useEffect(() => {
    document.body.classList.add('light-theme');

    // Cleanup: remove light theme when component unmounts
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

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

  const runConnectionTests = async () => {
    setTestResults('Running tests...');
    console.log('=== WordPress Connection Tests ===');

    const test1 = await testConnection();
    const test2 = await testAuthConnection();
    const test3 = await testPostCreation();
    const test4 = await testMediaUpload();
    const test5 = await testUserPermissions();

    const results = {
      basicConnection: test1,
      authentication: test2,
      postCreation: test3,
      mediaUpload: test4,
      userPermissions: test5
    };

    setTestResults(results);
    console.log('=== Test Results ===', results);
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
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      let errorMessage = 'There was an error submitting your post. ';

      if (err.response?.status === 401) {
        errorMessage += 'Authentication failed. Please check your credentials.';
      } else if (err.response?.status === 403) {
        errorMessage += 'Permission denied. Your user account may not have the required permissions.';
      } else if (err.response?.data?.message) {
        errorMessage += `Server error: ${err.response.data.message}`;
      } else if (err.message) {
        errorMessage += `Error: ${err.message}`;
      } else {
        errorMessage += 'Please check your credentials or contact an admin.';
      }

      setStatus({ loading: false, error: errorMessage, success: null });
    }
  };

  return (
    <>
      {/* React 19 native SEO tags */}
      <title>Submit a Post - Lanfintech</title>

      <div className={styles.submitContainer}>
        <h1>✨ Submit Your Blog Post</h1>
        <p>Share your story with our community. All submissions will be reviewed by an admin before publishing.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="author">👤 Your Name</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">📝 Post Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your post"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">✍️ Your Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="12"
              placeholder="Write your amazing content here... HTML is supported for formatting!"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">🖼️ Featured Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              required
            />
            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                <p className={styles.imagePreviewLabel}>Preview of your featured image</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={status.loading} className={styles.submitButton}>
            {status.loading ? (
              <>
                <span className={styles.spinner}></span>
                Submitting...
              </>
            ) : (
              <>
                🚀 Submit for Review
              </>
            )}
          </button>
        </form>

        {status.error && <p className={styles.errorMessage}>{status.error}</p>}
        {status.success && <p className={styles.successMessage}>{status.success}</p>}

        {/* Debug Section */}
        <div className={styles.debugSection}>
          <h3>🔧 Debug WordPress Connection</h3>
          <button
            type="button"
            onClick={runConnectionTests}
            className={styles.testButton}
          >
            Test WordPress Connection
          </button>

          {testResults && (
            <div className={styles.testResults}>
              <h4>Test Results:</h4>
              {typeof testResults === 'string' ? (
                <p>{testResults}</p>
              ) : (
                <div>
                  <p>✅ Basic Connection: {testResults.basicConnection?.success ? 'SUCCESS' : 'FAILED'}</p>
                  <p>🔐 Authentication: {testResults.authentication?.success ? 'SUCCESS' : 'FAILED'}</p>
                  <p>📝 Post Creation: {testResults.postCreation?.success ? 'SUCCESS' : 'FAILED'}</p>
                  <p>📁 Media Upload: {testResults.mediaUpload?.success ? 'SUCCESS' : 'FAILED'}</p>
                  <p>👤 User Permissions: {testResults.userPermissions?.success ? 'SUCCESS' : 'FAILED'}</p>

                  {!testResults.basicConnection?.success && (
                    <p className={styles.errorDetail}>Basic Error: {testResults.basicConnection?.error}</p>
                  )}
                  {!testResults.authentication?.success && (
                    <p className={styles.errorDetail}>Auth Error: {JSON.stringify(testResults.authentication?.error)}</p>
                  )}
                  {!testResults.postCreation?.success && (
                    <p className={styles.errorDetail}>Post Error: {JSON.stringify(testResults.postCreation?.error)}</p>
                  )}
                  {!testResults.mediaUpload?.success && (
                    <p className={styles.errorDetail}>Media Error: {JSON.stringify(testResults.mediaUpload?.error)}</p>
                  )}
                  {!testResults.userPermissions?.success && (
                    <p className={styles.errorDetail}>Permissions Error: {JSON.stringify(testResults.userPermissions?.error)}</p>
                  )}
                  {testResults.userPermissions?.success && (
                    <div className={styles.permissionsDetail}>
                      <p><strong>User:</strong> {testResults.userPermissions.user?.username}</p>
                      <p><strong>Can upload files:</strong> {testResults.userPermissions.user?.capabilities?.upload_files ? 'YES' : 'NO'}</p>
                      <p><strong>Can edit posts:</strong> {testResults.userPermissions.user?.capabilities?.edit_posts ? 'YES' : 'NO'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Submit;