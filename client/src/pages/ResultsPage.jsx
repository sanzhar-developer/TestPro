import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResultsPage.css';
import HomeHeader from "../components/HomeHeader";
const API_URL = import.meta.env.VITE_API_URL || "https://testpro-production.up.railway.app";

const ResultsPage = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/attempts/my-attempts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                
                // Безопасная установка данных: проверяем, что пришел массив
                setAttempts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
                setAttempts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAttempts();
    }, []);

    if (loading) return <div className="loader">Загрузка...</div>;

    // СОСТОЯНИЕ 1: Попыток нет (Белый блок-заглушка по центру)
    if (attempts.length === 0) {
        return (
            <div className="results-page-container">
                <HomeHeader />
                <div className="results-wrapper">
                    <div className="empty-state-card">
                        <div className="trophy-icon">🏆</div>
                        <h1 className="empty-title">Результатов пока нет</h1>
                        <p className="empty-text">Пройдите тесты, чтобы увидеть свои результаты здесь</p>
                        <button className="primary-btn" onClick={() => navigate('/tests')}>
                            Перейти к тестам
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // СОСТОЯНИЕ 2: Попытки есть (Белый блок-подложка со списком)
    return (
        <div className="results-page-container">
            <HomeHeader />
            <div className="results-wrapper">
                {/* Тот самый белый блок на фоне */}
                <div className="results-content-holder">
                    
                    <h1 className="page-title">Мои результаты</h1>
                    
                    <div className="attempts-list">
                        {attempts.map((attempt) => (
                            <div 
                                key={attempt._id} 
                                className="attempt-item" 
                                onClick={() => navigate(`/results/${attempt._id}`)}
                            >
                                <div className="attempt-info">
                                    <h3>{attempt.testId?.title || "Удаленный тест"}</h3>
                                    {/* Обработка даты: если данных нет, выведет текущую вместо 1970 */}
                                    <span>
                                        {attempt.finishedAt 
                                            ? new Date(attempt.finishedAt).toLocaleDateString() 
                                            : "Дата не указана"}
                                    </span>
                                </div>
                                <div className="attempt-score">
                                    <span className={`score-badge ${attempt.percentage >= 50 ? 'high' : 'low'}`}>
                                        {attempt.score} / {attempt.totalPoints} ({attempt.percentage}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResultsPage;