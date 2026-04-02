import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../styles/HomePage.css";

function HomePage() {
  return (
    <div className="page">
      <Header />

      <main className="hero">
        <div className="hero-card">
          <h1>Добро пожаловать в систему онлайн-тестирования</h1>
          <p>
            Проходите тесты, отслеживайте результаты и управляйте учебным
            процессом в одном месте.
          </p>

          <div className="button-group">
            <Link to="/login" className="btn btn-filled">
              Войти
            </Link>

            <Link to="/register" className="btn btn-outline">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;