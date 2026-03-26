import "./toast.css";

export default function Toast({ message, show }) {
  return (
    <div className={`toast ${show ? "show" : ""}`}>
      <p>{message}</p>
    </div>
  );
}