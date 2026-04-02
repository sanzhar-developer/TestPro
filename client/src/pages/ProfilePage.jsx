import React, { useState } from "react";
import HomeHeader from "../components/HomeHeader";
import "../styles/ProfilePage.css"; // Не забудьте создать этот файл

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "" 
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch("http://localhost:5000/auth/update", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        // Обновляем локальные данные, чтобы изменения отразились в хеадере
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Данные успешно обновлены!");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Ошибка при обновлении");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка сети");
    }
  };

  return (
    <div className="profile-page">
      <HomeHeader />
      
      <main className="profile-main">
        <div className="profile-card">
          {/* Большая аватарка для персонализации */}
          <div className="profile-avatar-big">
            {formData.username ? formData.username.charAt(0).toUpperCase() : "?"}
          </div>

          <h2>Настройки профиля</h2>

          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label>Имя пользователя</label>
              <input 
                type="text"
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})} 
                placeholder="Введите имя..."
                required
              />
            </div>

            <div className="form-group">
              <label>Электронная почта</label>
              <input 
                type="email"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="example@mail.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Новый пароль</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})} 
                placeholder="Оставьте пустым, если не хотите менять"
              />
            </div>

            <button type="submit" className="save-btn">
              Сохранить изменения
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;