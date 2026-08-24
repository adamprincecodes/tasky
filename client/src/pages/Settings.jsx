import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState({ dueSoon: true, dailyDigest: false });

  async function handleSaveAccount(e) {
    e.preventDefault();
    setError('');
    try {
      await updateProfile({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <section className="bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-5 mb-6">
        <h2 className="font-semibold mb-4">Account</h2>
        <form onSubmit={handleSaveAccount} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              disabled
              value={user?.email || ''}
              className="w-full px-3 py-2 rounded-lg border border-black/10 bg-black/5 text-black/60"
            />
          </div>
          <button className="bg-sky-400 hover:bg-sky-500 font-semibold px-4 py-2 rounded-lg text-black">
            Save changes
          </button>
          {saved && <span className="ml-3 text-sm text-green-700">Saved</span>}
        </form>
      </section>

      <section className="bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-5 mb-6">
        <h2 className="font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm text-black/60 dark:text-white/60">
              Switch between light and dark themes.
            </p>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </section>

      <section className="bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-5">
        <h2 className="font-semibold mb-4">Notifications</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">Due-soon reminders</p>
            <p className="text-sm text-black/60 dark:text-white/60">
              Get notified before a task is due.
            </p>
          </div>
          <Toggle
            checked={notifications.dueSoon}
            onChange={() => setNotifications((n) => ({ ...n, dueSoon: !n.dueSoon }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Daily digest</p>
            <p className="text-sm text-black/60 dark:text-white/60">
              A daily summary of your tasks.
            </p>
          </div>
          <Toggle
            checked={notifications.dailyDigest}
            onChange={() => setNotifications((n) => ({ ...n, dailyDigest: !n.dailyDigest }))}
          />
        </div>
      </section>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
        checked ? 'bg-sky-500' : 'bg-black/20'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}
