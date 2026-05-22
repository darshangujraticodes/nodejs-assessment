import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", form);

      alert(res.data.message || "Registered successfully");

      // redirect to login after register
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Student Registration</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />{" "}
      <br /> <br />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <br /> <br />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <br /> <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
