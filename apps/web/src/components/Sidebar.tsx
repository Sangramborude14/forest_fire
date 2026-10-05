import React from 'react';

export type NavTab = 'overview' | 'risk' | 'simulation' | 'active_fires' | 'layers';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: NavTab; label: string; icon: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'risk', label: '24h Fire Risk', icon: '🗺️', badge: '500m' },
    { id: 'simulation', label: '12h Spread Simulation', icon: '⏳', badge: 'CA' },
    { id: 'active_fires', label: 'Active Hotspots', icon: '🔥' },
    { id: 'layers', label: 'Environmental Layers', icon: '🛰️' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none z-20">
      <div className="p-4 border-b border-slate-800/60">
        <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
          Navigation Modules
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 text-xs text-slate-400 space-y-1">
        <div className="flex justify-between">
          <span>Spatial Grid:</span>
          <span className="font-mono text-slate-300">500m × 500m</span>
        </div>
        <div className="flex justify-between">
          <span>Projection:</span>
          <span className="font-mono text-slate-300">EPSG:4326</span>
        </div>
        <div className="flex justify-between">
          <span>Phase:</span>
          <span className="font-mono text-amber-400">Phase 1 Foundation</span>
        </div>
      </div>
    </aside>
  );
};
