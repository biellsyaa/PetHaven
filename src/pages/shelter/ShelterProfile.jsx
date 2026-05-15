import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import "./profile.css";

export default function ShelterProfile() {
  const [shelter, setShelter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const shelterId = localStorage.getItem("shelter_id");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from("shelters")
      .select("*")
      .eq("id_shelter", shelterId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setShelter(data);
  }

  // ✅ HANDLE INPUT
  function handleChange(e) {
    const { name, value } = e.target;

    setShelter((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ✅ UPDATE KE SUPABASE
  async function handleSaveProfile() {
    const { error } = await supabase
      .from("shelters")
      .update({
        nama_shelter: shelter.nama_shelter,
        email: shelter.email,
        alamat: shelter.alamat,
        no_whatsapp: shelter.no_whatsapp,
      })
      .eq("id_shelter", shelterId);

    if (error) {
      console.error(error);
      alert("Gagal update profile");
      return;
    }

    alert("Profile berhasil diupdate!");
    setIsEditing(false);
  }

  if (!shelter) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-header-bg"></div>

      <div className="profile-card">
        <h1 className="profile-title">
          Hai, {shelter.nama_shelter}!
        </h1>

        <p className="profile-sub">
          Informasi akun shelter kamu 💗
        </p>

        <div className="profile-grid">

          {/* NAMA */}
          <div className="item">
            <label>Nama Shelter</label>

            {isEditing ? (
              <input
                type="text"
                name="nama_shelter"
                value={shelter.nama_shelter || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{shelter.nama_shelter}</span>
            )}
          </div>

          {/* EMAIL */}
          <div className="item">
            <label>Email</label>

            {isEditing ? (
              <input
                type="email"
                name="email"
                value={shelter.email || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{shelter.email}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="item">
            <label>Password</label>
            <span>••••••••••</span>
          </div>

          {/* ALAMAT */}
          <div className="item">
            <label>Alamat Shelter</label>

            {isEditing ? (
              <input
                type="text"
                name="alamat"
                value={shelter.alamat || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{shelter.alamat}</span>
            )}
          </div>

          {/* WHATSAPP */}
          <div className="item">
            <label>No WhatsApp</label>

            {isEditing ? (
              <input
                type="text"
                name="no_whatsapp"
                value={shelter.no_whatsapp || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{shelter.no_whatsapp}</span>
            )}
          </div>
        </div>

        {/* BUTTON */}
        <div style={{ marginTop: "30px" }}>
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="edit-btn"
            >
              Simpan Perubahan
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}