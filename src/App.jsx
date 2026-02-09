import React, { useState, useEffect } from "react";
import { TimerProvider } from "./contexts/TimerContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import TimerView from "./components/Timer/TimerView";
import StatsView from "./components/Dashboard/StatsView";
import SettingsView from "./components/Settings/SettingsView";

const App = () => {
    const [activeTab, setActiveTab] = useState("timer");
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            document.body.classList.add("bg-[#121212]", "text-gray-100");
            document.body.classList.remove("bg-slate-50", "text-slate-900");
        } else {
            document.documentElement.classList.remove("dark");
            document.body.classList.add("bg-slate-50", "text-slate-900");
            document.body.classList.remove("bg-[#121212]", "text-gray-100");
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <AuthProvider>
            <TimerProvider>
                <Layout activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                    {activeTab === "timer" && <TimerView />}
                    {activeTab === "stats" && <StatsView />}
                    {activeTab === "settings" && <SettingsView />}
                </Layout>
            </TimerProvider>
        </AuthProvider>
    );
};

export default App;
