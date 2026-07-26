import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Rightbar from './components/Rightbar';
import PostCreateModal from './components/PostCreateModal';
import CommunityModal from './components/CommunityModal';
import AuthModal from './components/AuthModal';
import CommunityChat from './components/CommunityChat';

import HomePage from './pages/HomePage';
import SubredditPage from './pages/SubredditPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import { CheckCircle2 } from 'lucide-react';

function ToastContainer() {
  const { toastMessage } = useAuth();
  if (!toastMessage) return null;
  return (
    <div className="toast-container">
      <div className="toast">
        <CheckCircle2 size={18} color="var(--reddit-orange)" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PostProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />

              <div className="main-layout">
                <Sidebar />

                <main style={{ minWidth: 0 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/r/:name" element={<SubredditPage />} />
                    <Route path="/r/:subName/comments/:postId" element={<PostDetailPage />} />
                    <Route path="/user/:username" element={<ProfilePage />} />
                    <Route path="/search" element={<SearchPage />} />
                  </Routes>
                </main>

                <Rightbar />
              </div>

              {/* Modals & Overlays */}
              <PostCreateModal />
              <CommunityModal />
              <AuthModal />
              <CommunityChat />
              <ToastContainer />
            </div>
          </BrowserRouter>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
