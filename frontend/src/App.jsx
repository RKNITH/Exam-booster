import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import LoadingScreen from './components/ui/LoadingScreen.jsx';

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const GeneratorPage = lazy(() => import('./pages/GeneratorPage.jsx'));
const ResultPage = lazy(() => import('./pages/ResultPage.jsx'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage.jsx'));
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#0f1f35', color: '#e2e8f0', border: '1px solid #1e3a5f' },
            success: { iconTheme: { primary: '#f97316', secondary: '#030810' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#030810' } },
          }}
        />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="generate" element={<GeneratorPage />} />
              <Route path="result/:id" element={<ResultPage />} />
              <Route path="bookmarks" element={<BookmarksPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="search" element={<SearchPage />} />
            </Route>
            <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
              <Route index element={<AdminPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
