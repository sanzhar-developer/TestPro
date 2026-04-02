import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { FaListUl } from "react-icons/fa";
import { PiTrophyLight } from "react-icons/pi";
import "../styles/HomeHeader.css";

function Header() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : "U"



  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/home" className="logo">
          <span className="logo-icon">📖</span>
          <span className="logo-text">TestPro</span>
        </Link>

        <nav className="nav">
          <Link to="/home" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            <HiOutlineHome />
            <span>Главная</span>
          </Link>

          <Link
            to="/tests"
            className={`nav-link ${isActive("/tests") ? "active" : ""}`}
          >
            <FaListUl />
            <span>Тесты</span>
          </Link>

          <Link
            to="/results"
            className={`nav-link ${isActive("/results") ? "active" : ""}`}
          >
            <PiTrophyLight />
            <span>Результаты</span>
          </Link>
          <Link to="/profile" className="profile-item">
            <div className="avatar-circle">
              {firstLetter}
            </div>
            <span className="profile-label">Профиль</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;