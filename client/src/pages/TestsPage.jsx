import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HomeHeader from "../components/HomeHeader";
import "../styles/TestPage.css";
import PublishButton from "../components/PublishButton";
import AddQuestionForm from "../components/AddQuestionForm";
const API_URL = import.meta.env.VITE_API_URL || "https://testpro-production.up.railway.app";

function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTestId, setActiveTestId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === 'admin';
  const fetchTests = async () => {
        const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/tests`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        }
        );
        const data = await response.json();

        if (response.ok) {
          setTests(data);
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchTests();
  }, []);

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase())
  );
  

  return (
    <>
      <div className="tests-page">
      <HomeHeader />

      <main className="tests-main">
        <section className="tests-hero">
          <h1>Доступные тесты</h1>
          <p>Выберите тест и проверьте свои знания</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск по тестам"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section className="tests-grid">
          {loading ? (
            <p className="status-text">Загрузка...</p>
          ) : filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div key={test._id} className="test-card">
                <h3>{test.title}</h3>

                <p>{test.description || "Без описания"}</p>

                <p className="test-meta">
                  ⏱ {test.timeLimit || "Без лимита"} мин
                </p>

                <p className="test-meta">
                  👤 {test.createdBy?.username || "Неизвестно"}
                </p>
                {isAdmin && !test.isPublished && (
                  <PublishButton 
                    testId={test._id} 
                    onSuccess={fetchTests} // Перезагружаем список после публикации
                  />
                )}
                {isAdmin && (
                  <button 
                    className="add-btn-toggle"
                    onClick={() => setActiveTestId(activeTestId === test._id ? null : test._id)}
                  >
                    {activeTestId === test._id ? "Закрыть форму" : "Добавить вопрос"}
                  </button>
                )}
                {activeTestId === test._id && isAdmin && (
                  <div className="inline-form-wrapper">
                    <AddQuestionForm 
                      testId={test._id}
                      refreshTest={fetchTests}
                    />
                  </div>
                )}
                <Link to={`/quiz/${test._id}`} className="start-btn">
                  Начать тест
                </Link>
          
              </div>
            ))
          ) : (
            <>
            <p className="status-text">Тесты не найдены</p>
            <button 
              className="btn btn-filled" 
              onClick={() => navigate("/create-test")}
            >
              Создать первый тест
            </button>
            </>
            
          )}
        </section>
      </main>
    </div>
    </>
    
  );
}

export default TestsPage;