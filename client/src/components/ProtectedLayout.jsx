import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import Navbar from './Navbar';

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While AuthContext is confirming the stored token against /auth/me,
  // hold off on redirecting — otherwise a logged-in user gets bounced to
  // /login for a flash on every page refresh.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-slate-900 text-black dark:text-white">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-cream dark:bg-slate-900 text-black dark:text-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </TaskProvider>
  );
}
