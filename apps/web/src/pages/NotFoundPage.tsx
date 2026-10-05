import React from 'react';
import { EmptyState } from '../components/feedback/EmptyState';

export interface NotFoundPageProps {
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
      <EmptyState
        title="GIS Viewport Not Found"
        description="The requested operational interface or route does not exist."
        icon="🌐"
        actionLabel="Return to Overview"
        onAction={onReturnHome}
        className="max-w-md w-full bg-slate-900/60 p-8"
      />
    </div>
  );
};
