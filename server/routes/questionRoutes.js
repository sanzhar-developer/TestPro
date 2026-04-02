const express = require('express');
const Router = express.Router();
const Question = require('../models/Question');
const authMiddleware = require('../middlewares/authMiddleware');

Router.post("/", authMiddleware, async (req, res) => {
    console.log("Тело запроса:", req.body);
    
    // 1. Объявляем переменные один раз в начале
    const { testId, text, options, type, points } = req.body;
    const data = req.body;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }

        // Обработка массива вопросов
        if (Array.isArray(data)) {
            const savedQuestions = await Question.insertMany(
                data.map(q => ({
                    ...q,
                    // Используем testId из самого объекта вопроса или из корня запроса
                    testId: q.testId || testId 
                }))
            );
            return res.status(201).json(savedQuestions);
        } 

        // Валидация для одного вопроса
        if (!testId || !text || !options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ error: "Все поля обязательны!" });
        }

        // 2. УДАЛЕНО ПОВТОРНОЕ ОБЪЯВЛЕНИЕ (оно вызывало ошибку)

        const newQuestion = new Question({
            testId: testId,
            text: text.trim(),
            // Логика автоматического определения типа, если он не пришел
            type: type || (options.filter(o => o.isCorrect).length > 1 ? "multiple" : "single"),
            options,                
            points: points || 1
        });

        const savedQuestion = await newQuestion.save();
        return res.status(201).json(savedQuestion);
        
    } catch (error) {
        console.log("POST /question error:", error);
        res.status(500).json({ 
            error: "Ошибка при создании вопроса!",
            message: error.message
        });
    }
});

Router.get("/:testId", authMiddleware, async (req, res) => {
    const { testId } = req.params;
    try {
        const questions = await Question.find({ testId: testId });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

Router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedQuestion) {
            return res.status(404).json({ error: "Вопрос не найден!" });
        }
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при обновлении вопроса!" });
    }
});

Router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }
        const question = await Question.findByIdAndDelete(id);
        if (!question) {
            return res.status(404).json({ error: "Вопрос не найден!" });
        }
        res.json({ message: "Вопрос успешно удален!" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при удалении вопроса!" });
    }
});

module.exports = Router;