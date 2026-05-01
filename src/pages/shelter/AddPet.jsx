import { useState } from "react";
import { supabase } from "../../services/supabase";
import Toast from "../../components/Toast";
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
  const [loading, setLoading] = useState(false);

  // ✅ TOAST STATE
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  function showToast(message) {
    setToastMessage(message);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

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
    if (!file) {
      showToast("📷 Foto hewan belum dipilih");
      return null;
    }

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("pet-images")
      .upload(fileName, file);

    if (error) {
      showToast("❌ Upload foto gagal");
      return null;
    }

    return supabase.storage
      .from("pet-images")
      .getPublicUrl(fileName).data.publicUrl;
  }

  async function save(e) {
    e.preventDefault();

    // ✅ VALIDASI FORM
    if (!nama || !jenis || !umur || !harga || !deskripsi) {
      showToast("⚠️ Lengkapi semua data yaa");
      return;
    }

    setLoading(true);

    const foto = await uploadFile();
    if (!foto) {
      setLoading(false);
      return;
    }

    const shelterId = localStorage.getItem("shelter_id");
    if (!shelterId) {
      showToast("❌ Shelter belum login");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("pets").insert({
      nama_hewan: nama,
      jenis,
      jenis_kelamin: jenisKelamin,
      umur: Number(umur),
      umur_unit: umurUnit,
      deskripsi,
      harga,
      foto_url: foto,
      status_approval: "pending",
      id_shelter: shelterId,
    });

    if (error) {
      showToast("❌ Gagal menyimpan data");
      setLoading(false);
      return;
    }

    showToast("✅ Hewan berhasil ditambahkan!");
    setTimeout(() => {
      window.location.href = "/shelter/dashboard";
    }, 2000);
  }

  return (
    <div className="addpet-wrapper">
      {/* ✅ TOAST */}
      <Toast message={toastMessage} show={toast} />

      <div className="addpet-card">
        <h1 className="title">Tambah Hewan</h1>

        <form onSubmit={save} className="form-grid">
          <input placeholder="Nama hewan" onChange={(e) => setNama(e.target.value)} />
          <input placeholder="Jenis / Breed" onChange={(e) => setJenis(e.target.value)} />

          <div className="age-group">
            <input
              className="age-input"
              placeholder="Umur"
              onChange={(e) => setUmur(e.target.value)}
            />

            <select
              className="age-unit"
              onChange={(e) => setUmurUnit(e.target.value)}
            >
              <option value="bulan">Bulan</option>
              <option value="tahun">Tahun</option>
            </select>
          </div>

          <input
            placeholder="Jenis Kelamin"
            onChange={(e) => setJenisKelamin(e.target.value)}
          />

          <input
            placeholder="Harga"
            value={hargaDisplay}
            onChange={handleHargaChange}
          />

          {/* ✅ FILE UPLOAD */}
          <label className="file-upload-wrapper">
            <span className="file-upload-label">
              📸 {file ? "Ganti Foto Hewan" : "Upload Foto Hewan"}
            </span>

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
          />

          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}