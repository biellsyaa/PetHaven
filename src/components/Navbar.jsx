import { Link } from "react-router-dom";

export default function Navbar() {
  const shelterId = localStorage.getItem("shelter_id");
  const adminId = localStorage.getItem("admin_id");

  return (
    <nav className="navbar">
      <div className="nav-logo">PetHaven</div>

      <div className="nav-links">
        <Link to="/pets">Adopsi Hewan</Link>

        {/* ✅ Shelter Link Auto Detect */}
        {!shelterId ? (
          <Link to="/shelter/login">Shelter</Link>
        ) : (
          <Link to="/shelter/dashboard">Shelter Dashboard</Link>
        )}

        {/* ✅ Admin Link Auto Detect */}
        {!adminId ? (
          <Link to="/admin/login">Admin</Link>
        ) : (
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        )}
      </div>
    </nav>
  );
}