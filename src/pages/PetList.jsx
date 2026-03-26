import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Link } from "react-router-dom";

export default function PetList() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchPets();
  }, []);

  async function fetchPets() {
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("status_approval", "approved");

    setPets(data);
  }

  return (
    <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
      {pets.map((pet) => (
        <Link to={`/pets/${pet.id_pet}`} key={pet.id_pet}>
          <div className="card">
            <img src={pet.foto_url} style={{ width: "100%" }} />
            <h3>{pet.nama_hewan}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}