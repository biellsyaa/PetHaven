import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">PetHaven</div>

      <div className="nav-links">
        <Link to="/pets">Adopsi Hewan</Link>
        <Link to="/shelter/login">Shelter</Link>
        <Link to="/admin/login">Admin</Link>
      </div>
    </nav>
  );
}