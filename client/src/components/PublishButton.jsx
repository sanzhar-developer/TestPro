import React from 'react';
import {APIFetch} from "../components/APIFetch";

const PublishButton = ({ testId, isPublished, onSuccess }) => {
  // Получаем данные пользователя для проверки роли
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const isAdmin = user?.role === 'admin';

  // Если не админ или тест уже опубликован — ничего не рендерим
  if (!isAdmin || isPublished) return null;

  const handlePublish = async () => {

    try {
      const response = await APIFetch(`/tests/${testId}/activate`, {
        method: "PATCH", // Обычно публикация — это обновление статуса (PATCH или PUT)
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        alert("Тест успешно опубликован!");
        if (onSuccess) onSuccess(); // Вызываем обновление списка тестов в TestsPage
      } else {
        const data = await response.json();
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error("Ошибка при публикации:", error);
      alert("Не удалось связаться с сервером");
    }
  };

  return (
    <button
      onClick={handlePublish}
      className="publish-btn"
      style={{
        background: '#6567e6',
        color: 'white',
        border: 'none',
        padding: '12px 20px', // Увеличили отступы для солидности
        borderRadius: '10px', // Мягкое закругление под стиль карточек
        cursor: 'pointer',
        marginTop: '10px',
        fontSize: '16px',     // Крупный читаемый текст
        fontWeight: '600',    // Полужирный шрифт
        width: '100%',        // Растягиваем на всю ширину карточки
        transition: '0.3s'    // Плавность
      }}
    >
      Опубликовать тест
    </button>
  );
};

export default PublishButton;