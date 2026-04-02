const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

Router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Все поля должны быть заполнены!" });
    }
    try {
        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({ error: "Пользователь с таким email уже существует!" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role: "student" });
        await newUser.save();
        res.status(201).json({ message: "Пользователь успешно зарегистрирован!" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера!" });
    }
});

Router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Все поля должны быть заполнены!" });
    }
    try {
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ error: "Пользователь с таким email не существует!" });
        }
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Неверный пароль!" });
        }
        const token = jwt.sign(
        {
            userId: findUser._id,
            role: findUser.role
        },
        JWT_SECRET,
        { expiresIn: "1h" }
        );
        res.json({
            token,
            user: {
                id: findUser._id,
                username: findUser.username,
                role: findUser.role
            } 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Ошибка сервера!", message: error.message });
    }
});

Router.put("/update", authMiddleware, async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findById(req.user.userId);

  if (username) user.username = username;
  if (email) user.email = email;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  
  res.json({
    message: "Обновлено",
    user: { id: user._id, username: user.username, email: user.email, role: user.role }
  });
});
module.exports = Router;