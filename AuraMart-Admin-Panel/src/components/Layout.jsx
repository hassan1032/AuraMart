import { Outlet } from "react-router-dom";
import { useState } from "react"; // Import useState
import Sidebar from "./pages/sidebar/Sidebar";
import Header from "./pages/header/Header";
import Footer from "./pages/footer/Footer";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <>
            <div className={`app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar ${!isSidebarOpen ? "" : "closed-sidebar closed-sidebar-mobile"}`}>
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <div className="app-main">
                    <Sidebar isSidebarOpen={isSidebarOpen} />

                    <div className="app-main-outer">
                        <div className="app-main-inner">
                            <Outlet />
                        </div>
                        <Footer isSidebarOpen={isSidebarOpen} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
