import React, { useState } from 'react';
import axios from 'axios';

const MediaUploadTest = () => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_WORDPRESS_URL;
  const USERNAME = import.meta.env.VITE_WORDPRESS_USERNAME;
  const PASSWORD = import.meta.env.VITE_WORDPRESS_APP_PASSWORD;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadResult(null);
  };

  const testUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    setUploadResult(null);

    try {
      // Create the API instance for media upload
      const mediaApi = axios.create({
        baseURL: `${BASE_URL}/wp-json/wp/v2`,
        headers: {
          'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
          'Content-Type': file.type,
          'Content-Disposition': `attachment; filename=${file.name}`,
        },
      });

      console.log('Uploading file:', file.name, 'Type:', file.type);
      console.log('Auth header:', `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`);

      const response = await mediaApi.post('/media', file);
      
      setUploadResult({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadResult({
        success: false,
        error: error.message,
        details: error.response?.data || error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Media Upload Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginBottom: '10px' }}
        />
        {file && (
          <p>Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
        )}
      </div>

      <button 
        onClick={testUpload} 
        disabled={loading || !file}
        style={{
          padding: '10px 20px',
          backgroundColor: loading || !file ? '#ccc' : '#007cba',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading || !file ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Uploading...' : 'Test Media Upload'}
      </button>

      {uploadResult && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          borderRadius: '4px',
          backgroundColor: uploadResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${uploadResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: uploadResult.success ? '#155724' : '#721c24'
        }}>
          <h4>{uploadResult.success ? '✅ Upload Success!' : '❌ Upload Failed'}</h4>
          
          {uploadResult.success ? (
            <div>
              <p><strong>Media ID:</strong> {uploadResult.data.id}</p>
              <p><strong>Title:</strong> {uploadResult.data.title?.rendered}</p>
              <p><strong>URL:</strong> <a href={uploadResult.data.source_url} target="_blank" rel="noopener noreferrer">{uploadResult.data.source_url}</a></p>
              <p><strong>Alt Text:</strong> {uploadResult.data.alt_text || 'None'}</p>
              {uploadResult.data.source_url && (
                <img 
                  src={uploadResult.data.source_url} 
                  alt="Uploaded" 
                  style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
                />
              )}
              <details style={{ marginTop: '10px' }}>
                <summary>Full Response</summary>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(uploadResult.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div>
              <p><strong>Error:</strong> {uploadResult.error}</p>
              {uploadResult.details && (
                <details>
                  <summary>Error Details</summary>
                  <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(uploadResult.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploadTest;
