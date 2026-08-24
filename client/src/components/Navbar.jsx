import { NavLink, useNavigate } from "react-router";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { LogOutIcon } from "../utils/icons";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-tasks", label: "My Tasks" },
  { to: "/calendar", label: "Calendar" },
  { to: "/settings", label: "Settings" },
];

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `text-black font-medium pb-1 border-b-2 transition-colors ${
      isActive ? "border-black" : "border-transparent hover:border-black/40"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-sky-300 dark:bg-sky-600 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-8">
          <Logo />
          <ul className="hidden sm:flex items-center gap-6">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-black text-sm">
            Hi, {user?.name?.split(" ")[0]}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-black text-sm font-medium hover:underline"
          >
            <LogOutIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* mobile nav links */}
      <ul className="flex sm:hidden justify-around border-t border-black/10 py-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `text-black text-xs font-medium ${isActive ? "underline" : ""}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
