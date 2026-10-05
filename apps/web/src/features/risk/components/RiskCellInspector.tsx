import React from 'react';
import { RiskPredictionProperties } from '../../../types/domain';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export interface RiskCellInspectorProps {
  cell: RiskPredictionProperties | null;
  onClose: () => void;
  className?: string;
}

export const RiskCellInspector: React.FC<RiskCellInspectorProps> = ({
  cell,
  onClose,
  className = '',
}) => {
  if (!cell) return null;

  const riskBadgeVariant =
    cell.risk_class === 'EXTREME'
      ? 'danger'
      : cell.risk_class === 'HIGH'
      ? 'danger'
      : cell.risk_class === 'MODERATE'
      ? 'warning'
      : 'success';

  return (
    <div
      className={`bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md text-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-base">📐</span>
          <div>
            <h4 className="font-semibold text-slate-100">500m Grid Cell Inspector</h4>
            <span className="text-[10px] font-mono text-slate-400">ID: {cell.cell_id}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-sm p-1 rounded hover:bg-slate-800"
          aria-label="Close cell inspector"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 font-mono text-[11px] text-slate-300">
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Susceptibility Level:</span>
          <Badge variant={riskBadgeVariant} size="sm">
            {cell.risk_class}
          </Badge>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Fire Probability:</span>
          <span className="font-bold text-amber-400">
            {(cell.risk_probability * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">FWI Rating:</span>
          <span>{cell.fwi_index !== null && cell.fwi_index !== undefined ? cell.fwi_index.toFixed(1) : 'Not available'}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Elevation:</span>
          <span>{cell.elevation !== null && cell.elevation !== undefined ? `${cell.elevation} m` : 'Not available'}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Topographical Slope:</span>
          <span>{cell.slope !== null && cell.slope !== undefined ? `${cell.slope}°` : 'Not available'}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Fuel Classification:</span>
          <span>{cell.fuel_type || 'Not available'}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Model Pipeline:</span>
          <span className="text-slate-500">{cell.model_version || 'Baseline Contract'}</span>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex justify-end">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};
