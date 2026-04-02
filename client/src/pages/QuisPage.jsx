import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/QuizPage.css';

const QuizBlock = () => {
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Теперь храним массив выбранных индексов для поддержки multiple
  const [selectedOptions, setSelectedOptions] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0); // Состояние для подсчета баллов
  const [attemptId, setAttemptId] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
useEffect(() => {
    const startTest = async () => {
        const res = await fetch(`http://localhost:5000/attempts/start/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setAttemptId(data.attemptId);
    };
    startTest();
}, [id]);
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/tests/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        setTest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTestData();
  }, [id]);

  if (loading) return <div className="quiz-container">Загрузка...</div>;
  if (error) return <div className="quiz-container">Ошибка: {error}</div>;
  
  const currentQuestion = test.questions[currentQuestionIndex];

  // Логика выбора ответа
  const handleOptionClick = (index) => {
    if (currentQuestion.type === 'multiple') {
      // Для множественного выбора: добавляем или удаляем из массива
      if (selectedOptions.includes(index)) {
        setSelectedOptions(selectedOptions.filter(i => i !== index));
      } else {
        setSelectedOptions([...selectedOptions, index]);
      }
    } else {
      // Для одиночного выбора: просто заменяем
      setSelectedOptions([index]);
    }
  };

  const handleNext = async () => {
    const newAnswer = {
        questionId: currentQuestion._id,
        selectedOptionIndex: selectedOptions
    }
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);
    console.log("Отправляем ответы:", updatedAnswers)
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptions([]); // Сброс для следующего вопроса
    } else {
      const res = await fetch(`http://localhost:5000/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: updatedAnswers})
      });
      if (res.ok) {
        navigate(`/results/${attemptId}`);
      }
      const data = await res.json();
      setScore(data.score);
      }
    }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="test-info">
            <h2 className="test-title">{test.title}</h2>
            {/* Показываем тип вопроса и баллы — это плюс к UX */}
            <span className="question-badge">
              {currentQuestion.type === 'multiple' ? 'Несколько ответов' : 'Один ответ'} 
              ({currentQuestion.points} б.)
            </span>
          </div>
          <div className="quiz-counter">
            <p>{currentQuestionIndex + 1} / {test.questions.length}</p>
          </div>
        </div>

        <div className="quiz-body">
          <h3 className="question-text">{currentQuestion.text}</h3>
          
          <div className="options-list">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOptions.includes(index);
              return (
                <div 
                  key={index} 
                  className={`option-item ${isSelected ? 'active' : ''} ${currentQuestion.type === 'multiple' ? 'checkbox-style' : ''}`}
                  onClick={() => handleOptionClick(index)}
                >
                  {/* Визуальный индикатор для multiple */}
                  <div className="selection-indicator">
                    {currentQuestion.type === 'multiple' ? (
                       <input type="checkbox" checked={isSelected} readOnly />
                    ) : (
                       <input type="radio" checked={isSelected} readOnly />
                    )}
                  </div>
                  <span className="option-text">{option.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="quiz-footer">
          <button 
            className="next-button" 
            onClick={handleNext} 
            disabled={selectedOptions.length === 0}
          >
            {currentQuestionIndex === test.questions.length - 1 ? "Завершить" : "Далее"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizBlock;