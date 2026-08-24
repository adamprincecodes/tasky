import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(form);
    setSubmitting(false);
    if (result.ok) navigate(from, { replace: true });
    else setError(result.error);
  }

  return (
    <div className="min-h-screen bg-cream text-black flex flex-col">
      <header className="sticky top-0 z-50">
        <Logo standalone />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white/70 border border-black/10 rounded-xl p-8 shadow-sm"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome back</h1>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 rounded-lg border border-black/20 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 px-3 py-2 rounded-lg border border-black/20 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sky-400 hover:bg-sky-500 disabled:opacity-60 text-black font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>

          <p className="mt-6 text-sm text-center text-black/70">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-sky-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
