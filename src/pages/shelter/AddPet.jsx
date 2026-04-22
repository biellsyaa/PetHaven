import { useState } from "react";
import { supabase } from "../../services/supabase";
import "./addpet.css";

export default function AddPet() {
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [umur, setUmur] = useState("");
  const [umurUnit, setUmurUnit] = useState("bulan");

  const [harga, setHarga] = useState(""); 
  const [hargaDisplay, setHargaDisplay] = useState(""); 

  const [file, setFile] = useState(null);

  function formatRupiah(value) {
    if (!value) return "";
    return "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function handleHargaChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setHarga(raw);
    setHargaDisplay(formatRupiah(raw));
  }

  async function uploadFile() {
    if (!file) return null;

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("pet-images")
      .upload(fileName, file);

    if (error) {
      console.error("UPLOAD ERROR:", error);
      alert("Upload gambar gagal: " + error.message);
      return null;
    }

    return supabase.storage
      .from("pet-images")
      .getPublicUrl(fileName).data.publicUrl;
  }

  async function save(e) {
    e.preventDefault();

    const foto = await uploadFile();
    if (!foto) return;

    // ✅ FIX PENTING: convert ke integer
    const idShelter = parseInt(localStorage.getItem("shelter_id"), 10);

    const { data, error } = await supabase.from("pets").insert({
      nama_hewan: nama,
      jenis,
      jenis_kelamin: jenisKelamin,
      umur: parseInt(umur),
      umur_unit: umurUnit,
      deskripsi,
      harga,
      foto_url: foto,
      status_approval: "pending",
      id_shelter: idShelter, // ✅ SUDAH FIX 
    });

    if (error) {
      console.error("INSERT ERROR:", error);
      alert("Gagal menyimpan ke database: " + error.message);
      return;
    }

    console.log("INSERT SUCCESS:", data);
    alert("Hewan berhasil ditambahkan!");
  }

  return (
    <div className="addpet-wrapper">
      <div className="addpet-card">

        <h1 className="title">Tambah Hewan</h1>

        <form onSubmit={save} className="form-grid">

          <input placeholder="Nama hewan" onChange={(e) => setNama(e.target.value)} />
          <input placeholder="Jenis / Breed" onChange={(e) => setJenis(e.target.value)} />

          <div className="age-group">
            <input
              type="text"
              className="age-input"
              placeholder="Umur"
              onChange={(e) => setUmur(e.target.value)}
            />

            <select className="age-unit" onChange={(e) => setUmurUnit(e.target.value)}>
              <option value="bulan">Bulan</option>
              <option value="tahun">Tahun</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Harga (contoh: 100000)"
            value={hargaDisplay}
            onChange={handleHargaChange}
            className="price-input"
          />

          <label className="file-upload-wrapper">
            <span className="file-upload-label">📸 Upload Foto Hewan</span>

            <input
              type="file"
              className="file-upload-input"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file && (
              <span className="file-upload-name">{file.name}</span>
            )}
          </label>

          <textarea
            placeholder="Deskripsi"
            className="textarea"
            onChange={(e) => setDeskripsi(e.target.value)}
          ></textarea>

          <button className="save-btn">Simpan</button>
        </form>
      </div>
    </div>
  );
}