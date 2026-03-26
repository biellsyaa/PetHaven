import { useState } from "react";
import "./home.css";

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faq = [
    {
      q: "Apa itu PetHaven?",
      a: "PetHaven adalah platform adopsi hewan yang menghubungkan shelter dengan adopter."
    },
    {
      q: "Apakah saya harus login untuk mengadopsi?",
      a: "Tidak, adopter tidak perlu login. Cukup pilih hewan dan kontak shelter melalui WhatsApp."
    },
    {
      q: "Bagaimana cara shelter mendaftar?",
      a: "Shelter bisa membuat akun, kemudian mengunggah hewan, dan menunggu persetujuan admin."
    }
  ];

  return (
    <div>

      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">Temukan Sahabat Barumu 💗🐶</h1>
          <p className="hero-subtitle">
            Ayo adopsi hewan lucu dan selamatkan nyawa hari ini.
          </p>
          <p className="hero-subtitle">
            Connecting Hearts, One Paw at a Time🐾
          </p>

          <a href="/pets">
            <button className="hero-btn">Mulai Cari Hewan</button>
          </a>
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <section className="overview">
        <h2>Tentang PetHaven</h2>
        <p>
          PetHaven adalah website adopsi hewan yang membantu kamu menemukan hewan
          yang membutuhkan rumah baru. Kami bekerja sama dengan shelter terpercaya
          untuk memastikan adopsi yang aman dan mudah.
        </p>
        <p>
          Kami percaya setiap hewan berhak mendapatkan rumah yang penuh kasih. 
          PetHaven membantu menjembatani shelter dan calon adopter dengan menyediakan 
          platform yang sederhana, transparan, dan mudah digunakan.
        </p>
      </section>

      {/* ✅ WHY US SECTION */}
      <section className="why">
        <h2>Mengapa Memilih Kami?</h2>

        <div className="why-grid">

          <div className="why-card">
            <h3>🔒 Aman & Terpercaya</h3>
            <p>Shelter diverifikasi oleh admin sebelum tampil ke publik.</p>
          </div>

          <div className="why-card">
            <h3>💬 Kontak Mudah</h3>
            <p>Adopter bisa langsung menghubungi shelter via WhatsApp.</p>
          </div>

          <div className="why-card">
            <h3>🐶 Banyak Pilihan</h3>
            <p>Tersedia berbagai hewan lucu yang siap diadopsi.</p>
          </div>

        </div>
      </section>

      {/* ✅ FAQ SECTION */}
      <section className="faq">
        <h2>Pertanyaan Umum (FAQ)</h2>

        {faq.map((item, index) => (
          <div key={index} className="faq-item">

            <div
              className="faq-question"
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              {item.q}
            </div>

            {openFAQ === index && (
              <div className="faq-answer">{item.a}</div>
            )}
          </div>
        ))}
      </section>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: helo.pethaven@gmail.com</p>
            <p>WhatsApp: 0812-3456-7890</p>
          </div>

          <div className="footer-section">
            <h3>Stay Connected</h3>
            <p>Instagram @pethaven</p>
            <p>TikTok @pethaven.id</p>
          </div>

        </div>

        <p className="footer-bottom">© 2026 PetHaven • Smart Way to Adopt, Simple Way to Love 💗</p>
      </footer>

    </div>
  );
}