import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { doLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await doLogin(email, password);
      navigate("/profile");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Помилка входу");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 20,
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Вхід</h2>

        <label style={{ display: "block", marginTop: 12 }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Пароль</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}
          />
        </label>

        {error && <div style={{ marginTop: 12, color: "#b00020" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 10,
            border: 0,
            background: "#111",
            color: "white",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Входимо..." : "Увійти"}
        </button>

        <p style={{ marginTop: 12, fontSize: 14 }}>
          Немає акаунту? <Link to="/register">Зареєструватися</Link>
        </p>
      </form>
    </div>
  );
}
