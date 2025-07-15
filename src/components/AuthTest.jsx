import React, { useState } from 'react';
import { testWordPressConnection } from '../api/wordpress';

const AuthTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const result = await testWordPressConnection();
      setTestResult({
        success: true,
        data: result
      });
    } catch (error) {
      setTestResult({
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
      <h3>WordPress Authentication Test</h3>
      
      <button 
        onClick={runTest} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007cba',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test WordPress Connection'}
      </button>

      {testResult && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          borderRadius: '4px',
          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: testResult.success ? '#155724' : '#721c24'
        }}>
          <h4>{testResult.success ? '✅ Success!' : '❌ Error'}</h4>
          
          {testResult.success ? (
            <div>
              <p><strong>Authenticated as:</strong> {testResult.data.name}</p>
              <p><strong>User ID:</strong> {testResult.data.id}</p>
              <p><strong>Email:</strong> {testResult.data.email || 'Not provided'}</p>
              <p><strong>Roles:</strong> {testResult.data.roles?.join(', ') || 'Not provided'}</p>
              <details>
                <summary>Full Response</summary>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div>
              <p><strong>Error:</strong> {testResult.error}</p>
              {testResult.details && (
                <details>
                  <summary>Error Details</summary>
                  <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(testResult.details, null, 2)}
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

export default AuthTest;
