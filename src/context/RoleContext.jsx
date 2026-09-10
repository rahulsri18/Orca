import React, { createContext, useContext, useState } from 'react';

export const USER_ROLES = [
  {
    id: 'fisherman',
    title: 'Fisherman',
    subtitle: 'Artisanal & Mechanized Fleet',
    icon: 'Anchor',
    color: '#0284C7',
    tagline: 'Prioritizing prime PFZ catch zones, safe wave windows & harbor alerts',
    emphasis: ['pfz', 'alerts', 'chat', 'routes'],
    defaultQuery: 'Is it safe to fish tomorrow near Kochi coast?'
  },
  {
    id: 'authority',
    title: 'Disaster Authority',
    subtitle: 'NDRF / Coastal Disaster Mgmt',
    icon: 'ShieldAlert',
    color: '#C0392B',
    tagline: 'Tracking cyclone tracks, high swell surge & maritime geofences',
    emphasis: ['alerts', 'map', 'chat', 'routes'],
    defaultQuery: 'Marine alert status for Gulf of Mannar & Rameswaram'
  },
  {
    id: 'operator',
    title: 'Maritime Operator',
    subtitle: 'Port & Commercial Shipping',
    icon: 'Compass',
    color: '#1C7293',
    tagline: 'Optimizing safe vessel navigation corridors & hazard circumvention',
    emphasis: ['routes', 'map', 'analytics', 'alerts'],
    defaultQuery: 'Plot safest return route to Mangalore avoiding rough waters'
  },
  {
    id: 'researcher',
    title: 'Ocean Researcher',
    subtitle: 'Oceanographer / Scientist',
    icon: 'Activity',
    color: '#059669',
    tagline: 'Evaluating satellite bio-optical products, SST anomalies & trends',
    emphasis: ['analytics', 'satellites', 'map', 'pfz'],
    defaultQuery: "Show today's best PFZ coordinates off Visakhapatnam"
  }
];

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState('fisherman');

  const currentRole = USER_ROLES.find(r => r.id === role) || USER_ROLES[0];

  return (
    <RoleContext.Provider value={{ role, setRole, currentRole, USER_ROLES }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
