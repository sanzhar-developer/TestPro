import { Link } from "react-router-dom";

function AddQuestionButton({testId, onClick }) {
    return (
        <Link to={`/add-question/${testId}`}> 
            <button
                onClick={onClick}
                style={{
                    background: '#6567e6',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
            >
                Добавить вопрос {}
            </button>
        </Link>
    );
}

export default AddQuestionButton;