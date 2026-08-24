import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import ProtectedLayout from "./components/ProtectedLayout";

export default function App() {
  return (
    <Routes>
      {/* Public pages — no navbar */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected pages — share the Navbar + auth guard */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
