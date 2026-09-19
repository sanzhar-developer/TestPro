const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
connectDB();


const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const testRoutes = require('./routes/testRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const User = require('./models/User');

app.use(express.json());
app.use(cors(({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
})));

app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/tests", testRoutes);
app.use("/attempts", attemptRoutes);


app.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});


