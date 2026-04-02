import { Link } from "react-router-dom";
import HomeHeader from "../components/HomeHeader";
import "../styles/MainPage.css";

function MainPage() {
  return (
    <div className="home-page">
      <HomeHeader />

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-badge">⚡ Образовательная платформа</div>

          <h1 className="hero-title">Система онлайн-тестирования</h1>

          <p className="hero-text">
            Проверьте свои знания в программировании, веб-разработке и
            алгоритмах. Получайте мгновенные результаты и отслеживайте свой
            прогресс.
          </p>

          <div className="hero-buttons">
            <Link to="/tests" className="hero-btn hero-btn-filled">
              Начать тест
            </Link>

            <Link to="/results" className="hero-btn hero-btn-outline">
              Посмотреть результаты
            </Link>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Возможности платформы</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Разнообразные тесты</h3>
              <p>
                Проходите тесты по разным темам: JavaScript, React, Node.js,
                алгоритмы и базы данных.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Точная оценка</h3>
              <p>
                Система автоматически проверяет ответы и показывает итоговый
                результат сразу после завершения.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Быстрое прохождение</h3>
              <p>
                Удобный интерфейс позволяет сосредоточиться только на вопросах и
                не тратить время зря.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Отслеживание прогресса</h3>
              <p>
                Сохраняйте результаты, сравнивайте попытки и наблюдайте за своим
                ростом.
              </p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Готовы проверить свои знания?</h2>
          <p>
            Начните прямо сейчас и узнайте свой уровень подготовки за несколько
            минут.
          </p>

          <Link to="/tests" className="cta-btn">
            Перейти к тестам
          </Link>
        </section>
      </main>
    </div>
  );
}

export default MainPage;