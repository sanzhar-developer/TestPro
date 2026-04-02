const express = require('express');
const Router = express.Router();
const Attempt = require('../models/Attempt');
const Test = require('../models/Test');
const authMiddleware = require('../middlewares/authMiddleware');
const calculateScore = require('../utils/calculateScore');

Router.post("/start/:testid", authMiddleware, async (req, res) => {
    const {testid} = req.params;
    try {
        const newAttempt = new Attempt({
            userId: req.user.userId,
            testId: testid,
            answers: [],
            score: 0,
            completed: false
        });
        await newAttempt.save();
        res.status(201).json({message: "Тест начат!", attemptId: newAttempt._id});
    } catch (error) {
        res.status(500).json({error: "Ошибка при начале теста!"});
    }
});
    
Router.post("/:attemptid/submit", authMiddleware, async (req, res) => {
    const { attemptid } = req.params;
    const { answers } = req.body;
    console.log("BASE DEBUG: answers received:", answers);
    console.log("DEBUG PAYLOAD:", JSON.stringify(answers, null, 2));

    try {
        const attempt = await Attempt.findById(attemptid);
        if (!attempt) {
            return res.status(404).json({ error: "Попытка не найдена!" });
        }

        // Проверка владельца
        if (attempt.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }

        // Проверка статуса (используем status, так как он есть в твоей схеме)
        if (attempt.status === "completed" || attempt.completed) {
            return res.status(400).json({ error: "Тест уже завершен!" });
        }

        // Вызов функции подсчета
        const result = await calculateScore(attempt.testId, answers);

        // Обновление данных попытки
        attempt.answers = answers;
        attempt.score = result.score;
        attempt.totalPoints = result.totalPoints;
        attempt.correctAnswers = result.correctAnswers;
        attempt.totalQuestions = result.totalQuestions;
        attempt.percentage = result.percentage;
        attempt.status = "completed";
        attempt.completed = true; // На всякий случай обновляем оба поля
        attempt.finishedAt = Date.now();

        await attempt.save();
        
        res.json({ 
            message: "Тест завершен!", 
            score: attempt.score,
            percentage: attempt.percentage 
        });

    } catch (error) {
        // КРИТИЧЕСКИ ВАЖНО: посмотри на этот вывод в терминале VS Code!
        console.error("ОШИБКА ПРИ ЗАВЕРШЕНИИ ТЕСТА:", error); 
        
        res.status(500).json({ 
            error: "Ошибка при завершении теста!", 
            details: error.message // Выводим детали ошибки для отладки
        });
    }
});
Router.get("/my-attempts", authMiddleware, async (req, res) => {
    try {
        const attempts = await Attempt.find({ userId: req.user.userId }).populate("testId", "title").sort({ finishedAt: -1 });
        res.json(attempts);
    } catch (error) {
        console.error("ОШИБКА ПРИ ПОЛУЧЕНИИ ПОПЫТОК:", error);
        res.status(500).json({error: "Ошибка при получении попыток!"});
    }
});
Router.get("/:attemptId", authMiddleware, async (req, res) => {
    try {
        const attempt = await Attempt.findById(req.params.attemptId).populate('testId');
        if (!attempt) return res.status(404).json({ error: "Попытка не найдена" });
        res.json(attempt);
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


module.exports = Router;