const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Используем только ОДИН вызов. 
    // Если .env не работает, временно вставляем строку сюда напрямую:
    const connString = process.env.MONGO_URI || "mongodb://sanzhar:sanzhar123@ac-ngxxnmm-shard-00-00.rwvmwrx.mongodb.net:27017,ac-ngxxnmm-shard-00-01.rwvmwrx.mongodb.net:27017,ac-ngxxnmm-shard-00-02.rwvmwrx.mongodb.net:27017/?ssl=true&replicaSet=atlas-11hhev-shard-0&authSource=admin&appName=Cluster192";
    
    await mongoose.connect(connString);
    
    console.log("✅ MongoDB подключен успешно!");
  } catch (error) {
    console.error("❌ Ошибка подключения к БД:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;