const Question = require("../models/Question");

async function calculateScore(testId, answers) {
  const safeAnswers = Array.isArray(answers) ? answers : [];
  const questions = await Question.find({ testId });

  let score = 0;
  let correctAnswersCount = 0; // ИСПРАВЛЕНО: Объявили переменную правильно
  let totalPoints = 0;

  for (const question of questions) {
    totalPoints += question.points;

    const userAnswer =safeAnswers.find(
      (a) => a.questionId.toString() === question._id.toString()
    );

    if (!userAnswer) {
      console.log(`Ответ для вопроса ${question._id} не найден в присланном массиве`)
      continue;
    }
    const rawIndexes = userAnswer.selectedOptionIndex || 
                       userAnswer.selectedOptions || 
                       userAnswer.newAnswer?.selectedOptions || [];
    const userSelected = userAnswer.selectedOptionIndex || userAnswer.selectedOptions || [];
    const correctIndexes = question.options
      .map((option, index) => (option.isCorrect ? index : -1))
      .filter((index) => index !== -1)
      .sort((a, b) => a - b);

    // ИСПРАВЛЕНО: Убрана лишняя 'es' в названии поля
    const selectedIndexes = Array.isArray(userAnswer.selectedOptionIndex) 
      ? userAnswer.selectedOptionIndex.map(index => Number(index)).sort((a, b) => a - b) 
      : [];
    console.log(`Вопрос: ${question._id}`);
    console.log(`Правильные индексы: ${correctIndexes}`);
    console.log(`Ответ пользователя: ${selectedIndexes}`);
    
    const isCorrect =
      correctIndexes.length === selectedIndexes.length &&
      correctIndexes.every((value, index) => value === selectedIndexes[index]);
    
      console.log(`Итог: ${isCorrect}`);
    if (isCorrect) {
      score += question.points;
      correctAnswersCount += 1; // ИСПРАВЛЕНО: Используем верное имя
    }
  }

  const totalQuestions = questions.length;
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  return {
    score,
    totalPoints,
    correctAnswers: correctAnswersCount, // ИСПРАВЛЕНО: Теперь переменная существует
    totalQuestions,
    percentage,
  };
}

module.exports = calculateScore;