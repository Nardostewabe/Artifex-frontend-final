import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FlaggedContent from "./pages/FlaggedContent";
import ModerationHistory from "./pages/ModerationHistory";
import Tutorials from "./pages/Tutorials";

export default function ContentAdminDashboard() {
    const [activePage, setActivePage] = useState("queue");
    const [toast, setToast] = useState(null);

    // Simple mock data for counts
    const queueCount = 5;
    const unseenLogsCount = 2;

    // Simple toast handler
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const renderContent = () => {
        switch (activePage) {
            case "queue":
                return <FlaggedContent showToast={showToast} />;
            case "history":
                // Mocking logs for the history page
                const mockLogs = [
                    { id: 1, action: "Approved Listing", moderator: "Admin", target: "Bag", reason: "N/A", date: "2025-01-05" },
                    { id: 2, action: "Removed Flagged Review", moderator: "Admin", target: "Review #123", reason: "Harassment", date: "2025-01-04" },
                ];
                return <ModerationHistory logs={mockLogs} />;
            case "tutorials":
                return <Tutorials showToast={showToast} />;
            case "reports":
                return <div className="p-8 text-center text-gray-500">Analytics & Reports Module - Coming Soon</div>;
            default:
                return <FlaggedContent showToast={showToast} />;
        }
    };

    return (
        <div className="flex min-h-screen w-screen bg-[#F8FAFC] text-slate-900">

            {/* SIDEBAR */}
            <Sidebar
                setActivePage={setActivePage}
                activePage={activePage}
                queueCount={queueCount}
                unseenLogsCount={unseenLogsCount}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                <Header moderatorName="Alex" />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderContent()}
                </main>

            </div>

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className={`fixed bottom-5 right-5 px-6 py-3 rounded-xl shadow-2xl text-white font-bold animate-bounce ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
                    }`}>
                    {toast.message}
                </div>
            )}

        </div>
    );
}
