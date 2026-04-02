import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TestResult.css'; // Импорт стилей

const Results = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/attempts/${attemptId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Не удалось загрузить результаты');
                const data = await response.json();
                setResult(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [attemptId]);

    if (loading) return <div className="results-container">Загрузка...</div>;
    if (error) return <div className="results-container">Ошибка: {error}</div>;

    const getScoreColor = (percent) => {
        if (percent >= 80) return '#4caf50';
        if (percent >= 50) return '#ff9800';
        return '#f44336';
    };

    return (
        <div className="results-container">
            <div className="results-card">
                <h1 className="results-title">Тест завершен!</h1>
                <h2 className="results-test-title">{result.testId?.title}</h2>
                
                <div className="results-stats-container">
                    <div className="results-stat-box">
                        <span className="results-stat-label">Баллы</span>
                        <span className="results-stat-value">{result.score} / {result.totalPoints}</span>
                    </div>
                    <div className="results-stat-box">
                        <span className="results-stat-label">Верно</span>
                        <span className="results-stat-value">{result.correctAnswers} / {result.totalQuestions}</span>
                    </div>
                </div>

                <div className="results-progress-wrapper">
                    <div 
                        className="results-progress-bar" 
                        style={{ 
                            width: `${result.percentage}%`, 
                            backgroundColor: getScoreColor(result.percentage) 
                        }} 
                    />
                </div>

                <p className="results-percentage" style={{ color: getScoreColor(result.percentage) }}>
                    {result.percentage}%
                </p>

                <div className="results-info">
                    <p>Студент: <strong>{result.userId?.username}</strong></p>
                    <p>Завершено: {new Date(result.finishedAt).toLocaleString()}</p>
                </div>

                <button className="results-button" onClick={() => navigate('/home')}>
                    На главную
                </button>
            </div>
        </div>
    );
};

export default Results;