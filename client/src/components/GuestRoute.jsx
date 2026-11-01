import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function GuestRoute({ children }) {
    const { loading, user } = useAuth();

    if (loading) {
        return <div>Loading.....</div>
    }
    if (user) {
        return <Navigate to="/" replace />
    }

    return children;
}