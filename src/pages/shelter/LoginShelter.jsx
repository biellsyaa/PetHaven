import { useState } from "react";
import { supabase } from "../../services/supabase";
import "./login.css";
import Toast from "../../components/Toast";

export default function LoginShelter() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  async function login(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("shelters")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      setToastMessage("Email atau password salah!");
      setToast(true);
      setTimeout(() => setToast(false), 2000);
      return;
    }

    // ✅ Login sukses
    localStorage.setItem("shelter_id", data.id_shelter);

    setToastMessage("Login berhasil!");
    setToast(true);

    setTimeout(() => {
      setToast(false);
      window.location.href = "/shelter/dashboard";
    }, 2000);
  }

  return (
    <div className="login-wrapper">
      <Toast message={toastMessage} show={toast} />

      <div className="login-left">
        <h2>Login</h2>
        <p className="subtext">Masuk untuk mengelola hewan shelter kamu 💗</p>

        <form onSubmit={login} className="login-form">
          <div className="input-group">
            <span className="icon">📧</span>
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔑</span>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-login">Login Now</button>
        </form>

        <p className="signup-text">
          Don't have an account?
          <a href="/shelter/register" className="signup-link"> Sign Up</a>
        </p>
      </div>

      <div className="login-right">
        <div className="login-image-card">
          <img
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a"
            alt="Pet"
          />
        </div>
      </div>
    </div>
  );
}