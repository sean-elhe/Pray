import { useState } from "react";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleSubmit = async () => {
    try {
      const url =
        mode === "login"
          ? "http://localhost:3001/auth/login"
          : "http://localhost:3001/auth/register";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      if (mode === "login") {
        await login(name, pin);
      } else {
        alert("Account created! You can now log in.");
        setMode("login");
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="password"
        placeholder="4-digit PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {mode === "login" ? "Login" : "Create Account"}
      </button>

      <p style={{ marginTop: 10 }}>
        {mode === "login" ? (
          <>
            No account?{" "}
            <button onClick={() => setMode("register")}>Register</button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setMode("login")}>Login</button>
          </>
        )}
      </p>
    </div>
  );
}
