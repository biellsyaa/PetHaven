import { useState } from "react";
import { supabase } from "../../services/supabase";
import Toast from "../../components/Toast";
import "./registershelter.css";

export default function RegisterShelter() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [wa, setWa] = useState("");

  const [toast, setToast] = useState(false);

  async function register(e) {
    e.preventDefault();

    const { error } = await supabase.from("shelters").insert({
      nama_shelter: nama,
      email,
      password,
      alamat,
      no_whatsapp: wa,
    });

    if (error) {
      setToast(true);
      setTimeout(() => setToast(false), 2000);
      return;
    }

    setToast(true);

    setTimeout(() => {
      setToast(false);
      window.location.href = "/shelter/login";
    }, 2000);
  }

  return (
    <>
      {/* TOAST MUNCUL DI SINI */}
      <Toast message="Registrasi shelter berhasil!" show={toast} />

      <div className="register-wrapper">

        {/* LEFT SIDE */}
        <div className="register-left">
          <h2>Register Shelter</h2>
          <p className="subtext">Buat akun shelter untuk mengunggah hewan 💗</p>

          <form onSubmit={register} className="register-form">

            <div className="input-group">
              <span className="icon">🏠</span>
              <input placeholder="Nama Shelter" onChange={(e) => setNama(e.target.value)} />
            </div>

            <div className="input-group">
              <span className="icon">📧</span>
              <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
              <span className="icon">🔑</span>
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="input-group">
              <span className="icon">📍</span>
              <input placeholder="Alamat Shelter" onChange={(e) => setAlamat(e.target.value)} />
            </div>

            <div className="input-group">
              <span className="icon">📱</span>
              <input placeholder="No WhatsApp" onChange={(e) => setWa(e.target.value)} />
            </div>

            <button className="btn-register">Create Account</button>
          </form>

          <p className="login-text">
            Already have an account?
            <a className="login-link" href="/shelter/login"> Login</a>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="register-right">
          <div className="register-image-card">
            <img 
              src="https://images.unsplash.com/photo-1543852786-1cf6624b9987"
              alt="Pets"
            />
          </div>
        </div>

      </div>
    </>
  );
}