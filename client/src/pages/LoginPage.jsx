import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import "../styles/AuthPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handlelogin = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:5000/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } else {
      alert("Неверный email или пароль");
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  return (
    <div className="page">
      <Header />

      <div className="main-section">
        <div className="auth-card">
          <div className="auth-inner">
            <h1 className="auth-title">Войти</h1>

            <form onSubmit={handlelogin} className="auth-form">
              <label htmlFor="email">Электронная почта</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Введите почту..."
                value={form.email}
                onChange={handleChange}
              />

              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Введите пароль..."
                value={form.password}
                onChange={handleChange}
              />

              <div className="auth-buttons">
                <Link to="/register" className="btn btn-outline">
                  Зарегистрироваться
                </Link>

                <button type="submit" className="btn btn-filled">
                  Войти
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;