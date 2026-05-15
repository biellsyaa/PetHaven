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
  const [toastMessage, setToastMessage] = useState("");

  function showToast(message) {
    setToastMessage(message);
    setToast(true);

    setTimeout(() => {
      setToast(false);
    }, 2000);
  }

  // ✅ VALIDASI EMAIL
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // ✅ HANDLE WA ANGKA ONLY
  function handleWaChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setWa(raw);
  }

  async function register(e) {
    e.preventDefault();

    // ✅ VALIDASI EMPTY
    if (
      !nama.trim() ||
      !email.trim() ||
      !password.trim() ||
      !alamat.trim() ||
      !wa.trim()
    ) {
      showToast("⚠️ Semua wajib diisi");
      return;
    }

    // ✅ CEGAH INPUT 'EMPTY'
    if (
      nama.trim().toLowerCase() === "empty" ||
      email.trim().toLowerCase() === "empty" ||
      password.trim().toLowerCase() === "empty" ||
      alamat.trim().toLowerCase() === "empty"
    ) {
      showToast("⚠️ Input tidak valid");
      return;
    }

    // ✅ VALIDASI EMAIL
    if (!isValidEmail(email)) {
      showToast("⚠️ Format email tidak valid");
      return;
    }

    // ✅ PASSWORD MINIMAL
    if (password.length < 6) {
      showToast("⚠️ Password minimal 6 karakter");
      return;
    }

    // ✅ VALIDASI NOMOR WA
    if (wa.length < 10) {
      showToast("⚠️ Nomor WhatsApp tidak valid");
      return;
    }

    // ✅ CEK EMAIL SUDAH ADA
    const { data: existingUser } = await supabase
      .from("shelters")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      showToast("⚠️ Email sudah terdaftar");
      return;
    }

    // ✅ INSERT DATA
    const { error } = await supabase
      .from("shelters")
      .insert({
        nama_shelter: nama.trim(),
        email: email.trim(),
        password: password.trim(),
        alamat: alamat.trim(),
        no_whatsapp: wa.trim(),
      });

    if (error) {
      console.error(error);
      showToast("❌ Registrasi gagal");
      return;
    }

    showToast("✅ Registrasi shelter berhasil!");

    setTimeout(() => {
      window.location.href = "/shelter/login";
    }, 2000);
  }

  return (
    <>
      {/* TOAST */}
      <Toast message={toastMessage} show={toast} />

      <div className="register-wrapper">

        {/* LEFT */}
        <div className="register-left">
          <h2>Register Shelter</h2>

          <p className="subtext">
            Buat akun shelter untuk mengunggah hewan 💗
          </p>

          <form
            onSubmit={register}
            className="register-form"
          >

            {/* NAMA */}
            <div className="input-group">
              <span className="icon">🏠</span>

              <input
                placeholder="Nama Shelter"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <span className="icon">📧</span>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <span className="icon">🔑</span>

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* ALAMAT */}
            <div className="input-group">
              <span className="icon">📍</span>

              <input
                placeholder="Alamat Shelter"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </div>

            {/* WHATSAPP */}
            <div className="input-group">
              <span className="icon">📱</span>

              <input
                placeholder="No WhatsApp"
                value={wa}
                onChange={handleWaChange}
              />
            </div>

            <button className="btn-register">
              Create Account
            </button>
          </form>

          <p className="login-text">
            Already have an account?

            <a
              className="login-link"
              href="/shelter/login"
            >
              {" "}
              Login
            </a>
          </p>
        </div>

        {/* RIGHT */}
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