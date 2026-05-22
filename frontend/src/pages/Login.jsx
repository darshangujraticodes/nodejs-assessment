import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data);

      alert("Login successful");

      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <div className="container">
        <h2 className="text-center">Login</h2>
        <input
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <br /> <br />
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
        <br />
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
