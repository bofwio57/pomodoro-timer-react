import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Clock, CheckCircle, Flame, Calendar, BarChart2 } from "lucide-react";
import { useTimer } from "../../contexts/TimerContext";
import { useAuth } from "../../contexts/AuthContext";

const StatsView = () => {
    const { sessionHistory } = useTimer();
    const { user } = useAuth();

    const stats = useMemo(() => {
        const focusSessions = sessionHistory.filter((s) => s.type === "focus"); //집중 세션만 추출
        const totalMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration_seconds / 60, 0); //모든 집중 세션의 총 시간
        const completedCount = focusSessions.length; //통계용 숫자, 포모도로 수

        // 최근 7일 날짜 배열 생성
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split("T")[0]; //"2026-02-10" 같은 문자열
        }).reverse();

        //날짜별로 데이터 묶기
        const chartData = last7Days.map((date) => {
            //해당 날짜에 완료된 세션만
            const daySessions = focusSessions.filter((s) => s.completed_at.startsWith(date));
            return {
                //차트 라이브러리용 데이터 형태
                date: date.slice(5), // MM-DD
                minutes: daySessions.reduce((acc, curr) => acc + curr.duration_seconds / 60, 0),
                count: daySessions.length,
            };
        });

        return { totalMinutes, completedCount, chartData };
    }, [sessionHistory]); //sessionHistory가 바뀔 때만 계산 다시 함

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#c2c2f6]/10 p-6 rounded-full text-[#c2c2f6]">
                    <BarChart2 size={64} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-2">Login to track stats</h2>
                    <p className="text-gray-400 max-w-sm">Save your progress, set daily goals, and see detailed productivity insights.</p>
                </div>
                <button
                    onClick={() => {}}
                    className="px-8 py-3 bg-[#c2c2f6] text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
                <p className="text-gray-400">Track your focus cycles and productivity trends.</p>
            </header>

            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: <Clock />, label: "Total Focus Time", value: `${Math.round(stats.totalMinutes)} min`, color: "text-[#c2c2f6]" },
                    { icon: <CheckCircle />, label: "Completed", value: stats.completedCount, color: "text-emerald-400" },
                    { icon: <Flame />, label: "Best Streak", value: "3 days", color: "text-orange-400" },
                    { icon: <Calendar />, label: "This Week", value: `${Math.round(stats.totalMinutes)} min`, color: "text-blue-400" },
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col">
                        <div className={`${item.color} mb-4`}>{item.icon}</div>
                        <span className="text-sm text-gray-500 mb-1">{item.label}</span>
                        <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                ))}
            </div>

            {/* Main Chart */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <h3 className="text-lg font-bold mb-6">Focus Activity (Last 7 Days)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.chartData}>
                            <defs>
                                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#c2c2f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#c2c2f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1f1f1f", border: "1px solid #333", borderRadius: "12px", fontSize: "12px" }}
                                itemStyle={{ color: "#c2c2f6" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="minutes"
                                stroke="#c2c2f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMin)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Session History List */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <h3 className="text-lg font-bold mb-6">Recent Sessions</h3>
                <div className="space-y-4">
                    {sessionHistory.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No sessions recorded yet.</p>
                    ) : (
                        sessionHistory
                            .slice()
                            .reverse()
                            .map((session) => (
                                <div key={session.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${session.type === "focus" ? "bg-[#c2c2f6]" : "bg-gray-600"}`}></div>
                                        <div>
                                            <p className="font-medium capitalize">{session.type.replace("_", " ")}</p>
                                            <p className="text-xs text-gray-500">{new Date(session.completed_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="font-mono text-sm text-gray-400">{Math.round(session.duration_seconds / 60)}m</p>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsView;
