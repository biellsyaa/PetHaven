import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../../components/Toast";
import "../shelter/addpet.css"; // REUSE CSS AddPet 💗

export default function EditPet() {
  const { id } = useParams(); // id_pet
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  // === FORM STATES ===
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [umur, setUmur] = useState("");
  const [umurUnit, setUmurUnit] = useState("bulan");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState(null);

  // === TOAST ===
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  // === LOAD PET DATA ===
  useEffect(() => {
    loadPet();
  }, []);

  async function loadPet() {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id_pet", id)
      .single();

    if (error || !data) {
      showToast("❌ Data tidak ditemukan");
      navigate("/shelter/dashboard");
      return;
    }

    // ❌ Kalau sudah approved → TIDAK BOLEH EDIT
    if (data.status_approval !== "pending") {
      showToast("❌ Data sudah tidak bisa diedit");
      navigate("/shelter/dashboard");
      return;
    }

    setPet(data);
    setNama(data.nama_hewan);
    setJenis(data.jenis);
    setJenisKelamin(data.jenis_kelamin);
    setUmur(data.umur);
    setUmurUnit(data.umur_unit);
    setHarga(data.harga);
    setDeskripsi(data.deskripsi);

    setLoading(false);
  }

  async function uploadFile() {
    if (!file) return pet.foto_url; // pakai foto lama

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

  // === UPDATE ===
  async function save(e) {
    e.preventDefault();

    if (!nama || !jenis || !umur || !harga || !deskripsi) {
      showToast("⚠️ Lengkapi semua data ya");
      return;
    }

    const foto = await uploadFile();
    if (!foto) return;

    const { error } = await supabase
      .from("pets")
      .update({
        nama_hewan: nama,
        jenis,
        jenis_kelamin: jenisKelamin,
        umur,
        umur_unit: umurUnit,
        harga,
        deskripsi,
        foto_url: foto,
        status_approval: "pending", // tetap pending
        rejection_reason: null,     // reset kalau sebelumnya rejected
      })
      .eq("id_pet", id)
      .eq("status_approval", "pending"); // 🔐 SECURITY

    if (error) {
      showToast("❌ Gagal memperbarui data");
      return;
    }

    showToast("✅ Data berhasil diperbarui");
    setTimeout(() => navigate("/shelter/dashboard"), 1500);
  }

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div className="addpet-wrapper">
      <Toast message={toastMessage} show={toast} />

      <div className="addpet-card">
        <h1 className="title">Edit Hewan</h1>

        <form onSubmit={save} className="form-grid">
          <input value={nama} onChange={(e) => setNama(e.target.value)} />
          <input value={jenis} onChange={(e) => setJenis(e.target.value)} />

        <div className="age-group">
            <input className="age-input" value={umur} onChange={(e) => setUmur(e.target.value)} />
            <select className="age-unit" value={umurUnit} onChange={(e) => setUmurUnit(e.target.value)}>
                <option value="bulan">Bulan</option>
                <option value="tahun">Tahun</option>
            </select>
        </div>

          <input
            value={jenisKelamin}
            onChange={(e) => setJenisKelamin(e.target.value)}
          />

          <input value={harga} onChange={(e) => setHarga(e.target.value)} />

          <label className="file-upload-wrapper">
            <span className="file-upload-label">
              📸 Ganti Foto (opsional)
            </span>
            <input
              type="file"
              className="file-upload-input"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <textarea
            className="textarea"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />

          <button type="submit" className="save-btn">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
