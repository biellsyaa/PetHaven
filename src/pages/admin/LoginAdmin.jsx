import { useState } from "react";
import { supabase } from "../../services/supabase";
import "./loginadmin.css";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    const { data } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (!data) {
      alert("Email atau password salah!");
      return;
    }

    localStorage.setItem("admin_id", data.id_admin);
    window.location.href = "/admin/dashboard";
  }

  return (
    <div className="login-wrapper">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h2>Admin Login</h2>
        <p className="subtext">Masuk sebagai admin untuk mengelola PetHaven 💗</p>

        <form onSubmit={login} className="login-form">

          <div className="input-group">
            <span className="icon">📧</span>
            <input
              placeholder="Email Admin"
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
          Bukan admin?
          <a href="/shelter/login" className="signup-link"> Masuk sebagai Shelter</a>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-image-card">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
            alt="Admin Login"
          />
        </div>
      </div>

    </div>
  );
}