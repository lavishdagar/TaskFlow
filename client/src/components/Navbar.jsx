import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();



    const navigate = useNavigate();

    const handlelogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="navbar">
            <div>
                <h3>
                    Welcome {user?.name}
                </h3>
            </div>
            <button onClick={handlelogout}>
                Logout
            </button>
        </header>
    )
}
