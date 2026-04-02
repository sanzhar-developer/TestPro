const express = require('express');
const Router = express.Router();
const Question = require('../models/Question');
const authMiddleware = require('../middlewares/authMiddleware');

Router.post("/", authMiddleware, async (req, res) => {
    console.log("Тело запроса:", req.body);
    const {testId, text, options, type, points} = req.body;
    const data = req.body;
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }
        if (Array.isArray(data)) {
            const savedQuestions = await Question.insertMany(
                data.map(q => ({
                    ...q,
                    // Если в JSON нет testId, берем его из запроса (опционально)
                    testId: q.testId || req.body.testId 
                }))
            );
            return res.status(201).json(savedQuestions);
        } 
        if (!testId || !text || !options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ error: "Все поля обязательны!" });
        }
        const {testId, text, options, type, points} = req.body;
        const newQuestion = new Question({
            testId: testId,
            text: text.trim(),
            type: type || "single",
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