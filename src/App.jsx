// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import PostDetail from './pages/PostDetail/PostDetail';
import Submit from './pages/Submit/Submit';
import AuthTest from './components/AuthTest';
import MediaUploadTest from './components/MediaUploadTest';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/test-auth" element={<AuthTest />} />
            <Route path="/test-media" element={<MediaUploadTest />} />
            <Route path="/post/:slug" element={<PostDetail />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;