import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";


export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();


        setError("");

        if (!form.email || !form.password) {
            setError("Please fill the fields");
            return;
        }

        try {
            console.log("2. Before setting loading");
            setLoading(true);


            await login(form.email, form.password);


            navigate("/", { replace: true });

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to login. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-heading">
                    <h1>Welcome Back</h1>
                    <h1>Login to continue to TaskFlow.</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your.mail@example.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Your Password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in...." : "Log In"}
                    </button>
                </form>

                <p className="auht-footer">
                    Don't Have an account?{" "}
                    <Link to="/register">Create Accountr</Link>
                </p>
            </div>
        </div>
    )
}