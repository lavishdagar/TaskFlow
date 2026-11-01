import { Outlet } from "react-router-dom";

import Navbar from './Navbar.jsx';;
import Sidebar from './SideBar.jsx';


export default function AppLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>

        </div>
    );
}