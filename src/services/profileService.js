/**
 * Maritime Profile & Identity Management Service
 * Built for Smart India Hackathon (SIH26176 / ISRO Disaster Management)
 * 
 * Manages official government-aligned maritime identities for Indian seafarers,
 * coastal fishermen, disaster authorities, port operators, and ocean researchers.
 * Integrates with RealCraft, NavIC S-band hardware identifiers, and IMO/MMSI standards.
 */

const STORAGE_KEY = 'orca_user_profile';

export const DEFAULT_PROFILES = {
  fisherman: {
    role: 'fisherman',
    fullName: 'Capt. Murugan Sundaram',
    aadhaarMasked: 'XXXX-XXXX-8912',
    biometricId: 'IN-BIO-KER-2024-99812',
    vesselName: 'Matsya-01 (KL-07-EF-4421)',
    callSign: 'VTA-4421',
    realCraftReg: 'IND-KL-07-MM-4421',
    navicTransponderId: 'SAC-NAVIC-S-88192',
    mmsi: '419001421',
    homePort: 'Kochi Old Fishing Harbor, Thoppumpady (Kerala)',
    cooperative: 'Matsyafed Coastal Cooperative Society #24',
    hullType: '12m Motorized Fiberglass (FRP Trawler)',
    engineHp: '24 HP Yamaha / Ashok Leyland Outboard',
    crewCount: 4,
    lifeJacketCount: 6,
    fuelEnduranceHours: 18,
    fuelLiters: 200,
    emergencyContact: '+91 98470 12345 (Harbor Master Neendakara)',
    isGovtVerified: true,
    verificationAgency: 'Dept. of Fisheries (Govt. of India / RealCraft)',
    validTill: '31 Dec 2027',
    smsAlerts: true,
    audioHornAlerts: true,
    lowBandwidthMode: false
  },
  authority: {
    role: 'authority',
    fullName: 'Cmdr. Rajesh Verma (Retd.)',
    serviceId: 'GOI-NDMA-OPS-7721',
    designation: 'Deputy Director (Maritime Disaster Operations)',
    organization: 'National Disaster Management Authority (NDMA) & MRCC',
    commandSector: 'Southwest Arabian Sea & Lakshadweep Waters',
    clearanceLevel: 'Level-4 (Code Red Cyclone Siren Dispatch Authority)',
    contactPhone: '1554 / 0484-2216444',
    stationId: 'MRCC-KOCHI-HQ',
    isGovtVerified: true,
    verificationAgency: 'Ministry of Home Affairs / Indian Coast Guard',
    validTill: 'Permanent Commission',
    smsAlerts: true,
    audioHornAlerts: true,
    lowBandwidthMode: false
  },
  operator: {
    role: 'operator',
    fullName: 'Capt. Arvind Nair',
    designation: 'Chief Vessel Traffic Controller (VTS Master)',
    portAuthority: 'Cochin Port Authority & Fairway Control',
    vtsStationId: 'VTS-COCHIN-TOWER-02',
    pilotageLicense: 'DG-SHIPPING-PILOT-8834',
    vhfWatchChannel: 'VHF Ch 16 / Ch 12 (156.800 MHz)',
    radarCoverage: '48 Nautical Miles (S-Band & X-Band Co-located)',
    isGovtVerified: true,
    verificationAgency: 'Directorate General of Shipping (DG Shipping)',
    validTill: '15 Aug 2028',
    smsAlerts: true,
    audioHornAlerts: true,
    lowBandwidthMode: false
  },
  researcher: {
    role: 'researcher',
    fullName: 'Dr. Ananya Mukherjee',
    designation: 'Senior Principal Oceanographer (Satellite Bio-Optics)',
    institution: 'INCOIS Marine Fishery Division & Space Applications Centre (SAC-ISRO)',
    scientistId: 'ISRO-SAC-EO-9912',
    researchVessel: 'ORV Sagar Nidhi (IMO 8106202)',
    researchSector: 'Arabian Sea Chlorophyll & Coastal Thermal Fronts',
    sensorFocus: 'Oceansat-3 OCM-3 & INSAT-3DR Imager',
    isGovtVerified: true,
    verificationAgency: 'Ministry of Earth Sciences (MoES) / ISRO',
    validTill: '30 Jun 2029',
    smsAlerts: true,
    audioHornAlerts: true,
    lowBandwidthMode: false
  }
};

export function getStoredUserProfile(role = 'fisherman') {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role === role) {
        return { ...DEFAULT_PROFILES[role], ...parsed };
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored user profile:', err);
  }
  return DEFAULT_PROFILES[role] || DEFAULT_PROFILES.fisherman;
}

export function saveStoredUserProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('orca_profile_updated', { detail: profile }));
    return true;
  } catch (err) {
    console.error('Failed to save user profile:', err);
    return false;
  }
}

export function simulateGovtVerification(regNumber) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        verified: true,
        agency: 'RealCraft National Marine Registry (NIC)',
        timestamp: new Date().toISOString(),
        token: `GOI-RC-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'VALID & ACTIVE ON INCOIS COASTAL ROSTER'
      });
    }, 1200);
  });
}
