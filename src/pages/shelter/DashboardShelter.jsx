import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Link } from "react-router-dom";
import "../shelter/dashboardshelter.css"; // tambahin CSS baru ya beb

export default function DashboardShelter() {
  const [pets, setPets] = useState([]);

  const shelterId = localStorage.getItem("shelter_id");

  useEffect(() => {
    if (!shelterId) {
      window.location.href = "/shelter/login";
      return;
    }
    loadPets();
  }, []);

  async function loadPets() {
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("id_shelter", shelterId);

    setPets(data || []);
  }

  function logout() {
    localStorage.removeItem("shelter_id");
    window.location.href = "/shelter/login";
  }

  return (
    <div className="shelter-dashboard">

      {/* ✅ SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">🐾</div>

        <nav className="sidebar-menu">         
          <Link to="/" className="menu-item">
            <span className="icon">🏠</span>
            <span className="label">Home</span>
          </Link>

          <Link to="/shelter/profile" className="menu-item">
            <span className="icon">👤</span>
            <span className="label">Profile</span>
          </Link>

          <Link to="/shelter/add-pet" className="menu-item">
            <span className="icon">➕</span>
            <span className="label">Add Pet</span>
          </Link>

          <button onClick={logout} className="menu-item logout-btn">
            <span className="icon">🚪</span>
            <span className="label">Logout</span>
          </button>
        </nav>
      </aside>

      {/* ✅ MAIN CONTENT */}
      <main className="dashboard-content">

        <h1 className="dashboard-title">My Pets</h1>
        <p className="subtitle">Kelola hewan shelter kamu dengan mudah 💗</p>

        <Link to="/shelter/add-pet">
          <button className="add-pet-btn">+ Tambah Hewan</button>
        </Link>

        {/* ✅ PETS GRID */}
        <div className="pets-grid">
          {pets.map((p) => (
            <div className="pet-card" key={p.id_pet}>
              <img src={p.foto_url} alt={p.nama_hewan} />

              <div className="pet-info">
                <h3>{p.nama_hewan}</h3>
                <span className={`status ${p.status_approval}`}>
                  {p.status_approval}
                </span>
              </div>
            </div>
          ))}

          {pets.length === 0 && (
            <p className="no-pets">Belum ada hewan. Tambahkan hewan pertama kamu 💗</p>
          )}
        </div>

      </main>

    </div>
  );
}