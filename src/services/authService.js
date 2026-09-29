/**
 * ORCA Maritime Authentication & User Registry Service
 * ISRO Disaster Management & Coastal Maritime Safety
 *
 * Provides real persistent authentication for all 4 maritime roles:
 * - Coastal Fishermen
 * - Disaster Authorities (NDMA / MRCC)
 * - Maritime Operators (Port & VTS)
 * - Ocean Researchers (INCOIS / ISRO)
 * Plus a dedicated Administrator security authority.
 */

const USERS_DB_KEY = 'orca_users_db_v2';
const AUTH_SESSION_KEY = 'orca_auth_session_v2';

export const INITIAL_USERS = [
  // 1. SYSTEM ADMINISTRATOR
  {
    id: 'usr-admin-01',
    email: 'admin@orca.gov.in',
    password: 'orcaadmin123',
    role: 'admin',
    fullName: 'Capt. Vikramaditya Rathore',
    designation: 'Director General of Maritime Intelligence & Operations',
    organization: 'National Maritime Surveillance Authority (NMSA / ISRO)',
    stationId: 'HQ-NEW-DELHI-WAR-ROOM',
    phone: '+91 11 2309 4421',
    serviceId: 'GOI-NMSA-DIR-001',
    clearanceLevel: 'LEVEL-5 TS (TOP SECRET / OMEGA CLEARANCE)',
    isVerified: true,
    verificationAgency: 'Ministry of Ports, Shipping and Waterways / ISRO',
    homePort: 'Naval Headquarters / Coast Guard HQ, New Delhi',
    registeredAt: '2024-01-15T09:00:00Z',
    lastLogin: 'Active Now',
    activeToken: 'ORCA-ADM-TOKEN-99418',
    avatarInitials: 'VR'
  },

  // 2. COASTAL FISHERMEN
  {
    id: 'usr-fish-01',
    email: 'murugan@matsya.in',
    password: 'fish123',
    role: 'fisherman',
    fullName: 'Capt. Murugan Sundaram',
    vesselName: 'Matsya-01',
    realCraftReg: 'IND-KL-07-MM-4421',
    mmsi: '419001421',
    navicTransponderId: 'SAC-NAVIC-S-88192',
    homePort: 'Kochi Old Fishing Harbor, Thoppumpady (Kerala)',
    cooperative: 'Matsyafed Coastal Cooperative Society #24',
    hullType: '12m Motorized Fiberglass (FRP Trawler)',
    engineHp: '24 HP Yamaha / Ashok Leyland Outboard',
    phone: '+91 98470 12345',
    crewCount: 4,
    lifeJacketCount: 6,
    isVerified: true,
    verificationAgency: 'Dept. of Fisheries (Govt. of India / RealCraft)',
    validTill: '31 Dec 2027',
    registeredAt: '2024-03-12T10:30:00Z',
    lastLogin: '2026-09-27 08:30 IST',
    avatarInitials: 'MS'
  },
  {
    id: 'usr-fish-02',
    email: 'selvam@rameshwaram.in',
    password: 'fish123',
    role: 'fisherman',
    fullName: 'K. Selvamurthy',
    vesselName: 'Thiruvalluvar-7',
    realCraftReg: 'IND-TN-11-MM-8902',
    mmsi: '419002518',
    navicTransponderId: 'SAC-NAVIC-S-12944',
    homePort: 'Rameswaram Jetty, Gulf of Mannar (Tamil Nadu)',
    cooperative: 'Pamban Fishermen Seva Sangam',
    hullType: '9m Mechanized Gillnetter',
    engineHp: '18 HP Greaves Cotton',
    phone: '+91 94432 55432',
    crewCount: 3,
    lifeJacketCount: 4,
    isVerified: true,
    verificationAgency: 'Tamil Nadu Marine Fisheries Board',
    validTill: '15 Aug 2028',
    registeredAt: '2024-04-18T14:20:00Z',
    lastLogin: '2026-09-26 19:15 IST',
    avatarInitials: 'KS'
  },
  {
    id: 'usr-fish-03',
    email: 'apparao@vizagsea.in',
    password: 'fish123',
    role: 'fisherman',
    fullName: 'B. Appa Rao',
    vesselName: 'Sagara Durga',
    realCraftReg: 'IND-AP-03-MM-3341',
    mmsi: '419003889',
    navicTransponderId: 'SAC-NAVIC-S-44019',
    homePort: 'Visakhapatnam Fishing Harbor (Andhra Pradesh)',
    cooperative: 'Waltair Marine Artisanal Union',
    hullType: '14m Wooden Deep-Sea Longliner',
    engineHp: '36 HP Kirloskar Marine',
    phone: '+91 89123 99821',
    crewCount: 6,
    lifeJacketCount: 8,
    isVerified: false,
    verificationAgency: 'Pending RealCraft Inspection',
    validTill: 'Under Review',
    registeredAt: '2024-08-05T11:00:00Z',
    lastLogin: '2026-09-25 06:45 IST',
    avatarInitials: 'AR'
  },

  // 3. DISASTER AUTHORITIES
  {
    id: 'usr-auth-01',
    email: 'verma@ndma.gov.in',
    password: 'ndma123',
    role: 'authority',
    fullName: 'Cmdr. Rajesh Verma (Retd.)',
    designation: 'Deputy Director (Maritime Disaster Operations)',
    organization: 'National Disaster Management Authority (NDMA) & MRCC',
    serviceId: 'GOI-NDMA-OPS-7721',
    commandSector: 'Southwest Arabian Sea & Lakshadweep Waters',
    clearanceLevel: 'Level-4 (Code Red Cyclone Siren Dispatch Authority)',
    stationId: 'MRCC-KOCHI-HQ',
    homePort: 'Kochi Naval Base / MRCC',
    phone: '+91 484 2216444',
    isVerified: true,
    verificationAgency: 'Ministry of Home Affairs / Indian Coast Guard',
    validTill: 'Permanent Commission',
    registeredAt: '2024-02-10T08:00:00Z',
    lastLogin: '2026-09-27 07:15 IST',
    avatarInitials: 'RV'
  },
  {
    id: 'usr-auth-02',
    email: 'patnaik@osdma.gov.in',
    password: 'ndma123',
    role: 'authority',
    fullName: 'Sub-Inspector Sunita Patnaik',
    designation: 'Coastal Emergency Operations Commander',
    organization: 'Odisha State Disaster Management Authority (OSDMA)',
    serviceId: 'OSDMA-COASTAL-881',
    commandSector: 'Bay of Bengal / Paradip & Gopalpur',
    clearanceLevel: 'Level-3 (Evacuation & Harbor Closure Dispatch)',
    stationId: 'EOC-BHUBANESWAR-HQ',
    homePort: 'Paradip Port Coastal Command',
    phone: '+91 674 2395398',
    isVerified: true,
    verificationAgency: 'Govt. of Odisha / NDMA',
    validTill: '31 Mar 2029',
    registeredAt: '2024-05-22T09:40:00Z',
    lastLogin: '2026-09-26 21:00 IST',
    avatarInitials: 'SP'
  },

  // 4. MARITIME OPERATORS
  {
    id: 'usr-op-01',
    email: 'arvind@cochinport.gov.in',
    password: 'port123',
    role: 'operator',
    fullName: 'Capt. Arvind Nair',
    designation: 'Chief Vessel Traffic Controller (VTS Master)',
    portAuthority: 'Cochin Port Authority & Fairway Control',
    vtsStationId: 'VTS-COCHIN-TOWER-02',
    pilotageLicense: 'DG-SHIPPING-PILOT-8834',
    vhfWatchChannel: 'VHF Ch 16 / Ch 12 (156.800 MHz)',
    radarCoverage: '48 Nautical Miles (S-Band & X-Band Co-located)',
    homePort: 'Willingdon Island, Cochin Port (Kerala)',
    phone: '+91 484 2582001',
    isVerified: true,
    verificationAgency: 'Directorate General of Shipping (DG Shipping)',
    validTill: '15 Aug 2028',
    registeredAt: '2024-03-01T12:00:00Z',
    lastLogin: '2026-09-27 09:10 IST',
    avatarInitials: 'AN'
  },
  {
    id: 'usr-op-02',
    email: 'deshmukh@jnpt.gov.in',
    password: 'port123',
    role: 'operator',
    fullName: 'Harbor Master K. Deshmukh',
    designation: 'Senior Marine Operations Superintendent',
    portAuthority: 'Jawaharlal Nehru Port Authority (JNPA / Mumbai)',
    vtsStationId: 'VTS-MUMBAI-APPR-01',
    pilotageLicense: 'DG-SHIPPING-PILOT-5519',
    vhfWatchChannel: 'VHF Ch 16 / Ch 69 (156.475 MHz)',
    radarCoverage: '64 Nautical Miles (Solid-State Dual Radar)',
    homePort: 'Nhava Sheva, Navi Mumbai (Maharashtra)',
    phone: '+91 22 2724 4000',
    isVerified: true,
    verificationAgency: 'Directorate General of Shipping (DG Shipping)',
    validTill: '20 Nov 2027',
    registeredAt: '2024-06-14T15:30:00Z',
    lastLogin: '2026-09-26 18:40 IST',
    avatarInitials: 'KD'
  },

  // 5. OCEAN RESEARCHERS
  {
    id: 'usr-res-01',
    email: 'ananya@incois.gov.in',
    password: 'incois123',
    role: 'researcher',
    fullName: 'Dr. Ananya Mukherjee',
    designation: 'Senior Principal Oceanographer (Satellite Bio-Optics)',
    institution: 'INCOIS Marine Fishery Division & Space Applications Centre (SAC-ISRO)',
    scientistId: 'ISRO-SAC-EO-9912',
    researchVessel: 'ORV Sagar Nidhi (IMO 8106202)',
    researchSector: 'Arabian Sea Chlorophyll & Coastal Thermal Fronts',
    sensorFocus: 'Oceansat-3 OCM-3 & INSAT-3DR Imager',
    homePort: 'INCOIS Hyderabad / Kochi Anchorage',
    phone: '+91 40 2389 5000',
    isVerified: true,
    verificationAgency: 'Ministry of Earth Sciences (MoES) / ISRO',
    validTill: '30 Jun 2029',
    registeredAt: '2024-02-28T16:00:00Z',
    lastLogin: '2026-09-27 06:00 IST',
    avatarInitials: 'AM'
  },
  {
    id: 'usr-res-02',
    email: 'krishnan@nio.res.in',
    password: 'incois123',
    role: 'researcher',
    fullName: 'Prof. R. Krishnan',
    designation: 'Chief Hydrodynamics & Wave Modeler',
    institution: 'CSIR - National Institute of Oceanography (NIO Goa)',
    scientistId: 'CSIR-NIO-WAVE-441',
    researchVessel: 'RV Sindhu Sadhana (IMO 9593232)',
    researchSector: 'Shelf Bathymetry & High Energy Swell Dissipation',
    sensorFocus: 'SARAL/AltiKa & Jason-3 Radar Altimetry',
    homePort: 'Dona Paula, Goa',
    phone: '+91 832 2450 450',
    isVerified: true,
    verificationAgency: 'Council of Scientific and Industrial Research (CSIR)',
    validTill: '12 Jan 2030',
    registeredAt: '2024-07-09T11:20:00Z',
    lastLogin: '2026-09-25 14:10 IST',
    avatarInitials: 'RK'
  }
];

