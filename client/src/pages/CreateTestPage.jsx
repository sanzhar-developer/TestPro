import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateTest.css"; // Можно использовать те же стили или создать новые

const API_URL = import.meta.env.VITE_API_URL || "https://testpro-production.up.railway.app";

function CreateTestPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  // Добавить новый пустой вопрос
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  // Изменение текста вопроса или вариантов
  const handleQuestionChange = (index, field, value, optionIndex = null) => {
    const newQuestions = [...questions];
    if (field === "option") {
      newQuestions[index].options[optionIndex] = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Если у тебя есть авторизация

    try {
      const response = await fetch(`${API_URL}/tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ title, description, questions }),
      });

      if (response.ok) {
        alert("Тест успешно создан!");
        navigate("/tests");
      } else {
        alert("Ошибка при создании теста");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
    }
  };

  return (
    <div className="page" style={{ padding: "20px" }}>
      <h1 className="auth-title">Создание нового теста</h1>
      <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <label>Название теста</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Например: Основы JavaScript"
          required 
        />

        <label>Описание</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="О чем этот тест?"
        />

        <hr />

        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ marginBottom: "30px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <h3>Вопрос №{qIndex + 1}</h3>
            <input 
              type="text" 
              placeholder="Введите текст вопроса" 
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
              required
            />
            
            <div style={{ marginTop: "10px" }}>
              <label>Варианты ответов (отметьте правильный):</label>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                  <input 
                    type="radio" 
                    name={`correct-${qIndex}`} 
                    checked={q.correctAnswer === oIndex}
                    onChange={() => handleQuestionChange(qIndex, "correctAnswer", oIndex)}
                  />
                  <input 
                    type="text" 
                    placeholder={`Вариант ${oIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleQuestionChange(qIndex, "option", e.target.value, oIndex)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="auth-buttons">
          <button type="button" onClick={addQuestion} className="btn btn-outline">
            + Добавить вопрос
          </button>
          <button type="submit" className="btn btn-filled">
            Опубликовать тест
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTestPage;