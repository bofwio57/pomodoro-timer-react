import React from "react";
import { Bell, Volume2, Clock, Target, VolumeX } from "lucide-react";
import { useTimer } from "../../contexts/TimerContext";

const SettingsView = () => {
    const { settings, setSettings, dailyGoal, setDailyGoal } = useTimer();

    const updateSetting = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleTimeChange = (key, minutes) => {
        const val = parseInt(minutes, 10);
        if (!isNaN(val)) {
            updateSetting(key, val * 60);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500">
            <header>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">Personalize your productivity environment.</p>
            </header>

            {/* Timer Durations */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-gray-300">
                    <Clock size={20} />
                    <h2 className="font-semibold text-lg">Timer Intervals (Minutes)</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Focus</label>
                        <input
                            type="number"
                            value={settings.focusTime / 60}
                            onChange={(e) => handleTimeChange("focusTime", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#c2c2f6] transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Short Break</label>
                        <input
                            type="number"
                            value={settings.shortBreakTime / 60}
                            onChange={(e) => handleTimeChange("shortBreakTime", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#c2c2f6] transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Long Break</label>
                        <input
                            type="number"
                            value={settings.longBreakTime / 60}
                            onChange={(e) => handleTimeChange("longBreakTime", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#c2c2f6] transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* Daily Goal */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-gray-300">
                    <Target size={20} />
                    <h2 className="font-semibold text-lg">Daily Goals</h2>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Target Pomodoros</h3>
                        <p className="text-sm text-gray-500">How many focus sessions per day?</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
                            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            -
                        </button>
                        <span className="text-2xl font-bold font-mono w-10 text-center">{dailyGoal}</span>
                        <button
                            onClick={() => setDailyGoal(dailyGoal + 1)}
                            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </section>

            {/* Notifications & Sounds */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-gray-300">
                    <Bell size={20} />
                    <h2 className="font-semibold text-lg">Alerts & Experience</h2>
                </div>
                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#c2c2f6]/10 text-[#c2c2f6] rounded-xl">
                                {settings.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </div>
                            <div>
                                <h3 className="font-medium">Sound Effects</h3>
                                <p className="text-sm text-gray-500">Play sounds when sessions start/end</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.soundEnabled}
                                onChange={() => updateSetting("soundEnabled", !settings.soundEnabled)}
                            />
                            <div className="w-14 h-7 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c2c2f6]"></div>
                        </label>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#c2c2f6]/10 text-[#c2c2f6] rounded-xl">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium">Desktop Notifications</h3>
                                <p className="text-sm text-gray-500">Show alert when timer reaches zero</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.notificationsEnabled}
                                onChange={() => updateSetting("notificationsEnabled", !settings.notificationsEnabled)}
                            />
                            <div className="w-14 h-7 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c2c2f6]"></div>
                        </label>
                    </div>
                </div>
            </section>

            <footer className="pt-10 text-center text-xs text-gray-600">
                <p>Pomodoro v1.0.0</p>
                <p className="mt-2">&copy; 2026.</p>
            </footer>
        </div>
    );
};

export default SettingsView;
