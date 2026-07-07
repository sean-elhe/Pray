import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import "./loginmodal.css";

type LoginModalProps = {
  close: () => void;
};

export default function LoginModal({ close }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  const { login } = useAuth();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url =
        mode === "register"
          ? "http://localhost:3001/auth/register"
          : "http://localhost:3001/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, pin }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Request failed");

      if (mode === "register") {
        alert("Account created! You can now log in.");
        setMode("login");
      } else {
        await login(name, pin);
        close();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>
          ✕
        </button>

        <h2>{mode === "register" ? "Create account" : "Log in"}</h2>

        <p className="subtitle">
          {mode === "register"
            ? "Create an account to save your prayers."
            : "Log in to continue."}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                mode === "register"
                  ? "Choose a username"
                  : "Enter your username"
              }
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={
                mode === "register" ? "Choose a 4 digit PIN" : "Enter your PIN"
              }
            />
          </div>

          <button className="primary-button">
            {mode === "register" ? "Create Account" : "Log In"}
          </button>
        </form>

        <div className="divider" />

        <button
          className="switch-mode"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "register" ? (
            <>
              Already have an account?
              <span> Log In</span>
            </>
          ) : (
            <>
              Don't have an account?
              <span> Create Account</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
