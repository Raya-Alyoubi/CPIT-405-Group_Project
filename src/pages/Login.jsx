import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="page auth-page">
      <h1 className="section-title">Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Login</button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
