import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { RoleProvider } from './context/RoleContext';
import { ConnectivityProvider } from './context/ConnectivityContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AlertBanner } from './components/common/AlertBanner';
import { DailyBulletinModal } from './components/common/DailyBulletinModal';
import { EmergencySosModal } from './components/sos/EmergencySosModal';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { ChatPage } from './pages/ChatPage';
import { PfzPage } from './pages/PfzPage';
import { AlertsPage } from './pages/AlertsPage';
import { RoutesPage } from './pages/RoutesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SatellitePage } from './pages/SatellitePage';
import { ProfilePage } from './pages/ProfilePage';
import { MOCK_ALERTS } from './data/mockAlerts';

export function AppContent() {
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validTabs = ['dashboard', 'map', 'chat', 'pfz', 'alerts', 'routes', 'analytics', 'satellites', 'profile'];
    if (validTabs.includes(hash)) return hash;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab')?.toLowerCase();
    if (validTabs.includes(tabParam)) return tabParam;
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [highlightedCoords, setHighlightedCoords] = useState(null);
  const [chatInitialQuery, setChatInitialQuery] = useState(null);
  const [showDailyBulletin, setShowDailyBulletin] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validTabs = ['dashboard', 'map', 'chat', 'pfz', 'alerts', 'routes', 'analytics', 'satellites', 'profile'];
      if (validTabs.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const activeSevereAlert = MOCK_ALERTS.find(a => a.severity === 'HIGH');
  const activeAlertCount = MOCK_ALERTS.filter(a => a.status === 'ACTIVE').length;

  const handleAskOrca = (zoneOrObj) => {
    const query = typeof zoneOrObj === 'string'
      ? zoneOrObj
      : zoneOrObj.zoneName
        ? `Evaluate marine safety and fish catch potential for ${zoneOrObj.zoneName}`
        : `Evaluate marine hazard status for ${zoneOrObj.name || 'this sector'}`;

    setChatInitialQuery(query);
    setActiveTab('chat');
  };

  const handleHighlightMap = (coords, zoneName = null) => {
    setHighlightedCoords(coords);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sticky Top Alert Banner for Severe Warnings */}
      <AlertBanner
        alert={activeSevereAlert}
        onNavigateToAlerts={() => setActiveTab('alerts')}
      />

      {/* Main Top Header */}
      <Header
        activeAlertCount={activeAlertCount}
        onNavigateTab={setActiveTab}
        onOpenBulletin={() => setShowDailyBulletin(true)}
        onOpenSos={() => setShowSosModal(true)}
      />

      {/* Desktop Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateTab={setActiveTab}
            onAskOrca={handleAskOrca}
            onHighlightMap={handleHighlightMap}
            onOpenSos={() => setShowSosModal(true)}
          />
        )}

        {activeTab === 'map' && (
          <MapPage
            highlightedCoordinates={highlightedCoords}
            onAskOrca={handleAskOrca}
          />
        )}

        {activeTab === 'chat' && (
          <ChatPage
            onHighlightMap={handleHighlightMap}
            initialQuery={chatInitialQuery}
          />
        )}

        {activeTab === 'pfz' && (
          <PfzPage
            onAskOrca={handleAskOrca}
            onNavigateToMap={handleHighlightMap}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPage
            onNavigateToMap={handleHighlightMap}
            onAskOrca={handleAskOrca}
          />
        )}

        {activeTab === 'routes' && (
          <RoutesPage
            onNavigateToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {activeTab === 'satellites' && (
          <SatellitePage />
        )}

        {activeTab === 'profile' && (
          <ProfilePage />
        )}
      </main>

      {/* Official Daily Marine Safety Bulletin Modal */}
      <DailyBulletinModal
        isOpen={showDailyBulletin}
        onClose={() => setShowDailyBulletin(false)}
      />

      {/* Emergency SOS Distress Modal (Works 100% Offline) */}
      <EmergencySosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
      />

      {/* Mobile Responsive Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertCount={activeAlertCount}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <RoleProvider>
        <ConnectivityProvider>
          <AppContent />
        </ConnectivityProvider>
      </RoleProvider>
    </LanguageProvider>
  );
}