// Initialize persistent DB in localStorage if not already set
function initUsersDb() {
  try {
    const existing = localStorage.getItem(USERS_DB_KEY);
    if (!existing) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(existing);
  } catch (e) {
    console.warn('Fallback initializing users DB:', e);
    return INITIAL_USERS;
  }
}

export function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) return initUsersDb();
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveAllUsers(users) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent('orca_users_updated', { detail: users }));
    return true;
  } catch (e) {
    console.error('Error saving users to local storage:', e);
    return false;
  }
}

// Current session management
export function getCurrentAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuthSession(user) {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_SESSION_KEY);
    } else {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    }
    window.dispatchEvent(new CustomEvent('orca_auth_changed', { detail: user }));
    return true;
  } catch {
    return false;
  }
}

// Authenticate user
export function authenticateUser(identifier, password) {
  const users = getAllUsers();
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const user = users.find(u => 
    (u.email.toLowerCase() === cleanId || 
     (u.realCraftReg && u.realCraftReg.toLowerCase() === cleanId) ||
     (u.serviceId && u.serviceId.toLowerCase() === cleanId) ||
     (u.phone && u.phone.replace(/[\s+-]/g, '') === cleanId.replace(/[\s+-]/g, ''))
    ) && u.password === cleanPass
  );

  if (user) {
    // Update lastLogin
    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    
    const updatedUser = { ...user, lastLogin: nowStr };
    const updatedList = users.map(u => u.id === user.id ? updatedUser : u);
    saveAllUsers(updatedList);
    setAuthSession(updatedUser);
    return { success: true, user: updatedUser };
  }

  return { 
    success: false, 
    error: 'Invalid credentials. Please verify your Email / Registered ID and Password.' 
  };
}

