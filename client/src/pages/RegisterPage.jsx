import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import "../styles/AuthPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:5000/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      alert("Регистрация прошла успешно! Теперь вы можете войти.");

      setForm({
        username: "",
        email: "",
        password: "",
      });

      navigate("/login");
    }
  };

  return (
    <div className="page">
      <Header />

      <div className="main-section">
        <div className="auth-card">
          <div className="auth-inner">
            <h1 className="auth-title">Регистрация</h1>

            <form onSubmit={handleSubmit} className="auth-form">
              <label htmlFor="name">Имя</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Введите имя..."
                value={form.username}
                onChange={handleChange}
              />

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
                <Link to="/login" className="btn btn-outline">
                  Войти
                </Link>

                <button type="submit" className="btn btn-filled">
                  Зарегистрироваться
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;