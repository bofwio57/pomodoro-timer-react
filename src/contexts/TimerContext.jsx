import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const TimerContext = createContext(undefined);

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
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusTime);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [sessionHistory, setSessionHistory] = useState([]);

  const timerRef = useRef(null);

  const getModeTime = useCallback((m) => {
    switch (m) {
      case 'focus': return settings.focusTime;
      case 'short_break': return settings.shortBreakTime;
      case 'long_break': return settings.longBreakTime;
      default: return settings.focusTime;
    }
  }, [settings]);

  useEffect(() => {
    setTimeLeft(getModeTime(mode));
  }, [mode, getModeTime]);

  const playSound = (type) => {
    if (!settings.soundEnabled) return;
    const audio = new Audio(type === 'start' 
      ? 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' 
      : 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg'
    );
    audio.play().catch(e => console.log('Audio play failed', e));
  };

  const notify = (title, body) => {
    if (!settings.notificationsEnabled) return;
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  };

  const completeSession = useCallback(() => {
    setIsActive(false);
    playSound('end');

    const session = {
      id: Date.now().toString(),
      type: mode,
      duration_seconds: getModeTime(mode),
      completed_at: new Date().toISOString(),
    };

    setSessionHistory(prev => [...prev, session]);

    if (mode === 'focus') {
      const nextCount = sessionsCompleted + 1;
      setSessionsCompleted(nextCount);
      notify('Focus Complete!', 'Time for a break.');

      if (nextCount % settings.longBreakInterval === 0) {
        setMode('long_break');
      } else {
        setMode('short_break');
      }
    } else {
      notify('Break Over!', 'Ready to focus?');
      setMode('focus');
    }
  }, [mode, sessionsCompleted, settings, getModeTime]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      completeSession();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, completeSession]);

  const startTimer = () => {
    setIsActive(true);
    playSound('start');
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
    <TimerContext.Provider value={{
      mode, timeLeft, isActive, sessionsCompleted, settings,
      setSettings, startTimer, pauseTimer, resetTimer, skipSession,
      setMode, dailyGoal, setDailyGoal, sessionHistory
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer must be used within a TimerProvider');
  return context;
};