import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading geospatial data...' }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-3">
    <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
    <span className="text-xs text-slate-400 font-medium tracking-wide">{label}</span>
  </div>
);
