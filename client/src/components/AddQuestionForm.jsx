import React, { useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL || "https://testpro-production.up.railway.app";

import "../styles/AddQuestionForm.css"; 

const AddQuestionForm = ({ testId, refreshTest }) => {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
    ]);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'admin') return null;

    const addOption = () => {
        setOptions([...options, { text: "", isCorrect: false }]);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    // УЛУЧШЕНО: Теперь можно выбирать несколько правильных ответов
    const handleCorrectChange = (index) => {
        const newOptions = [...options];
        newOptions[index].isCorrect = !newOptions[index].isCorrect;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        // Валидация: проверяем, что выбран хотя бы один правильный ответ
        const hasCorrect = options.some(opt => opt.isCorrect);
        if (!hasCorrect) {
            alert("Пожалуйста, выберите хотя бы один правильный ответ.");
            return;
        }

        const payload = {
            testId, 
            text: questionText,
            // Фильтруем пустые текстовые поля перед отправкой
            options: options.filter(opt => opt.text.trim() !== "") 
        };

        try {
            const response = await fetch(`${API_URL}/questions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setQuestionText("");
                setOptions([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
                if (typeof refreshTest === 'function') {
                    refreshTest();
                } 
                alert("Вопрос успешно добавлен!");
            }
        } catch (err) {
            console.error("Ошибка добавления:", err);
        }
    };

    return (
        <div className="add-question-container">
            <h3>Добавить новый вопрос</h3>
            <form onSubmit={handleSubmit}>
                <div className="question-input-group">
                    <label>Текст вопроса</label>
                    <input 
                        className="auth-input"
                        value={questionText} 
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Введите текст вопроса..."
                        required
                    />
                </div>

                <div className="options-list">
                    <label>Варианты ответов (отметьте все правильные)</label>
                    {options.map((option, index) => (
                        <div key={index} className="option-row"> {/* Используем общий класс для строк */}
                            <input 
                                type="checkbox" // ЗАМЕНЕНО: Чекбокс вместо радио
                                checked={option.isCorrect}
                                onChange={() => handleCorrectChange(index)}
                            />
                            <input 
                                type="text" 
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Вариант ${index + 1}`}
                                required
                            />
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={addOption}>
                        + Вариант
                    </button>
                    <button type="submit" className="btn btn-filled">
                        Сохранить вопрос
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddQuestionForm;