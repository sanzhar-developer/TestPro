const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Текст варианта обязателен"],
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "testId обязателен"],
    },
    text: {
      type: String,
      required: [true, "Текст вопроса обязателен"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["single", "multiple"],
      default: "single",
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: function (value) {
          return value.length >= 2;
        },
        message: "У вопроса должно быть минимум 2 варианта ответа",
      },
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);