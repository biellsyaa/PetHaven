import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    loadDetail();
  }, []);

  async function loadDetail() {
    const { data } = await supabase
      .from("pets")
      .select("*, shelters(no_whatsapp)")
      .eq("id_pet", id)
      .single();

    setPet(data);
  }

  if (!pet) return <p>Loading...</p>;

  return (
    <div>
      <img src={pet.foto_url} style={{ width: "300px", borderRadius: "10px" }} />
      <h1>{pet.nama_hewan}</h1>
      <p>{pet.deskripsi}</p>

      <a
        href={`https://wa.me/${pet.shelters.no_whatsapp}?text=Saya tertarik mengadopsi ${pet.nama_hewan}`}
        target="_blank"
      >
        <button style={{ padding: "10px 20px", background: "#25D366", border: "none", color: "white", borderRadius: "5px" }}>
          Chat via WhatsApp
        </button>
      </a>
    </div>
  );
}
``