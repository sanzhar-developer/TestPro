import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import TestsPage from "./pages/TestsPage";
import QuizBlock from "./pages/QuisPage";
import TestResult from "./pages/TestResult";
import Results from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";
import QuestionPage from "./pages/QuestionPage";
import CreateTestPage from "./pages/CreateTestPage";

function App() {
  return (
    <Routes>
      <Route path="*" element={<h1>404 - Страница не найдена</h1>} />
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/tests" element={<TestsPage />} />
      <Route path="/quiz/:id" element={<QuizBlock />} />
      <Route path="/results/:attemptId" element={<TestResult />} />
      <Route path="/results" element={<Results />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="add-question/:testId" element={<QuestionPage />} />
      <Route path="/create-test" element={<CreateTestPage />} />
    </Routes>
  );
}

export default App;