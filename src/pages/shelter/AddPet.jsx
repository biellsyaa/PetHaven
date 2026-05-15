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

  // ✅ FORMAT RUPIAH
  function formatRupiah(value) {
    if (!value) return "";
    return "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // ✅ HARGA HANYA ANGKA
  function handleHargaChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");

    setHarga(raw);
    setHargaDisplay(formatRupiah(raw));
  }

  // ✅ UMUR HANYA ANGKA
  function handleUmurChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setUmur(raw);
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

    // ✅ VALIDASI
    if (
      !nama ||
      !jenis ||
      !jenisKelamin ||
      !umur ||
      !harga ||
      !deskripsi
    ) {
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
      harga: Number(harga),
      foto_url: foto,
      status_approval: "pending",
      id_shelter: shelterId,
    });

    if (error) {
      console.error(error);
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

          {/* NAMA */}
          <input
            placeholder="Nama hewan"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          {/* JENIS */}
          <input
            placeholder="Jenis / Breed"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
          />

          {/* UMUR */}
          <div className="age-group">
            <input
              className="age-input"
              placeholder="Umur"
              value={umur}
              onChange={handleUmurChange}
            />

            <select
              className="age-unit"
              value={umurUnit}
              onChange={(e) => setUmurUnit(e.target.value)}
            >
              <option value="bulan">Bulan</option>
              <option value="tahun">Tahun</option>
            </select>
          </div>

          {/* ✅ DROPDOWN JENIS KELAMIN */}
          <select
            value={jenisKelamin}
            onChange={(e) => setJenisKelamin(e.target.value)}
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Jantan">Jantan</option>
            <option value="Betina">Betina</option>
          </select>

          {/* ✅ HARGA HANYA ANGKA */}
          <input
            placeholder="Harga"
            value={hargaDisplay}
            onChange={handleHargaChange}
          />

          {/* FILE */}
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
              <span className="file-upload-name">
                {file.name}
              </span>
            )}
          </label>

          {/* DESKRIPSI */}
          <textarea
            placeholder="Deskripsi"
            className="textarea"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="save-btn"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}