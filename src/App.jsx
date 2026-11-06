import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import CitizenDashboard from './pages/CitizenDashboard';
import FileComplaint from './pages/FileComplaint';
import DuplicateRadar from './pages/DuplicateRadar';
import EvidenceChecker from './pages/EvidenceChecker';
import OfficerDashboard from './pages/OfficerDashboard';
import ClosureIntegrityGate from './pages/ClosureIntegrityGate';
import AuditTrail from './pages/AuditTrail';
import WardAnalytics from './pages/WardAnalytics';

// Initial Mock Data
import { INITIAL_GRIEVANCES } from './data/mockData';

export default function App() {
  const [roleMode, setRoleMode] = useState('CITIZEN'); // 'CITIZEN' | 'OFFICER'
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState('SC-2026-8891');

  // Add new grievance to system state
  const handleAddGrievance = (newGrievance) => {
    setGrievances(prev => [newGrievance, ...prev]);
    setSelectedGrievanceId(newGrievance.id);
  };

  // Update existing grievance state (e.g. from Closure Gate audit)
  const handleUpdateGrievance = (id, updates) => {
    setGrievances(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        roleMode={roleMode}
        setRoleMode={setRoleMode}
        grievancesCount={grievances.length}
        auditBlockHeight={1042 + grievances.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <CitizenDashboard
            grievances={grievances}
            setCurrentTab={setCurrentTab}
            setSelectedGrievanceId={setSelectedGrievanceId}
          />
        )}

        {currentTab === 'file-complaint' && (
          <FileComplaint
            grievances={grievances}
            onAddGrievance={handleAddGrievance}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'duplicate-radar' && (
          <DuplicateRadar
            grievances={grievances}
            setSelectedGrievanceId={setSelectedGrievanceId}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'evidence-checker' && (
          <EvidenceChecker
            grievances={grievances}
            selectedGrievanceId={selectedGrievanceId}
          />
        )}

        {currentTab === 'officer-dashboard' && (
          <OfficerDashboard
            grievances={grievances}
            setCurrentTab={setCurrentTab}
            setSelectedGrievanceId={setSelectedGrievanceId}
          />
        )}

        {currentTab === 'closure-gate' && (
          <ClosureIntegrityGate
            grievances={grievances}
            onUpdateGrievance={handleUpdateGrievance}
          />
        )}

        {currentTab === 'audit-trail' && (
          <AuditTrail />
        )}

        {currentTab === 'ward-analytics' && (
          <WardAnalytics grievances={grievances} />
        )}
      </main>

      {/* Global Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
