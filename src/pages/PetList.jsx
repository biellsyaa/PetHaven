import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Link } from "react-router-dom";
import "./petlist.css";

export default function PetList() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("status_approval", "approved");

    setPets(data || []);
  }

  return (
    <div className="petlist-page">
      <h1 className="petlist-title">Adopsi Hewan 💗</h1>

      <div className="petlist-grid">
        {pets.map((p) => (
          <div className="pet-card-public" key={p.id_pet}>
            <img src={p.foto_url} alt={p.nama_hewan} />

            <div className="pet-card-info">
              <h3>{p.nama_hewan}</h3>
              <p>{p.jenis}</p>
              <p>{p.umur} {p.umur_unit}</p>

              <Link to={`/pets/${p.id_pet}`} className="detail-btn">
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}

        {pets.length === 0 && (
          <p className="empty-text">
            Belum ada hewan yang bisa diadopsi 💗
          </p>
        )}
      </div>
    </div>
  );
}