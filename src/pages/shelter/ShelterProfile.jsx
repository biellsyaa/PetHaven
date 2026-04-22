import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import "./profile.css";

export default function ShelterProfile() {
  const [shelter, setShelter] = useState(null);
  const shelterId = localStorage.getItem("shelter_id");

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("shelters")
        .select("*")
        .eq("id_shelter", shelterId)
        .single();

      if (!error) setShelter(data);
    }
    fetchProfile();
  }, []);

  if (!shelter) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-header-bg"></div>

      <div className="profile-card">
        <h1 className="profile-title">Hai, {shelter.nama_shelter}!</h1>
        <p className="profile-sub">Informasi akun shelter kamu 💗</p>

        <div className="profile-grid">
          <div className="item">
            <label>Nama Shelter</label>
            <span>{shelter.nama_shelter}</span>
          </div>

          <div className="item">
            <label>Email</label>
            <span>{shelter.email}</span>
          </div>

          <div className="item">
            <label>Password</label>
            <span>••••••••••</span>
          </div>

          <div className="item">
            <label>Alamat Shelter</label>
            <span>{shelter.alamat}</span>
          </div>

          <div className="item">
            <label>No WhatsApp</label>
            <span>{shelter.no_whatsapp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}