import React from "react";
import { Timer, BarChart2, Settings, Moon, Sun, User, LogOut, Maximize2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Layout = ({ children, activeTab, setActiveTab, isDarkMode, toggleTheme }) => {
    const { user, logout, login } = useAuth();

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`w-16 md:w-20 flex flex-col items-center py-8 border-r transition-colors duration-300 ${isDarkMode ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-slate-200"}`}
            >
                <div className="mb-10 text-[#c2c2f6]">
                    <Timer size={32} strokeWidth={2.5} />
                </div>

                <nav className="flex flex-col gap-8 flex-1">
                    <button
                        onClick={() => setActiveTab("timer")}
                        className={`p-2 rounded-xl transition-all ${activeTab === "timer" ? "bg-[#c2c2f6] text-slate-900 shadow-lg" : "text-gray-400 hover:text-[#c2c2f6]"}`}
                    >
                        <Timer size={24} />
                    </button>
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`p-2 rounded-xl transition-all ${activeTab === "stats" ? "bg-[#c2c2f6] text-slate-900 shadow-lg" : "text-gray-400 hover:text-[#c2c2f6]"}`}
                    >
                        <BarChart2 size={24} />
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`p-2 rounded-xl transition-all ${activeTab === "settings" ? "bg-[#c2c2f6] text-slate-900 shadow-lg" : "text-gray-400 hover:text-[#c2c2f6]"}`}
                    >
                        <Settings size={24} />
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 rounded-xl text-gray-400 hover:text-[#c2c2f6] transition-all">
                        <Maximize2 size={24} />
                    </button>
                </nav>

                <div className="flex flex-col gap-6 items-center">
                    <button onClick={toggleTheme} className="p-2 rounded-full text-gray-400 hover:text-[#c2c2f6] transition-all">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <button onClick={logout} className="p-2 rounded-full text-red-400 hover:bg-red-500/10 transition-all" title="Logout">
                            <LogOut size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={() => login("guest@example.com")}
                            className="p-2 rounded-full text-gray-400 hover:text-[#c2c2f6] transition-all"
                            title="Login"
                        >
                            <User size={20} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-transparent">
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    {children}
                    {/* children = TimerView or StatsView or SettingsView */}
                </div>
            </main>
        </div>
    );
};

export default Layout;
