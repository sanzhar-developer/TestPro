import React, { useState } from 'react';
import {useParams} from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "https://testpro-production.up.railway.app";

import "../styles/AddQuestionForm.css"; // Путь к твоему новому CSS

const AddQuestionForm = ({ testId, refreshTest }) => {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: true }, // По умолчанию первый вариант правильный
        { text: "", isCorrect: false }
    ]);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'admin') return null;

    // Добавление пустого варианта ответа
    const addOption = () => {
        setOptions([...options, { text: "", isCorrect: false }]);
    };

    // Обновление текста конкретного варианта
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    // Выбор правильного ответа (только один может быть true)
    const handleCorrectChange = (index) => {
        const newOptions = options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index
        }));
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const payload = {
            testId, // Передаем ID теста, к которому крепим вопрос
            text: questionText,
            options: options.filter(opt => opt.text.trim() !== "") // Убираем пустые варианты
        };
        console.log("Отправляем данные:", payload);

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
                setOptions([{ text: "", isCorrect: true }, { text: "", isCorrect: false }]);
                if (typeof refreshTest === 'function') {
                    refreshTest();
                } 
                alert("Вопрос добавлен!");
            }
        } catch (err) {
            console.error("Ошибка добавления:", err);
        }
    };

    return (
        <>
        <div className="add-question-container">
            
            <h3>Добавить новый вопрос</h3>
            <form onSubmit={handleSubmit}>
                <div className="question-input-group">
                    <label>Текст вопроса</label>
                    <input 
                        value={questionText} 
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Например: Чему равно 2 + 2?"
                        required
                    />
                </div>

                <div className="options-list">
                    <label>Варианты ответов (отметьте правильный)</label>
                    {options.map((option, index) => (
                        <div key={index} className="answer-option">
                            <input 
                                type="radio" 
                                name="correct-answer" 
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
                    <button type="button" className="btn-add-option" onClick={addOption}>
                        + Вариант
                    </button>
                    <button type="submit" className="btn-save-question">
                        Сохранить вопрос
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default AddQuestionForm;