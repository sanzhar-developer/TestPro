import { useNavigate } from "react-router-dom";

function LogOutButton() {
    const navigate = useNavigate();
    function handlelogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }
    return <button onClick={handlelogout}>Выйти</button>;
}
export default LogOutButton;