export default function PetCard({ pet }) {
  return (
    <div className="card">
      <img
        src={pet.foto_url}
        alt={pet.nama_hewan}
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h3>{pet.nama_hewan}</h3>
      <p>{pet.jenis}</p>
    </div>
  );
}