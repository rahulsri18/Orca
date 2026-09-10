import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MOCK_PFZ } from '../../data/mockPfz';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { COASTAL_REGIONS } from '../../data/coastalRegions';
import { playDistressBeaconPing, playMarineWarningHorn } from '../../lib/audioService';
import { getStoredGeminiKey } from '../../services/geminiService';
import { AlertOctagon, Navigation, AlertTriangle, X, Volume2, Sparkles, Compass } from 'lucide-react';

// Fix Leaflet default icon paths if needed
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function getDistanceNm(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Earth radius in nautical miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export function MapWidget({
  activeLayers = {
    regions: true,
    pfz: true,
    sst: true,
    chlorophyll: true,
    waves: true,
    wind: true,
    cyclone: true,
    lightning: true,
    tides: false,
    protected: true,
    vessels: true,
    boundaries: true
  },
  highlightedCoordinates = null,
  onZoneSelect = null,
  onAskOrca = null,
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({});
  const [geofenceAlarm, setGeofenceAlarm] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Default center on Indian Ocean / Coastal India
    const map = L.map(mapContainerRef.current, {
      center: [12.5, 78.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    // Clean, high-performance base tile layers (NO watermark, 100% free, no Carto key required)
    const baseOsm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors • ISRO Oceansat-3 • INCOIS • IMD'
    });

    const baseSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; NASA, USGS, NOAA, ISRO'
    });

    const baseTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Marine Topo & Bathymetry'
    });

    // Add default ocean-friendly OSM base layer
    baseOsm.addTo(map);

    // Leaflet base layer switcher (topright)
    L.control.layers({
      "🌊 Marine Coastal Map": baseOsm,
      "🛰️ Satellite Imagery (EO)": baseSatellite,
      "🗺️ Oceanographic Topo": baseTopo
    }, null, { position: 'topright' }).addTo(map);

    // Reposition zoom controls to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Custom attribution
    L.control.attribution({ position: 'bottomleft' })
      .addAttribution('ISRO Oceansat-3 • INCOIS • IMD')
      .addTo(map);

    // Initialize layer groups for each of the 12 marine layers
    const layerIds = ['regions', 'pfz', 'sst', 'chlorophyll', 'waves', 'wind', 'cyclone', 'lightning', 'tides', 'protected', 'vessels', 'boundaries'];
    const groups = {};
    layerIds.forEach(id => {
      groups[id] = L.layerGroup().addTo(map);
    });
    layerGroupsRef.current = groups;

    // Populate static/mock spatial geometries on map
    populateMarineLayers(groups, map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle layer visibility toggling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.entries(activeLayers).forEach(([layerId, isVisible]) => {
      const group = layerGroupsRef.current[layerId];
      if (!group) return;

      if (isVisible) {
        if (!map.hasLayer(group)) {
          map.addLayer(group);
        }
      } else {
        if (map.hasLayer(group)) {
          map.removeLayer(group);
        }
      }
    });
  }, [activeLayers]);

  // Handle pan / zoom to highlighted coordinates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !highlightedCoordinates) return;

    const [lat, lng] = highlightedCoordinates;
    map.flyTo([lat, lng], 8, {
      animate: true,
      duration: 1.5
    });

    // Add pulse ripple marker on focus
    const rippleIcon = L.divIcon({
      className: 'custom-ripple-marker',
      html: `
        <div style="position: relative; width: 40px; height: 40px; transform: translate(-20px, -20px);">
          <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(56, 189, 248, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; top: 12px; left: 12px; width: 16px; height: 16px; border-radius: 50%; background: #0284C7; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
        </div>
      `,
      iconSize: [40, 40]
    });

    const tempMarker = L.marker([lat, lng], { icon: rippleIcon }).addTo(map);
    setTimeout(() => {
      if (map.hasLayer(tempMarker)) {
        map.removeLayer(tempMarker);
      }
    }, 8000);
  }, [highlightedCoordinates]);

  // Function to draw rich visual overlays
  const populateMarineLayers = (groups, map) => {
    // 0. Pan-India Coastal Maritime Sectors (All 9 States + Island UTs)
    if (groups.regions) {
      COASTAL_REGIONS.forEach(region => {
        const isHigh = region.riskLevel === 'HIGH';
        const isMed = region.riskLevel === 'MEDIUM';
        const badgeColor = isHigh ? '#DC2626' : isMed ? '#D97706' : '#0284C7';
        const bgGradient = isHigh
          ? 'linear-gradient(135deg, #7F1D1D, #DC2626)'
          : isMed
            ? 'linear-gradient(135deg, #78350F, #D97706)'
            : 'linear-gradient(135deg, #0B3D5C, #0284C7)';

        const sectorIcon = L.divIcon({
          className: 'coastal-sector-badge-icon',
          html: `
            <div style="background: ${bgGradient}; color: white; border: 2px solid white; border-radius: 8px; padding: 4px 8px; font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); white-space: nowrap; cursor: pointer;">
              <span style="font-size: 12px;">⚓</span>
              <span>${region.name}</span>
              <span style="font-size: 9px; padding: 1px 4px; border-radius: 4px; background: rgba(255,255,255,0.25);">${region.riskLevel}</span>
            </div>
          `,
          iconAnchor: [60, 16]
        });

        const sectorMarker = L.marker(region.coordinates, { icon: sectorIcon });

        const popupHtml = `
          <div style="padding: 12px; min-width: 280px; font-family: Inter, sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; color: #0284C7; text-transform: uppercase;">Maritime Coastal Sector</span>
              <span style="font-size: 9px; font-weight: 700; color: ${badgeColor}; background: ${isHigh ? '#FEE2E2' : isMed ? '#FEF3C7' : '#E0F2FE'}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${badgeColor}40;">
                ${region.riskLevel} RISK (${region.riskScore}/100)
              </span>
            </div>
            <div style="font-size: 14px; font-weight: 800; color: #0F172A; margin: 2px 0;">${region.name}</div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${region.state} • Coastline: <strong>${region.coastlineKm}</strong></div>
            <div style="font-size: 11px; color: ${isHigh ? '#B91C1C' : '#0369A1'}; background: ${isHigh ? '#FEF2F2' : '#F0F9FF'}; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px; font-weight: 600; border: 1px solid ${isHigh ? '#FECACA' : '#BAE6FD'};">
              ${region.statusText}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; background: #F8FAFC; padding: 6px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #E2E8F0;">
              <div><strong>Waves:</strong> ${region.waveState}</div>
              <div><strong>Wind:</strong> ${region.windState}</div>
              <div><strong>SST:</strong> ${region.sst}</div>
              <div><strong>Harbors:</strong> ${region.harbors.length} Active</div>
            </div>
            <div style="font-size: 10px; color: #64748B; margin-bottom: 8px;">
              <strong>Key Ports:</strong> ${region.harbors.slice(0, 4).join(', ')}
            </div>
            <button id="btn-region-ask-${region.id}" style="width: 100%; padding: 8px 12px; background: linear-gradient(135deg, #0B3D5C, #0284C7); color: white; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 6px rgba(11,61,92,0.25);">
              <span>✨</span>
              <span>Ask ORCA AI for ${region.name}</span>
            </button>
          </div>
        `;

        sectorMarker.bindPopup(popupHtml);
        sectorMarker.on('popupopen', () => {
          const btn = document.getElementById(`btn-region-ask-${region.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onAskOrca) {
                onAskOrca(`Evaluate marine weather, safety advisory, wave conditions, and fishing catch potential for ${region.name} (${region.state})`);
              }
              map.closePopup();
            };
          }
        });

        groups.regions.addLayer(sectorMarker);

        // Highlight operational coastal polygon / bounding area
        if (region.bounds) {
          const polygon = L.polygon(region.bounds, {
            color: badgeColor,
            fillColor: badgeColor,
            fillOpacity: isHigh ? 0.20 : 0.08,
            weight: 2,
            dashArray: isHigh ? '4, 4' : '6, 6'
          });
          groups.regions.addLayer(polygon);
        }
      });
    }

    // 1. PFZ (Potential Fishing Zones)
    MOCK_PFZ.forEach(pfz => {
      const isHigh = pfz.riskLevel === 'HIGH';
      const isMed = pfz.riskLevel === 'MEDIUM';
      const color = isHigh ? '#C0392B' : isMed ? '#E67E22' : '#2E8B57';

      const pfzIcon = L.divIcon({
        className: 'pfz-marker-icon',
        html: `
          <div style="background: ${color}; color: white; border: 2px solid white; border-radius: 9999px; padding: 4px 8px; font-weight: bold; font-size: 11px; display: flex; items-center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); white-space: nowrap;">
            <span>🐟</span>
            <span>PFZ: ${pfz.zoneName}</span>
          </div>
        `,
        iconAnchor: [35, 15]
      });

      const marker = L.marker(pfz.coordinates, { icon: pfzIcon });
      
      // Popup with zone information and "Ask ORCA" action
      const hasGemini = !!getStoredGeminiKey();
      const popupHtml = `
        <div style="padding: 12px; min-width: 240px; font-family: Inter, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
            <div style="font-size: 10px; font-weight: bold; color: #1C7293; text-transform: uppercase;">Potential Fishing Zone</div>
            <div style="font-size: 9px; font-weight: 700; color: ${hasGemini ? '#059669' : '#0284C7'}; background: ${hasGemini ? '#ECFDF5' : '#F0F9FF'}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${hasGemini ? '#A7F3D0' : '#BAE6FD'};">
              ${hasGemini ? '● Gemini Live' : '● Scenario Engine'}
            </div>
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #0F172A; margin: 2px 0;">${pfz.zoneName}</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">${pfz.region} • ${pfz.distanceNm} nm offshore</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; background: #F8FAFC; padding: 6px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #E2E8F0;">
            <div><strong>SST:</strong> ${pfz.sstCelsius}°C</div>
            <div><strong>Chl-a:</strong> ${pfz.chlorophyllMgM3} mg/m³</div>
            <div><strong>Waves:</strong> ${pfz.waveForecast}</div>
            <div><strong>Suitability:</strong> ${pfz.suitabilityScore}%</div>
          </div>
          <button id="btn-ask-${pfz.id}" style="width: 100%; padding: 7px 12px; background: linear-gradient(135deg, #0B3D5C, #1C7293); color: white; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 6px rgba(11,61,92,0.25);">
            <span>✨</span>
            <span>Ask ORCA AI (Live Gemini Reasoning)</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-ask-${pfz.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onAskOrca) onAskOrca(pfz);
            map.closePopup();
          };
        }
      });

      groups.pfz.addLayer(marker);

      // Area circle for PFZ aggregation
      const circle = L.circle(pfz.coordinates, {
        radius: 18000,
        color: color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 4'
      });
      groups.pfz.addLayer(circle);
    });

    // 2. SST Thermal Gradient (Overlay polygon)
    const sstPolygon = L.polygon([
      [8.0, 74.0],
      [11.5, 74.2],
      [10.5, 77.0],
      [7.5, 77.5]
    ], {
      color: '#F97316',
      fillColor: '#F97316',
      fillOpacity: 0.22,
      weight: 1.5
    }).bindTooltip('SST Thermal Anomaly Front (+1.4°C)', { sticky: true });
    groups.sst.addLayer(sstPolygon);

    // 3. Chlorophyll-a bio-optical plume (Bay of Bengal / Vizag offshore)
    const chlPolygon = L.polygon([
      [16.5, 82.5],
      [18.5, 84.5],
      [17.5, 86.0],
      [15.5, 83.5]
    ], {
      color: '#10B981',
      fillColor: '#10B981',
      fillOpacity: 0.25,
      weight: 1
    }).bindTooltip('High Biological Chlorophyll Front (1.45 mg/m³)', { sticky: true });
    groups.chlorophyll.addLayer(chlPolygon);

    // 4. Wave & Sea State (Rough Swell Zone off SW Coast)
    const waveZone = L.circle([9.5, 75.5], {
      radius: 75000,
      color: '#0284C7',
      fillColor: '#0284C7',
      fillOpacity: 0.25,
      weight: 2,
      dashArray: '6, 6'
    }).bindTooltip('High Swell Surge: 3.2m - 3.6m (Very Rough)', { sticky: true });
    groups.waves.addLayer(waveZone);

    // 5. Wind Vectors (Wind arrows)
    const windCoords = [
      [9.8, 75.2], [10.5, 74.8], [11.2, 74.2], [12.0, 73.8]
    ];
    windCoords.forEach(pt => {
      const windIcon = L.divIcon({
        className: 'wind-arrow-icon',
        html: `
          <div style="color: #0284C7; font-size: 18px; transform: rotate(45deg); text-shadow: 0 1px 3px rgba(255,255,255,0.8);">
            ➔ <span style="font-size: 10px; font-weight: bold; font-family: Inter;">28kts</span>
          </div>
        `,
        iconAnchor: [10, 10]
      });
      groups.wind.addLayer(L.marker(pt, { icon: windIcon }));
    });

    // 6. Cyclone Danger Cone & Track (Depression ASNA)
    const cycloneCoords = [
      [7.8, 77.0],
      [8.6, 76.2],
      [9.4, 75.4],
      [10.8, 74.2]
    ];
    const cycloneTrack = L.polyline(cycloneCoords, {
      color: '#C0392B',
      weight: 3,
      dashArray: '8, 6'
    }).bindTooltip('Cyclone Forecast Track (IMD Bulletin)', { sticky: true });
    groups.cyclone.addLayer(cycloneTrack);

    const cycloneEye = L.marker([9.4, 75.4], {
      icon: L.divIcon({
        className: 'cyclone-eye-icon',
        html: `
          <div style="background: rgba(192, 57, 43, 0.9); color: white; border-radius: 9999px; padding: 4px 8px; font-size: 11px; font-weight: bold; display: flex; items-center; gap: 4px; box-shadow: 0 0 16px rgba(192, 57, 43, 0.7); border: 2px solid white;">
            <span>🌀</span>
            <span>CYCLONE ASNA (35 kts)</span>
          </div>
        `,
        iconAnchor: [60, 15]
      })
    });
    groups.cyclone.addLayer(cycloneEye);

    // 7. Lightning Clusters
    const lightningPt = [14.85, 73.90];
    const lightningMarker = L.marker(lightningPt, {
      icon: L.divIcon({
        className: 'lightning-icon',
        html: `
          <div style="background: #EAB308; color: black; border-radius: 9999px; padding: 3px 6px; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 0 12px rgba(234, 179, 8, 0.8);">
            ⚡ Lightning Cluster (45/min)
          </div>
        `,
        iconAnchor: [45, 12]
      })
    });
    groups.lightning.addLayer(lightningMarker);

    // 8. Tides & Ocean Current Vectors
    const tidePt = [12.8, 74.6];
    const tideMarker = L.marker(tidePt, {
      icon: L.divIcon({
        className: 'tide-icon',
        html: `<div style="color: #6366F1; font-weight: bold; font-size: 11px;">🌊 Ebb Current 1.2kts ➔</div>`,
        iconAnchor: [30, 10]
      })
    });
    groups.tides.addLayer(tideMarker);

    // 9. Marine Protected & Restricted Zones
    // Gulf of Mannar Biosphere Reserve
    const mannarReserve = L.polygon([
      [8.8, 78.8],
      [9.3, 79.5],
      [9.1, 79.7],
      [8.6, 79.0]
    ], {
      color: '#D97706',
      fillColor: '#D97706',
      fillOpacity: 0.28,
      weight: 2
    }).bindTooltip('⚠️ Marine National Park Sanctuary (No Trawling Zone)', { sticky: true });
    groups.protected.addLayer(mannarReserve);

    // 10. Vessel Fleet / AIS tracking
    const sampleVessels = [
      { id: 'IND-KL-241', name: 'Matsya Sagar (FRP Boat)', coords: [9.85, 76.10], speed: '7.2 kts' },
      { id: 'IND-TN-902', name: 'Al-Madina (Mechanized)', coords: [9.15, 79.20], speed: '8.5 kts' },
      { id: 'IND-AP-441', name: 'Simhachalam (Trawler)', coords: [17.55, 83.35], speed: '6.0 kts' },
      { id: 'IND-KA-102', name: 'Karavali Queen', coords: [13.20, 74.38], speed: '9.1 kts' }
    ];

    sampleVessels.forEach(v => {
      const vIcon = L.divIcon({
        className: 'vessel-icon',
        html: `
          <div style="background: #0B3D5C; color: #38BDF8; border: 1.5px solid white; border-radius: 6px; padding: 2px 5px; font-size: 10px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,0.3); white-space: nowrap;">
            🚢 ${v.name} (${v.speed})
          </div>
        `,
        iconAnchor: [30, 10]
      });
      groups.vessels.addLayer(L.marker(v.coords, { icon: vIcon }));
    });

    // Add Draggable Craft: "YOU: Matsya-01"
    const myCraftIcon = L.divIcon({
      className: 'my-craft-icon',
      html: `
        <div style="background: #0284C7; color: white; border: 2.5px solid white; border-radius: 9999px; padding: 4px 10px; font-weight: 800; font-size: 11px; display: flex; items-center; gap: 5px; box-shadow: 0 4px 14px rgba(2,132,199,0.7); cursor: grab; white-space: nowrap;">
          <span style="font-size: 13px;">🚢</span>
          <span>YOU: Matsya-01 (Drag Me)</span>
        </div>
      `,
      iconAnchor: [65, 16]
    });

    const myCraft = L.marker([9.88, 76.18], {
      icon: myCraftIcon,
      draggable: true,
      zIndexOffset: 1000
    });

    myCraft.on('drag', (e) => {
      const pos = e.target.getLatLng();
      const distToCyclone = getDistanceNm(pos.lat, pos.lng, 9.4, 75.4);
      const distToImbl = getDistanceNm(pos.lat, pos.lng, 9.35, 79.45);

      if (distToCyclone < 45) {
        playDistressBeaconPing();
        setGeofenceAlarm({
          level: 'HIGH',
          title: 'CYCLONE ASNA SWELL ZONE BREACH',
          distanceNm: distToCyclone,
          message: `Your craft is ${distToCyclone} nm from the active cyclone depression center (35 kt gale & 3.8m swell).`,
          escapeHeading: 'Steer Heading 040° NE towards Kochi Port Shelter immediately.'
        });
      } else if (distToImbl < 12) {
        playDistressBeaconPing();
        setGeofenceAlarm({
          level: 'MEDIUM',
          title: 'NAVIC IMBL BUFFER ZONE PROXIMITY',
          distanceNm: distToImbl,
          message: `Your craft is ${distToImbl} nm from the International Maritime Boundary Line.`,
          escapeHeading: 'Alter course 270° W to remain within Indian Territorial Waters.'
        });
      } else {
        setGeofenceAlarm(null);
      }
    });

    groups.vessels.addLayer(myCraft);

    // 11. Maritime Boundaries (12nm Territorial Waters & EEZ boundary)
    const eezPoints = [
      [7.0, 77.0],
      [8.5, 75.0],
      [10.5, 73.5],
      [13.0, 72.5],
      [15.5, 71.5],
      [18.0, 70.0],
      [21.0, 68.0]
    ];
    const eezLine = L.polyline(eezPoints, {
      color: '#8B5CF6',
      weight: 2,
      dashArray: '8, 8'
    }).bindTooltip('Indian EEZ (200 Nautical Miles Limit)', { sticky: true });
    groups.boundaries.addLayer(eezLine);
  };

  return (
    <div className={`relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-marine border border-slate-200/90 ${className}`}>
      {/* Floating Geofence Alarm Card */}
      {geofenceAlarm && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-[500] max-w-md w-[90%] p-3.5 rounded-2xl shadow-2xl border flex items-start gap-3 animate-in zoom-in-95 duration-150 ${
          geofenceAlarm.level === 'HIGH'
            ? 'bg-rose-950/95 text-white border-rose-600 ring-4 ring-rose-500/30'
            : 'bg-amber-950/95 text-amber-50 border-amber-600'
        }`}>
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold tracking-wider uppercase text-[10px] text-rose-300">
                {geofenceAlarm.title}
              </span>
              <button
                onClick={() => setGeofenceAlarm(null)}
                className="text-white/60 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-white/90 leading-tight font-medium">
              {geofenceAlarm.message}
            </p>
            <div className="mt-2 p-1.5 rounded-lg bg-white/15 text-white font-mono text-[11px] flex items-center gap-1.5 font-bold">
              <Navigation className="w-3.5 h-3.5 text-sky-300 rotate-45" />
              <span>{geofenceAlarm.escapeHeading}</span>
            </div>

            {onAskOrca && (
              <div className="mt-2.5 pt-2 border-t border-white/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onAskOrca(`Emergency: ${geofenceAlarm.title}. ${geofenceAlarm.message} What is the fastest and safest escape route and emergency survival protocol?`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white text-rose-950 hover:bg-rose-50 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>Consult Gemini AI on Escape Route</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
    </div>
  );
}
