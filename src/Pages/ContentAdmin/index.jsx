import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Pages
import FlaggedContent from "./pages/FlaggedContent";
import ModerationHistory from "./pages/ModerationHistory";
import ModerationQueue from "./pages/ModerationQueue";
import CategoryManagement from "./pages/CatagoryManagement"; // Note: Check spelling 'Catagory' vs 'Category'
import ViewProducts from "./pages/ViewProducts";
import ViolationReports from "./pages/ViolationReports";

export default function ContentAdminDashboard() {
    const [activePage, setActivePage] = useState("queue");
    const [stats, setStats] = useState({ pendingReports: 0 });
    const [toast, setToast] = useState(null);
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    // 1. Fetch Dashboard Stats (For Sidebar Badges)
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/ContentAdmin/stats`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats({ pendingReports: data.pendingReports || 0 });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, [token, activePage]); // Refresh stats when page changes

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // 2. Dynamic Router (Tutorials Removed)
    const renderContent = () => {
        switch (activePage) {
            case "queue":
                return <ModerationQueue onAction={(msg) => showToast(msg)} />;
            case "flagged":
                return <FlaggedContent showToast={showToast} />;
            case "categories":
                return <CategoryManagement showToast={showToast} />;
            case "products":
                return <ViewProducts />;
            case "history":
                return <ModerationHistory />; // Now fetches its own data
            case "reports":
                return <ViolationReports showToast={showToast} />;
            default:
                return <ModerationQueue />;
        }
    };

    return (
        <div className="flex min-h-screen w-screen bg-[#F8FAFC] text-slate-900 bg-gradient-to-br from-slate-50 to-blue-50">
            {/* SIDEBAR - Dynamic Counts */}
            <Sidebar
                setActivePage={setActivePage}
                activePage={activePage}
                queueCount={stats.pendingReports} 
                onLogout={handleLogout}
            />

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header moderatorName="Admin" />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderContent()}
                </main>
            </div>

            {/* TOAST */}
            {toast && (
                <div className={`fixed bottom-5 right-5 px-6 py-3 rounded-xl shadow-2xl text-white font-bold animate-bounce ${
                    toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
                }`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}