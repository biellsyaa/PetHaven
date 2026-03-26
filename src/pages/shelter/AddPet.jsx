import { useState } from "react";
import { supabase } from "../../services/supabase";

export default function AddPet() {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState(null);

  async function uploadFile() {
    const fileName = `${Date.now()}-${file.name}`;
    const { data } = await supabase.storage.from("pet-images").upload(fileName, file);
    return supabase.storage.from("pet-images").getPublicUrl(fileName).data.publicUrl;
  }

  async function save(e) {
    e.preventDefault();

    let foto = await uploadFile();

    await supabase.from("pets").insert({
      nama_hewan: nama,
      deskripsi,
      foto_url: foto,
      status_approval: "pending",
      id_shelter: localStorage.getItem("shelter_id"),
    });

    alert("Hewan berhasil diajukan!");
  }

  return (
    <form onSubmit={save}>
      <h2>Tambah Hewan</h2>

      <input placeholder="Nama hewan" onChange={(e) => setNama(e.target.value)} />
      <textarea placeholder="Deskripsi" onChange={(e) => setDeskripsi(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button>Simpan</button>
    </form>
  );
}