import { Link } from "react-router";

// Renders the app name in cursive. `standalone` adds its own sky-blue
// background box (used on Home/Login/Signup). Inside the Navbar the
// background already comes from the nav bar itself, so it's left transparent.
export default function Logo({ standalone = false, to = "/" }) {
  const box = standalone
    ? "bg-sky-300 dark:bg-sky-500 px-4 py-2 rounded-br-2xl shadow-sm"
    : "";

  return (
    <Link to={to} className={`inline-flex items-center ${box}`}>
      <span className="font-cursive text-2xl sm:text-3xl text-black tracking-wide">
        Tasky
      </span>
    </Link>
  );
}
