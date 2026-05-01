import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Link, useNavigate } from "react-router-dom";
import "../shelter/dashboardshelter.css";

export default function DashboardShelter() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const shelterId = localStorage.getItem("shelter_id"); // ✅ UUID

    if (!shelterId) {
      window.location.href = "/shelter/login";
      return;
    }

    loadPets(shelterId);
  }, []);

  async function loadPets(shelterId) {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id_shelter", shelterId)
      .order("request_date", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPets(data || []);
    }

    setLoading(false);
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/shelter/login";
  }

  if (loading) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  return (
    <div className="shelter-dashboard">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-logo">🐾</div>

        <nav className="sidebar-menu">
          <Link to="/" className="menu-item">🏠 Home</Link>
          <Link to="/shelter/profile" className="menu-item">👤 Profile</Link>
          <Link to="/shelter/add-pet" className="menu-item">➕ Add Pet</Link>
          <button onClick={logout} className="menu-item logout-btn">
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dashboard-content">
        <h1 className="dashboard-title">My Pets</h1>
        <p className="subtitle">Kelola hewan shelter kamu dengan mudah 💗</p>

        <div className="pets-grid">
          {pets.map((p) => (
            <div className="pet-card" key={p.id_pet}>
              <img src={p.foto_url} alt={p.nama_hewan} />

              <div className="pet-info">
                <h3>{p.nama_hewan}</h3>
                <p>{p.jenis}</p>
                <p>{p.umur} {p.umur_unit}</p>

                {/* ✅ STATUS */}
                <span className={`status ${p.status_approval}`}>
                  {p.status_approval}
                </span>

                {/* ✅ REJECTION REASON */}
                {p.status_approval === "rejected" && p.rejection_reason && (
                  <p className="reject-msg">
                    ❌ Ditolak: {p.rejection_reason}
                  </p>
                )}

                {/* ✅ EDIT BUTTON (ONLY PENDING) */}
                {p.status_approval === "pending" && (
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/shelter/edit-pet/${p.id_pet}`)}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
            </div>
          ))}

          {pets.length === 0 && (
            <p className="no-pets">Belum ada hewan 💗</p>
          )}
        </div>
      </main>
    </div>
  );
}
``