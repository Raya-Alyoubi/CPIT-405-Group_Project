import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="page auth-page">
      <h1 className="section-title">Register</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Register</button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
