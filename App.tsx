
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimeLeft } from './types';
import { getFuturisticInspiration } from './services/geminiService';
import Celebration from './components/Celebration';
import BackgroundGraphics from './components/BackgroundGraphics';

// January 1, 2026 at 00:00:00 in the user's local timezone
// This creates a Date object for midnight on Jan 1, 2026 in whatever timezone the user is in
const TARGET_DATE = new Date(2026, 0, 1, 0, 0, 0, 0).getTime();



const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isCelebration, setIsCelebration] = useState(false);
  const [projections, setProjections] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        setIsCelebration(true);
        clearInterval(timer);
      }
    }, 1000);

    setTimeLeft(calculateTimeLeft());
    getFuturisticInspiration().then(setProjections);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  useEffect(() => {
    if (projections.length > 0) {
      const interval = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % projections.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [projections]);

  if (!timeLeft) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden bg-[#020617] text-slate-100 selection:bg-blue-500/30">
      <BackgroundGraphics />

      {isCelebration && <Celebration />}

      <main className="relative z-10 w-full max-w-7xl flex flex-col items-center flex-grow justify-center">
        {!isCelebration ? (
          <div className="flex flex-col items-center w-full space-y-12 lg:space-y-24">

            {/* Descriptive Header */}
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white/90 uppercase">
                THE DAWN OF <span className="text-blue-500 italic">2026</span>
              </h1>
              <p className="mono text-[10px] sm:text-xs tracking-[0.8em] text-slate-500 uppercase font-bold">
                Countdown to the next global chapter
              </p>
            </div>

            {/* The Main Clock */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-16 lg:gap-28 w-full px-4">
              <TimeUnit value={timeLeft.days} label="DAYS" />
              <TimeUnit value={timeLeft.hours} label="HOURS" />
              <TimeUnit value={timeLeft.minutes} label="MINUTES" />
              <TimeUnit value={timeLeft.seconds} label="SECONDS" highlight />
            </div>

            {/* The Random Fact Stream */}
            <div className="max-w-4xl w-full text-center px-6 min-h-[160px] flex items-center justify-center relative">
              {projections.length > 0 ? (
                <div key={currentIdx} className="animate-in fade-in slide-in-from-bottom-8 duration-[1500ms] ease-out">
                  <span className="mono text-sm sm:text-base text-emerald-400 block mb-6 tracking-[0.3em] uppercase opacity-80 font-bold">Predictions for 2026</span>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight leading-relaxed max-w-3xl mx-auto">
                    {projections[currentIdx].text}
                  </p>
                  <div className="mt-8 flex items-center justify-center space-x-6 opacity-20">
                    <div className="h-px w-10 bg-blue-500"></div>
                    <span className="mono text-[10px] tracking-[0.6em] uppercase font-black">{projections[currentIdx].topic || "Prediction"}</span>
                    <div className="h-px w-10 bg-blue-500"></div>
                  </div>
                </div>
              ) : (
                <div className="mono text-[10px] tracking-[1em] text-blue-500/20 animate-pulse uppercase">
                  Fetching_Simulation_Anomalies...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in-75 fade-in duration-[4000ms] w-full px-6 space-y-12 relative z-30">
            {/* Massive Year Display */}
            <div className="relative inline-block">
              <h1 className="text-[clamp(8rem,35vw,24rem)] font-black tracking-tighter leading-none text-white drop-shadow-[0_0_150px_rgba(59,130,246,0.8)] relative z-10 transition-transform hover:scale-105 duration-1000 cursor-default select-none">
                2026
              </h1>
              <div className="absolute -inset-10 bg-blue-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="overflow-hidden">
                <p className="text-4xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 tracking-tighter animate-in slide-in-from-bottom-full duration-[2500ms] ease-out">
                  LIMITLESS HORIZONS
                </p>
              </div>

              <div className="h-px w-full max-w-2xl mx-auto bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-[3000ms] delay-700">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-300 tracking-tight leading-relaxed">
                  The countdown ends, but the <span className="text-white font-bold italic">evolution</span> begins.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm mono tracking-[0.4em] text-blue-400/60 uppercase">
                  <span>UNLOCKED</span>
                  <span className="text-slate-700">•</span>
                  <span>INITIALIZED</span>
                  <span className="text-slate-700">•</span>
                  <span>SYNCED</span>
                </div>
              </div>

              <div className="pt-12">
                <p className="mono text-[10px] sm:text-[12px] text-slate-500 tracking-[1.5em] uppercase animate-pulse font-bold">
                  SIMULATION_COMPLETE // WELCOME_TO_THE_NEXT_LEVEL
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer with X Handle */}
      <footer className="relative z-10 py-8 w-full flex justify-center items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
        <a
          href="https://x.com/hustle_aj_"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-4 mono text-[11px] tracking-[0.4em] text-slate-400 hover:text-blue-400 transition-all duration-300"
        >
          <div className="w-8 h-px bg-slate-800 group-hover:w-12 group-hover:bg-blue-500/50 transition-all duration-500"></div>
          <span className="uppercase font-medium flex items-center">
            MADE BY: <span className="ml-2 font-black text-white group-hover:text-blue-400 transition-colors">@hustle_aj_</span>
          </span>
          <div className="w-8 h-px bg-slate-800 group-hover:w-12 group-hover:bg-blue-500/50 transition-all duration-500"></div>
        </a>
      </footer>


    </div>
  );
};

interface TimeUnitProps {
  value: number;
  label: string;
  highlight?: boolean;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label, highlight }) => {
  const [active, setActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="flex flex-col items-center group transition-all duration-700"
    >
      <div className={`relative transition-all duration-700 ${active ? 'scale-110 -translate-y-2' : ''}`}>
        <span className={`text-7xl sm:text-9xl lg:text-[11rem] font-black tracking-tighter leading-none transition-all duration-1000 
          ${highlight ? 'text-blue-500 drop-shadow-[0_0_40px_rgba(59,130,246,0.4)]' : 'text-slate-100 group-hover:text-emerald-400'}`}>
          {value.toString().padStart(2, '0')}
        </span>

        <div className={`absolute -inset-4 border border-blue-500/0 group-hover:border-blue-500/10 transition-all duration-1000 rounded-lg`}></div>
      </div>
      <div className="mt-8 lg:mt-12 flex flex-col items-center space-y-2">
        <span className="mono text-[10px] sm:text-[12px] text-slate-600 tracking-[1.2em] font-black group-hover:text-blue-400 transition-colors uppercase">
          {label}
        </span>
        <div className="h-[2px] w-0 group-hover:w-full bg-blue-500/40 transition-all duration-1000 ease-in-out"></div>
      </div>
    </div>
  );
};

export default App;
