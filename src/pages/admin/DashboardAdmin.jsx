import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import "./dashboardadmin.css";

export default function DashboardAdmin() {
  const [totalPets, setTotalPets] = useState(0);
  const [pendingPets, setPendingPets] = useState(0);
  const [approvedPets, setApprovedPets] = useState(0);
  const [sheltersCount, setSheltersCount] = useState(0);
  const [pets, setPets] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
    loadPets();
  }, []);

  async function loadStats() {
    const { count: allCount } = await supabase
      .from("pets")
      .select("*", { count: "exact" });

    const { count: pendingCount } = await supabase
      .from("pets")
      .select("*", { count: "exact" })
      .eq("status_approval", "pending");

    const { count: approvedCount } = await supabase
      .from("pets")
      .select("*", { count: "exact" })
      .eq("status_approval", "approved");

    const { count: shelters } = await supabase
      .from("shelters")
      .select("*", { count: "exact" });

    setTotalPets(allCount || 0);
    setPendingPets(pendingCount || 0);
    setApprovedPets(approvedCount || 0);
    setSheltersCount(shelters || 0);
  }

  async function loadPets() {
    const { data } = await supabase
      .from("pets")
      .select("*")
      .order("request_date", { ascending: false });

    setPets(data || []);
  }

  function logout() {
    localStorage.removeItem("admin_id");
    window.location.href = "/admin/login";
  }

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Hewan</h3>
          <h1>{totalPets}</h1>
          <p>Semua data hewan</p>
        </div>

        <div className="stat-card">
          <h3>Pending Approval</h3>
          <h1>{pendingPets}</h1>
          <p>Menunggu verifikasi</p>
        </div>

        <div className="stat-card">
          <h3>Approved</h3>
          <h1>{approvedPets}</h1>
          <p>Ditampilkan ke publik</p>
        </div>

        <div className="stat-card">
          <h3>Total Shelter</h3>
          <h1>{sheltersCount}</h1>
          <p>Shelter terdaftar</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-section">
        <h2>Data Hewan</h2>
        <p className="hint-text">
          Klik data berstatus <b>pending</b> untuk melakukan verifikasi
        </p>

        <table>
          <thead>
            <tr>
              <th>Nama Hewan</th>
              <th>Status</th>
              <th>Jenis</th>
              <th>Umur</th>
            </tr>
          </thead>

          <tbody>
            {pets.map((p) => (
              <tr
                key={p.id_pet}
                className={
                  p.status_approval === "pending"
                    ? "clickable-row"
                    : ""
                }
                onClick={() => {
                  if (p.status_approval === "pending") {
                    navigate("/admin/verification");
                  }
                }}
              >
                <td>{p.nama_hewan}</td>
                <td>
                  <span className={`status ${p.status_approval}`}>
                    {p.status_approval}
                  </span>
                </td>
                <td>{p.jenis}</td>
                <td>
                  {p.umur} {p.umur_unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}