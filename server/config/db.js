const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    
    const connString = MONGODB_URI;
    
    await mongoose.connect(connString);
    
    console.log("✅ MongoDB подключен успешно!");
  } catch (error) {
    console.error("❌ Ошибка подключения к БД:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;