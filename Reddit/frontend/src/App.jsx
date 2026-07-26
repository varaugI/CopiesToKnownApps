import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Rightbar from './components/Rightbar';
import PostCreateModal from './components/PostCreateModal';
import CommunityModal from './components/CommunityModal';
import AuthModal from './components/AuthModal';
import CommunityChat from './components/CommunityChat';
import { CheckCircle2, Loader2 } from 'lucide-react';

const HomePage = lazy(() => import('./pages/HomePage'));
const SubredditPage = lazy(() => import('./pages/SubredditPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
      <Loader2 size={32} className="spin" />
    </div>
  );
}

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
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <PostProvider>
            <BrowserRouter>
              <div className="app-container">
                <Navbar />

                <div className="main-layout">
                  <Sidebar />

                  <main style={{ minWidth: 0 }}>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/r/:name" element={<SubredditPage />} />
                        <Route path="/r/:subName/comments/:postId" element={<PostDetailPage />} />
                        <Route path="/user/:username" element={<ProfilePage />} />
                        <Route path="/search" element={<SearchPage />} />
                      </Routes>
                    </Suspense>
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
    </ErrorBoundary>
  );
}
