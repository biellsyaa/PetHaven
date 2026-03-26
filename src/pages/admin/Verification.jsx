import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

export default function Verification() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("status_approval", "pending");

    setPending(data);
  }

  async function approve(id) {
    await supabase.from("pets").update({ status_approval: "approved" }).eq("id_pet", id);
    load();
  }

  async function reject(id) {
    await supabase.from("pets").update({ status_approval: "rejected" }).eq("id_pet", id);
    load();
  }

  return (
    <div>
      <h2>Verifikasi Hewan</h2>

      {pending.map((p) => (
        <div key={p.id_pet} className="card" style={{ marginBottom: "15px" }}>
          <h3>{p.nama_hewan}</h3>
          <p>{p.deskripsi}</p>

          <button onClick={() => approve(p.id_pet)}
            style={{ marginRight: "10px", padding: "5px 12px" }}>
            Approve
          </button>

          <button onClick={() => reject(p.id_pet)} style={{ padding: "5px 12px" }}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}