import React, { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { NavTab } from './components/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { FireRiskPage } from './pages/FireRiskPage';
import { SimulationPage } from './pages/SimulationPage';
import { ActiveFiresPage } from './pages/ActiveFiresPage';
import { LayersPage } from './pages/LayersPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');

  const renderActivePage = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewPage />;
      case 'risk':
        return <FireRiskPage />;
      case 'simulation':
        return <SimulationPage />;
      case 'active_fires':
        return <ActiveFiresPage />;
      case 'layers':
        return <LayersPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <MainLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
      {renderActivePage()}
    </MainLayout>
  );
};

export default App;
