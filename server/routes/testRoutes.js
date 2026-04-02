const express = require('express');
const Router = express.Router();
const Test = require('../models/Test');
const Question = require('../models/Question');
const authMiddleware = require('../middlewares/authMiddleware');

Router.post("/", authMiddleware, async (req, res) => {
    const {title, description, timeLimit} = req.body;
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }
        if (!title ) {
            return res.status(400).json({ error: "Название обязательна!" });
        }
        const newTest = new Test({
            title,
            description: description || "",
            timeLimit: timeLimit || 0,
            createdBy: req.user.userId
        });
        await newTest.save();
        res.status(201).json({ message: "Тест успешно создан!" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при создании теста!" });
    }
});

Router.get("/", authMiddleware, async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { isPublished: true };
        const tests = await Test.find(filter).select("title description timeLimit createdBy").populate("createdBy", "username");
        res.json(tests);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении тестов!" });
    }
});

Router.get("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const test = await Test.findById(id).populate("createdBy", "username");
        if (!test || (!test.isPublished && req.user.role !== "admin")) {
            return res.status(404).json({ error: "Тест не найден!" });
        }
        const questions = await Question.find({ testId: id });
        res.json({ ...test._doc, questions });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении теста!" });
    }
});


Router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }
        const test = await Test.findById(id);
        if (!test) {
            return res.status(404).json({ error: "Тест не найден!" });
        }
        await test.remove();
        res.json({ message: "Тест успешно удален!" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при удалении теста!" });
    }
});

Router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, description, timelimit} = req.body;
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }
        const test = await Test.findById(id);
        if (!test) {
            return res.status(404).json({ error: "Тест не найден!" });
        }
        test.title = title || test.title;
        test.description = description || test.description;
        test.timeLimit = timelimit || test.timeLimit;
        await test.save();
        res.json({ message: "Тест успешно обновлен!" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при обновлении теста!" });
    }
});

Router.patch("/:id/activate", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен!" });
        }
        const test = await Test.findById(id);
        if (!test) {
            return res.status(404).json({ error: "Тест не найден!" });
        }
        test.isPublished = !test.isPublished;
        await test.save();
        res.json({ message: `Тест успешно ${test.isPublished ? "опубликован" : "снят с публикации"}!` });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при изменении статуса теста!" });
    }
});
module.exports = Router;