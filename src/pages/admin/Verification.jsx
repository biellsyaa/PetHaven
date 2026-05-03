import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import Toast from "../../components/Toast";
import "./verification.css";

export default function Verification() {
  const [pets, setPets] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("status_approval", "pending")
      .order("request_date", { ascending: true });

    if (!error) setPets(data || []);
  }

  async function approvePet(id) {
    const { error } = await supabase
      .from("pets")
      .update({
        status_approval: "approved",
        rejection_reason: null,
      })
      .eq("id_pet", id);

    if (error) {
      showToast("❌ Gagal approve");
      return;
    }

    showToast("✅ Hewan berhasil di-approve");
    loadPets();
  }

  async function rejectPet(id) {
    if (!rejectReason) {
      showToast("⚠️ Alasan wajib diisi");
      return;
    }

    const { error } = await supabase
      .from("pets")
      .update({
        status_approval: "rejected",
        rejection_reason: rejectReason,
      })
      .eq("id_pet", id);

    if (error) {
      showToast("❌ Gagal reject");
      return;
    }

    showToast("❌ Hewan ditolak");
    setRejectReason("");
    loadPets();
  }

  return (
    <div className="verification-page">
      <Toast message={toastMessage} show={toast} />
      <h1>Verifikasi Hewan</h1>

      {pets.length === 0 && <p>Tidak ada pengajuan baru</p>}

      {pets.map((p) => (
  <div key={p.id_pet} className="verify-card">
    {/* ✅ FOTO */}
    <img src={p.foto_url} alt={p.nama_hewan} />

    <div className="verify-info">
      <h3>{p.nama_hewan}</h3>
      <p>{p.jenis}</p>
      <p>{p.deskripsi}</p>

      <textarea
        placeholder="Alasan penolakan (jika reject)"
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      />

      <div className="verify-actions">
        <button
          className="approve-btn"
          onClick={() => approvePet(p.id_pet)}
        >
          ✅ Approve
        </button>
        <button
          className="reject-btn"
          onClick={() => rejectPet(p.id_pet)}
        >
          ❌ Reject
        </button>
      </div>
    </div>
  </div>
))}
    </div>
  );
}