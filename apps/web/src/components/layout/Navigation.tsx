import React, { useState } from 'react';

export type NavTab = 'overview' | 'risk' | 'active_fires' | 'simulation' | 'layers';

export interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: { id: NavTab; label: string; icon: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'risk', label: '24h Fire Risk', icon: '🗺️', badge: '500m' },
    { id: 'active_fires', label: 'Active Hotspots', icon: '🔥', badge: 'FIRMS' },
    { id: 'simulation', label: '12h Simulation', icon: '⏳', badge: 'CA' },
    { id: 'layers', label: 'Environmental Layers', icon: '🛰️' },
  ];

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none z-20 transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-60'
      } ${className}`}
    >
      {/* Navigation Header / Toggle */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-400">
            GIS Modules
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors ml-auto text-xs"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation to Maximize Map'}
          aria-label={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
              } rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={item.label}
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Operational Metadata Footer */}
      {!isCollapsed ? (
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Spatial Grid:</span>
            <span className="font-mono text-slate-200">500m × 500m</span>
          </div>
          <div className="flex justify-between">
            <span>Projection:</span>
            <span className="font-mono text-slate-200">EPSG:4326</span>
          </div>
          <div className="flex justify-between">
            <span>Operational Mode:</span>
            <span className="font-mono text-emerald-400 font-semibold">Live GIS</span>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-800/80 text-center text-[10px] font-mono text-slate-500">
          500m
        </div>
      )}
    </aside>
  );
};
