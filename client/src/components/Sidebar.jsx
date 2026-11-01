import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>TaskFlow</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" end>
                    Dashboard
                </NavLink>
                <NavLink to="/projects">
                    Projects
                </NavLink>
            </nav>
        </aside>
    )
}