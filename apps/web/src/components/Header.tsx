import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { SystemHealth } from '../types';

interface HeaderProps {
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [online, setOnline] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    apiClient
      .getHealth()
      .then((data) => {
        if (mounted) {
          setHealth(data);
          setOnline(data.status === 'healthy');
        }
      })
      .catch(() => {
        if (mounted) setOnline(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-5 select-none shrink-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center font-bold text-white shadow-md">
          🔥
        </div>
        <div>
          <h1 className="font-semibold text-sm text-slate-100 tracking-wide">
            Forest Fire Prediction & Spread Simulation
          </h1>
          <p className="text-xs text-slate-400">ISRO Blueprint & Spatial GIS Platform</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-xs">
        <span className="text-slate-400 uppercase tracking-wider font-medium px-2 py-1 bg-slate-800 rounded">
          {currentView}
        </span>
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <span
            className={`w-2 h-2 rounded-full ${
              online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className="text-slate-300 font-mono">
            {online ? `API v${health?.version || '1.0'}` : 'API Offline'}
          </span>
        </div>
      </div>
    </header>
  );
};
