import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { user, doLogout } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          padding: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>Профіль</h2>

        <div style={{ marginTop: 16, lineHeight: 1.8 }}>
          <div>
            Імʼя: <b>{user?.name}</b>
          </div>
          <div>
            Email: <b>{user?.email}</b>
          </div>
          <div>
            Email підтверджено: <b>{user?.is_email_verified ? "Так" : "Ні"}</b>
          </div>
        </div>

        <button
          onClick={doLogout}
          style={{
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Вийти
        </button>
      </div>
    </div>
  );
}
