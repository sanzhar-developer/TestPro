const Question = require("../models/Question");

async function calculateScore(testId, answers) {
  const safeAnswers = Array.isArray(answers) ? answers : [];
  const questions = await Question.find({ testId });

  let score = 0;
  let correctAnswersCount = 0; 
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
    const correctIndexes = question.options
      .map((option, index) => (option.isCorrect ? index : -1))
      .filter((index) => index !== -1)
      .sort((a, b) => a - b);

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
      correctAnswersCount += 1; 
    }
  }

  const totalQuestions = questions.length;
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  return {
    score,
    totalPoints,
    correctAnswers: correctAnswersCount, 
    totalQuestions,
    percentage,
  };
}

module.exports = calculateScore;