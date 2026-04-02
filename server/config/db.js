const mongoose = require("mongoose");
console.log("MONGO_URI:", process.env.MONGO_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB подключен");
  } catch (error) {
    console.error("Ошибка подключения к БД:", error);
    process.exit(1);
  }
};

module.exports = connectDB;