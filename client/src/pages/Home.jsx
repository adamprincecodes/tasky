import { Link } from "react-router";
import Logo from "../components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream text-black flex flex-col">
      <header className="sticky top-0 z-50">
        <Logo standalone />
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Get your day in order with{" "}
            <span className="font-cursive text-sky-500">Tasky</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 mb-8">
            Tasky helps you track what's due today, organize tasks by priority,
            and see your progress at a glance — so nothing important slips
            through the cracks.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="bg-sky-400 hover:bg-sky-500 text-black font-semibold px-6 py-3 rounded-lg shadow-sm transition-colors"
            >
              Create a free account
            </Link>
            <Link
              to="/login"
              className="border-2 border-sky-400 hover:bg-sky-100 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>

      <section className="max-w-5xl mx-auto px-6 pb-16 grid sm:grid-cols-3 gap-6">
        <FeatureCard
          title="Stay on schedule"
          text="See what's due today the moment you log in."
        />
        <FeatureCard
          title="Track progress"
          text="Watch your completion stats update as you check things off."
        />
        <FeatureCard
          title="Filter & organize"
          text="Sort by priority, status, or due date to focus on what matters."
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="bg-white/60 border border-black/10 rounded-xl p-5">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-black/70 text-sm">{text}</p>
    </div>
  );
}
