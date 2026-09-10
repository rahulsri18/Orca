import React, { createContext, useContext, useState, useEffect } from 'react';

export const CONNECTIVITY_MODES = [
  {
    id: '4g',
    label: '4G/5G Cellular',
    subtitle: 'High-speed coastal broadband',
    badge: 'ONLINE (24ms)',
    color: '#10B981',
    description: 'Full broadband telemetry with high-definition satellite imagery and live WebSocket streams.'
  },
  {
    id: 'navic',
    label: 'NavIC Satellite (IRNSS)',
    subtitle: 'Spaceborne S-band direct broadcast',
    badge: 'SAT-LOCK (-86 dBm)',
    color: '#0284C7',
    description: 'Operating beyond cellular range (15–50nm). Emergency bulletins and PFZ packets received via NavIC transponder.'
  },
  {
    id: 'offline',
    label: 'Offline Harbor Cache',
    subtitle: 'Autonomous cached mode',
    badge: 'CACHE (IndexedDB)',
    color: '#F59E0B',
    description: 'Zero connectivity. Operating on pre-departure downloaded GIS basemaps, offline PFZs, and emergency harbor waypoints.'
  }
];

const ConnectivityContext = createContext();

export function ConnectivityProvider({ children }) {
  const [mode, setMode] = useState('4g');
  const [packetCount, setPacketCount] = useState(1420);

  // Simulate satellite packet arrival when in NavIC mode
  useEffect(() => {
    let interval = null;
    if (mode === 'navic') {
      interval = setInterval(() => {
        setPacketCount(prev => prev + 1);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  const currentMode = CONNECTIVITY_MODES.find(m => m.id === mode) || CONNECTIVITY_MODES[0];

  return (
    <ConnectivityContext.Provider value={{ mode, setMode, currentMode, packetCount, CONNECTIVITY_MODES }}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext);
  if (!context) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
}