// Register new user
export function registerNewUser(formData) {
  const users = getAllUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
    return { success: false, error: 'A maritime personnel record with this email already exists.' };
  }

  const initials = (formData.fullName || 'User')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const newUser = {
    id: `usr-${formData.role}-${Date.now().toString(36)}`,
    ...formData,
    isVerified: formData.role === 'admin' ? true : false, // fishermen & operators start pending RealCraft validation
    verificationAgency: formData.role === 'fisherman' ? 'Dept. of Fisheries / RealCraft (Pending Inspection)' : 'Direct Maritime Registration',
    validTill: '31 Dec 2027',
    registeredAt: new Date().toISOString(),
    lastLogin: 'Active Now',
    avatarInitials: initials || 'IN'
  };

  const updatedUsers = [newUser, ...users];
  saveAllUsers(updatedUsers);
  setAuthSession(newUser);

  return { success: true, user: newUser };
}

// Admin Operations
export function verifyUserCredential(userId, isVerified = true) {
  const users = getAllUsers();
  const target = users.find(u => u.id === userId);
  if (!target) return false;

  const updated = users.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        isVerified,
        verificationAgency: isVerified 
          ? (u.verificationAgency?.replace('(Pending Inspection)', '').replace('Pending RealCraft Inspection', 'Verified by RealCraft NIC Portal') || 'RealCraft National Registry')
          : 'Suspended / Revoked by Administrator'
      };
    }
    return u;
  });

  saveAllUsers(updated);

  // If current session is this user, update session as well
  const current = getCurrentAuthSession();
  if (current && current.id === userId) {
    setAuthSession({ ...current, isVerified });
  }

  return true;
}

export function deleteUserRecord(userId) {
  const users = getAllUsers();
  const updated = users.filter(u => u.id !== userId);
  saveAllUsers(updated);
  return true;
}

export function updateUserProfile(userId, updates) {
  const users = getAllUsers();
  const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u);
  saveAllUsers(updated);

  const current = getCurrentAuthSession();
  if (current && current.id === userId) {
    setAuthSession({ ...current, ...updates });
  }

  return true;
}

export function getAdminSummaryStats() {
  const users = getAllUsers();
  const total = users.length;
  const fishermen = users.filter(u => u.role === 'fisherman').length;
  const authorities = users.filter(u => u.role === 'authority').length;
  const operators = users.filter(u => u.role === 'operator').length;
  const researchers = users.filter(u => u.role === 'researcher').length;
  const verified = users.filter(u => u.isVerified).length;
  const pending = users.filter(u => !u.isVerified).length;

  return {
    total,
    fishermen,
    authorities,
    operators,
    researchers,
    verified,
    pending,
    verifiedPercent: total > 0 ? Math.round((verified / total) * 100) : 100
  };
}
