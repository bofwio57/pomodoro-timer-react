import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

// 타이머 Context 생성
const TimerContext = createContext(undefined);

//기본 설정 객체
const DEFAULT_SETTINGS = {
    focusTime: 25 * 60,
    shortBreakTime: 5 * 60,
    longBreakTime: 15 * 60,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
    soundEnabled: true,
    notificationsEnabled: true,
};

export const TimerProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS); // 사용자 설정
    const [mode, setMode] = useState("focus"); // 현재 모드 (focus / break)
    const [timeLeft, setTimeLeft] = useState(settings.focusTime); // 남은 시간 (초)
    const [isActive, setIsActive] = useState(false); // 타이머 실행 중인지
    const [sessionsCompleted, setSessionsCompleted] = useState(0); // 지금까지 누적해서 센 카운터 포모도로 수
    const [dailyGoal, setDailyGoal] = useState(8);
    const [sessionHistory, setSessionHistory] = useState([]); // 기록

    const timerRef = useRef(null);

    // 현재 모드에 맞는 시간 반환
    const getModeTime = useCallback(
        (m) => {
            switch (m) {
                case "focus":
                    return settings.focusTime;
                case "short_break":
                    return settings.shortBreakTime;
                case "long_break":
                    return settings.longBreakTime;
                default:
                    return settings.focusTime;
            }
        },
        [settings],
    );

    // 모드 변경 시 타이머 초기화
    useEffect(() => {
        setTimeLeft(getModeTime(mode)); //남은 시간을 변경한다
    }, [mode, getModeTime]);

    // 사운드 재생
    const playSound = (type) => {
        if (!settings.soundEnabled) return;
        const audio = new Audio(
            type === "start"
                ? "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
                : "https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg",
        );
        audio.play().catch((e) => console.log("Audio play failed", e));
    };

    // 세션 완료 처리
    const completeSession = useCallback(() => {
        setIsActive(false);
        playSound("end");

        // 기록 저장
        const session = {
            id: Date.now().toString(),
            type: mode,
            duration_seconds: getModeTime(mode),
            completed_at: new Date().toISOString(),
        };

        setSessionHistory((prev) => [...prev, session]);

        if (mode === "focus") {
            const nextCount = sessionsCompleted + 1;
            setSessionsCompleted(nextCount);

            //휴식 시간 판단
            if (nextCount % settings.longBreakInterval === 0) {
                setMode("long_break");
            } else {
                setMode("short_break");
            }
        } else {
            setMode("focus");
        }
    }, [mode, sessionsCompleted, settings, getModeTime]);

    // 타이머 루프
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            //타이머가 실행중이고 남은시간이 있는경우
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            completeSession();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, completeSession]);

    const startTimer = () => {
        setIsActive(true); //타이머 실행 중으로 상태 변경
        playSound("start");
    };

    const pauseTimer = () => setIsActive(false);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(getModeTime(mode));
    };

    const skipSession = () => {
        setIsActive(false);
        completeSession();
    };

    return (
        <TimerContext.Provider
            value={{
                mode,
                timeLeft,
                isActive,
                sessionsCompleted,
                settings,
                setSettings,
                startTimer,
                pauseTimer,
                resetTimer,
                skipSession,
                setMode,
                dailyGoal,
                setDailyGoal,
                sessionHistory,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

// Context 사용용 커스텀 훅
export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) throw new Error("useTimer must be used within a TimerProvider");
    return context;
};
