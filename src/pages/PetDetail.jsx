import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useParams, Link } from "react-router-dom";
import "./petdetail.css";

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [shelterPhone, setShelterPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPet();
  }, []);

  async function loadPet() {
    // ✅ 1. Ambil data PET (approved saja)
    const { data: petData, error: petError } = await supabase
      .from("pets")
      .select("*")
      .eq("id_pet", id)
      .eq("status_approval", "approved")
      .single();

    if (petError || !petData) {
      console.error("PET ERROR:", petError);
      setLoading(false);
      return;
    }

    setPet(petData);

    // ✅ 2. Ambil nomor WhatsApp dari SHELTER (FIX DI SINI 🔥)
    const { data: shelterData, error: shelterError } = await supabase
      .from("shelters")
      .select("no_whatsapp")
      .eq("id_shelter", petData.id_shelter) // ✅ FIX FINAL
      .single();

    if (!shelterError && shelterData?.no_whatsapp) {
      setShelterPhone(shelterData.no_whatsapp);
    }

    setLoading(false);
  }

  // ✅ FORMAT NOMOR WA (08 → 62)
  function formatWhatsapp(phone) {
    if (!phone) return "";

    let clean = phone.replace(/\D/g, "");

    if (clean.startsWith("08")) {
      return "62" + clean.slice(1);
    }

    if (clean.startsWith("62")) {
      return clean;
    }

    return clean;
  }

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!pet) return <p style={{ padding: 40 }}>Data tidak ditemukan</p>;

  return (
    <div className="petdetail-page">
      <div className="petdetail-card">
        <img src={pet.foto_url} alt={pet.nama_hewan} />

        <div className="petdetail-info">
          <h1>{pet.nama_hewan}</h1>
          <p><b>Jenis:</b> {pet.jenis}</p>
          <p><b>Umur:</b> {pet.umur} {pet.umur_unit}</p>

          <p className="desc">{pet.deskripsi}</p>

          {/* ✅ TOMBOL WHATSAPP (PASTI MUNCUL SEKARANG) */}
          {shelterPhone && (
            <a
              href={`https://wa.me/${formatWhatsapp(shelterPhone)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn"
            >
              💬 Hubungi Shelter via WhatsApp
            </a>
          )}

          <Link to="/pets" className="back-btn">
            ← Kembali ke daftar
          </Link>
        </div>
      </div>
    </div>
  );
}