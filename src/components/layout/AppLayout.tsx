import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NewReportModal } from '../reports/NewReportModal';
import { useDemo } from '../../context/DemoContext';
import { DashboardPage } from '../../pages/Dashboard';
import { RiskMapPage } from '../../pages/RiskMap';
import { RiskAnalysisPage } from '../../pages/RiskAnalysis';
import { SensorsPage } from '../../pages/Sensors';
import { ReportsPage } from '../../pages/Reports';
import { AlertsPage } from '../../pages/Alerts';
import { EmergencyPage } from '../../pages/Emergency';
import { SettingsPage } from '../../pages/Settings';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const AppLayout: React.FC = () => {
  const { activeTab } = useDemo();
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'risk-map':
        return <RiskMapPage />;
      case 'risk-analysis':
        return <RiskAnalysisPage />;
      case 'sensors':
        return <SensorsPage />;
      case 'reports':
        return <ReportsPage onOpenNewReportModal={() => setReportModalOpen(true)} />;
      case 'alerts':
        return <AlertsPage />;
      case 'emergency':
        return <EmergencyPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050912] text-slate-100 font-sans selection:bg-[#00D4FF]/30 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenReportModal={() => setReportModalOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <ErrorBoundary fallbackTitle="Module View Recovered">
              {renderActivePage()}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* 1-Tap Field Upload Modal */}
      <NewReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
