import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useTimer } from '../../contexts/TimerContext';
import { useAuth } from '../../contexts/AuthContext';
import CircularProgress from './CircularProgress';

const TimerView = () => {
  const { 
    mode, 
    timeLeft, 
    isActive, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    skipSession, 
    setMode, 
    sessionsCompleted,
    dailyGoal
  } = useTimer();
  const { user } = useAuth();

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? 1500 : (mode === 'short_break' ? 300 : 900);
  const progress = timeLeft / totalTime;

  const percentComplete = Math.min((sessionsCompleted / dailyGoal) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in fade-in duration-700">
      
      {/* Session Progress info for Logged in Users */}
      {user && (
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-400">Daily Goal: {sessionsCompleted}/{dailyGoal}</span>
            <span className="text-sm font-bold text-[#c2c2f6]">{Math.round(percentComplete)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#c2c2f6] transition-all duration-500 ease-out shadow-[0_0_10px_#c2c2f6]"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      )}

      {/* Mode Selector */}
      <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
        <button 
          onClick={() => setMode('focus')}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'focus' ? 'bg-[#c2c2f6] text-slate-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Focus
        </button>
        <button 
          onClick={() => setMode('short_break')}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'short_break' ? 'bg-[#c2c2f6] text-slate-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Short Break
        </button>
        <button 
          onClick={() => setMode('long_break')}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'long_break' ? 'bg-[#c2c2f6] text-slate-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Long Break
        </button>
      </div>

      {/* Circular Timer */}
      <div className="relative group">
        <CircularProgress 
          size={320} 
          strokeWidth={8} 
          percentage={progress * 100} 
          color="#c2c2f6"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-7xl font-mono font-bold tracking-tighter tabular-nums drop-shadow-md">
            {formatTime(timeLeft)}
          </span>
          <span className="text-gray-400 mt-2 font-medium uppercase tracking-widest text-xs opacity-60">
            {mode.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95"
          title="Reset"
        >
          <RotateCcw size={24} />
        </button>

        <button 
          onClick={isActive ? pauseTimer : startTimer}
          className="p-8 rounded-full bg-[#c2c2f6] text-slate-900 shadow-[0_0_30px_rgba(194,194,246,0.3)] hover:shadow-[0_0_50px_rgba(194,194,246,0.5)] transition-all hover:scale-105 active:scale-95"
          title={isActive ? "Pause" : "Start"}
        >
          {isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={skipSession}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95"
          title="Skip"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {sessionsCompleted > 0 && (
        <p className="text-gray-500 text-sm font-medium italic">
          You've finished <span className="text-[#c2c2f6]">{sessionsCompleted}</span> pomodoros so far.
        </p>
      )}
    </div>
  );
};

export default TimerView;