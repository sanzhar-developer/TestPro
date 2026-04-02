import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateTest.css"; 

const API_URL = import.meta.env.VITE_API_URL || "https://testpro-production.up.railway.app";

function CreateTestPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    // Теперь correctAnswer — это массив []
    { questionText: "", options: ["", "", "", ""], correctAnswer: [] }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: [] }]);
  };

  const handleQuestionChange = (index, field, value, optionIndex = null) => {
    const newQuestions = [...questions];
    
    if (field === "option") {
      newQuestions[index].options[optionIndex] = value;
    } else if (field === "toggleCorrectAnswer") {
      // Логика для чекбоксов: добавить или удалить индекс из массива
      const currentAnswers = newQuestions[index].correctAnswer;
      if (currentAnswers.includes(optionIndex)) {
        newQuestions[index].correctAnswer = currentAnswers.filter(i => i !== optionIndex);
      } else {
        newQuestions[index].correctAnswer = [...currentAnswers, optionIndex];
      }
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Валидация: хотя бы один правильный ответ выбран
    const isValid = questions.every(q => q.correctAnswer.length > 0);
    if (!isValid) {
      alert("В каждом вопросе должен быть выбран хотя бы один правильный ответ!");
      return;
    }

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
    <div className="page">
      <h1 className="auth-title">Создание теста (мультивыбор)</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        
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
          <div key={qIndex} className="question-block">
            <h3>Вопрос №{qIndex + 1}</h3>
            <input 
              type="text" 
              placeholder="Введите текст вопроса" 
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
              required
            />
            
            <div className="options-container">
              <label>Варианты ответов (отметьте все правильные):</label>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="option-row">
                  {/* ЗАМЕНЕНО НА CHECKBOX */}
                  <input 
                    type="checkbox" 
                    checked={q.correctAnswer.includes(oIndex)}
                    onChange={() => handleQuestionChange(qIndex, "toggleCorrectAnswer", null, oIndex)}
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