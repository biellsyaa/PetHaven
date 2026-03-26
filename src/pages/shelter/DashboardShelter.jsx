import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Link } from "react-router-dom";

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

    setPets(data);
  }

  function logout() {
    localStorage.removeItem("shelter_id");
    window.location.href = "/shelter/login";
  }

  return (
    <div>
      <h1>Dashboard Shelter</h1>
      <p>Data hewan milikmu:</p>

      <Link to="/shelter/add-pet">
        <button style={{ marginBottom: "20px", padding: "10px 20px" }}>
          + Tambah Hewan
        </button>
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {pets.map((p) => (
          <div key={p.id_pet} className="card">
            <img src={p.foto_url} style={{ width: "100%" }} />
            <h3>{p.nama_hewan}</h3>
            <p>Status: {p.status_approval}</p>
          </div>
        ))}
      </div>

      <button
        style={{ marginTop: "30px", padding: "10px 20px", background: "crimson", color: "white" }}
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}