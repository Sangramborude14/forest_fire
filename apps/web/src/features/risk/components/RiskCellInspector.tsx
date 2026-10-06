import React from 'react';
import { RiskPredictionProperties } from '../../../types/domain';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export interface RiskCellInspectorProps {
  cell: RiskPredictionProperties | null;
  onClose: () => void;
  onSimulateFromCell?: (cell: RiskPredictionProperties) => void;
  className?: string;
}

export const RiskCellInspector: React.FC<RiskCellInspectorProps> = ({
  cell,
  onClose,
  onSimulateFromCell,
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
      className={`bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md text-xs space-y-3 ${className}`}
      role="region"
      aria-label="Grid Cell Details Inspector"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
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

      {/* SECTION 1: RISK ESTIMATION */}
      <div className="space-y-1.5 font-mono text-[11px]">
        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
          Risk Classification
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Susceptibility Class:</span>
          <Badge variant={riskBadgeVariant} size="sm">
            {cell.risk_class}
          </Badge>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Fire Probability:</span>
          <span className="font-bold text-amber-400 text-xs">
            {(cell.risk_probability * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* SECTION 2: FORECAST & MODEL */}
      <div className="space-y-1.5 font-mono text-[11px] pt-1 border-t border-slate-800/60">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Forecast & Model Metadata
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">Model Engine:</span>
          <span className="text-slate-200">XGBoost ({cell.model_version || 'risk-xgboost-v001'})</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">Forecast Window:</span>
          <span className="text-slate-200">24-Hour Horizon</span>
        </div>
        {cell.prediction_timestamp && (
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Generated:</span>
            <span className="text-slate-300">
              {new Date(cell.prediction_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {/* SECTION 3: ENVIRONMENTAL INPUTS */}
      <div className="space-y-1.5 font-mono text-[11px] pt-1 border-t border-slate-800/60">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Environmental Inputs
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">FWI Rating:</span>
          <span className="text-slate-200">
            {cell.fwi_index !== null && cell.fwi_index !== undefined ? cell.fwi_index.toFixed(1) : 'Not available'}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">Elevation:</span>
          <span className="text-slate-200">
            {cell.elevation !== null && cell.elevation !== undefined ? `${cell.elevation} m` : 'Not available'}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">Slope:</span>
          <span className="text-slate-200">
            {cell.slope !== null && cell.slope !== undefined ? `${cell.slope}°` : 'Not available'}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">Fuel Class:</span>
          <span className="text-slate-200 truncate max-w-[150px]">
            {cell.fuel_type || 'Conifer High'}
          </span>
        </div>
      </div>

      {/* Educational Model Note */}
      <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 leading-normal">
        ℹ️ Model-estimated susceptibility based on environmental features. Does not indicate an active ignition.
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-slate-800 flex items-center space-x-2">
        {onSimulateFromCell && (
          <Button
            variant="primary"
            size="sm"
            className="flex-1 font-semibold text-[11px]"
            onClick={() => onSimulateFromCell(cell)}
          >
            🎯 Simulate Spread
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={onClose}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};
