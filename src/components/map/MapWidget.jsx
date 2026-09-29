import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MOCK_PFZ } from '../../data/mockPfz';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { COASTAL_REGIONS } from '../../data/coastalRegions';
import { playDistressBeaconPing, playMarineWarningHorn } from '../../lib/audioService';
import { getStoredGeminiKey } from '../../services/geminiService';
import { AlertOctagon, Navigation, AlertTriangle, X, Volume2, Sparkles, Compass, Wind } from 'lucide-react';

// Fix Leaflet default icon paths
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
  thermalVision = false,
  thermalPreset = 'all', // 'all' | 'cyclone' | 'wind' | 'sst'
  onThermalProbe = null,
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({});
  const baseLayersRef = useRef({});
  const isInitialMountRef = useRef(true);
  const [geofenceAlarm, setGeofenceAlarm] = useState(null);

  // Initialize Map & Tile Base Layers
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [15.0, 78.5],
      zoom: 5,
      zoomControl: false,
      attributionControl: false
    });

    // 1. Dark Ocean Base Layer (Ideal for High-Contrast Thermal Infrared Vision)
    const baseDark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; NASA, NOAA, INCOIS Dark Ocean Basemap'
    });

    // 2. Standard Coastal OSM Layer
    const baseOsm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors • ISRO Oceansat-3 • INCOIS'
    });

    // 3. Satellite Imagery
    const baseSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; NASA, USGS, ISRO EO'
    });

    // 4. Oceanographic Topo
    const baseTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Marine Topo & Bathymetry'
    });

    baseLayersRef.current = {
      dark: baseDark,
      osm: baseOsm,
      satellite: baseSatellite,
      topo: baseTopo
    };

    // Default to Dark base for Thermal Vision or OSM
    if (thermalVision) {
      baseDark.addTo(map);
    } else {
      baseOsm.addTo(map);
    }

    // Leaflet base layer control (topright)
    L.control.layers({
      "🌊 Marine Coastal Map (Default)": baseOsm,
      "🌡️ Thermal Radar Dark": baseDark,
      "🛰️ Satellite Imagery (EO)": baseSatellite,
      "🗺️ Oceanographic Topo": baseTopo
    }, null, { position: 'topright' }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.control.attribution({ position: 'bottomleft' })
      .addAttribution('ISRO Oceansat-3 • INCOIS • IMD Thermal IR')
      .addTo(map);

    // Initialize layer groups for standard GIS + dedicated thermal group
    const layerIds = [
      'regions', 'pfz', 'sst', 'chlorophyll', 'waves', 'wind',
      'cyclone', 'lightning', 'tides', 'protected', 'vessels', 'boundaries',
      'thermal'
    ];
    const groups = {};
    layerIds.forEach(id => {
      groups[id] = L.layerGroup().addTo(map);
    });
    layerGroupsRef.current = groups;

    // Populate standard maritime spatial geometries
    populateMarineLayers(groups, map);

    // Populate high-impact Thermal Vision Overlays
    populateThermalLayers(groups.thermal, map, thermalPreset, onAskOrca, onZoneSelect);

    // Real-time Thermal Cursor Probe calculation
    map.on('mousemove', (e) => {
      const lat = parseFloat(e.latlng.lat.toFixed(2));
      const lng = parseFloat(e.latlng.lng.toFixed(2));
      
      const distToAsna = getDistanceNm(lat, lng, 19.2, 67.5);
      const distToBob = getDistanceNm(lat, lng, 18.5, 84.8);

      let sst = 28.5;
      let cloudTopTemp = -18.0;
      let windKt = 16;
      let windDir = '270° W';
      let category = 'Normal Marine Surface Conditions';

      if (distToAsna < 50) {
        sst = 30.8;
        cloudTopTemp = -82.4;
        windKt = 50;
        windDir = '285° WNW';
        category = 'CYCLONE ASNA CONVECTIVE EYEWALL (Violent Cyclone Core)';
      } else if (distToAsna < 120) {
        sst = 30.2;
        cloudTopTemp = -68.5;
        windKt = 38;
        windDir = '275° W';
        category = 'CYCLONE ASNA GALE FORCE SQUALL RING (Dangerous Swell Surge)';
      } else if (distToAsna < 220) {
        sst = 29.8;
        cloudTopTemp = -52.0;
        windKt = 28;
        windDir = '260° WSW';
        category = 'CYCLONE ASNA OUTER SPIRAL FEEDER BAND';
      } else if (distToBob < 60) {
        sst = 30.0;
        cloudTopTemp = -74.2;
        windKt = 36;
        windDir = '230° SW';
        category = 'DEEP DEPRESSION BOB-05 CONVECTIVE CLUSTER (Heavy Squall)';
      } else if (distToBob < 140) {
        sst = 29.5;
        cloudTopTemp = -58.0;
        windKt = 28;
        windDir = '210° SSW';
        category = 'BAY OF BENGAL SQUALL INFLOW BELT (Odisha / AP Offshore)';
      } else if (lat < 13.0 && lng > 73.5 && lng < 77.0) {
        sst = 28.8;
        cloudTopTemp = -38.0;
        windKt = 28;
        windDir = '245° WSW';
        category = 'SOUTHWEST MONSOON SQUALL CORRIDOR (Kallakkadal Surge)';
      }

      if (onThermalProbe) {
        onThermalProbe({ lat, lng, sst, cloudTopTemp, windKt, windDir, category });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle thermal vision toggling and switching base layer & thermal group
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { dark, osm } = baseLayersRef.current;
    const thermalGroup = layerGroupsRef.current.thermal;

    if (thermalVision) {
      if (osm && map.hasLayer(osm)) map.removeLayer(osm);
      if (dark && !map.hasLayer(dark)) map.addLayer(dark);
      if (thermalGroup && !map.hasLayer(thermalGroup)) map.addLayer(thermalGroup);

      // Refresh thermal layers for the selected preset
      if (thermalGroup) {
        thermalGroup.clearLayers();
        populateThermalLayers(thermalGroup, map, thermalPreset, onAskOrca, onZoneSelect);
      }
    } else {
      if (dark && map.hasLayer(dark)) map.removeLayer(dark);
      if (osm && !map.hasLayer(osm)) map.addLayer(osm);
      if (thermalGroup && map.hasLayer(thermalGroup)) map.removeLayer(thermalGroup);
    }
  }, [thermalVision, thermalPreset]);

  // Handle standard GIS layer visibility toggling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.entries(activeLayers).forEach(([layerId, isVisible]) => {
      const group = layerGroupsRef.current[layerId];
      if (!group) return;

      if (isVisible) {
        if (!map.hasLayer(group)) map.addLayer(group);
      } else {
        if (map.hasLayer(group)) map.removeLayer(group);
      }
    });
  }, [activeLayers]);

  // Handle pan / center to highlighted coordinates on explicit user action
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !highlightedCoordinates) return;

    // Do NOT trigger any zooming or pan animation on initial page load
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    const [lat, lng] = highlightedCoordinates;
    // Smoothly pan to the coordinates without altering user's manual zoom level
    map.panTo([lat, lng], {
      animate: true,
      duration: 0.8
    });

    const rippleIcon = L.divIcon({
      className: 'custom-ripple-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; transform: translate(-22px, -22px);">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(46, 175, 208, 0.5); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; top: 14px; left: 14px; width: 16px; height: 16px; border-radius: 50%; background: #2EAFD0; border: 3px solid white; box-shadow: 0 0 14px rgba(46,175,208,0.8);"></div>
        </div>
      `,
      iconSize: [44, 44]
    });

    const tempMarker = L.marker([lat, lng], { icon: rippleIcon }).addTo(map);
    setTimeout(() => {
      if (map.hasLayer(tempMarker)) {
        map.removeLayer(tempMarker);
      }
    }, 6000);
  }, [highlightedCoordinates]);

  // =========================================================================
  // THERMAL MAP VISION GENERATOR (INSAT-3D IR Cloud Tops & Wind Speed Heatmap)
  // =========================================================================
  const populateThermalLayers = (group, map, preset, onAskOrcaCallback, onZoneSelectCallback) => {
    if (!group) return;

    const showCyclone = preset === 'all' || preset === 'cyclone';
    const showWind = preset === 'all' || preset === 'wind';
    const showSst = preset === 'all' || preset === 'sst';

    // 1. CYCLONE ASNA THERMAL INFRARED VORTEX (Arabian Sea [19.2, 67.5])
    if (showCyclone) {
      // Concentric Convective IR Rings (Dvorak Eyewall Scale)
      const asnaRings = [
        { radius: 38000, color: '#FFFFFF', fill: '#FFFFFF', opacity: 0.95, desc: 'White-Hot Eyewall (-82.4°C / 50 kt Gale Core)' },
        { radius: 78000, color: '#9333EA', fill: '#7E22CE', opacity: 0.75, desc: 'Deep Convective Core (-75°C to -80°C)' },
        { radius: 145000, color: '#DC2626', fill: '#B91C1C', opacity: 0.60, desc: 'Gale Velocity Ring (-65°C / 38-48 kt)' },
        { radius: 230000, color: '#EA580C', fill: '#C2410C', opacity: 0.42, desc: 'Outer Squall Band (-50°C / 28-34 kt)' },
        { radius: 340000, color: '#D97706', fill: '#B45309', opacity: 0.25, desc: 'Inflow Circulation (-35°C / 20-27 kt)' }
      ];

      asnaRings.forEach(ring => {
        const c = L.circle([19.2, 67.5], {
          radius: ring.radius,
          color: ring.color,
          fillColor: ring.fill,
          fillOpacity: ring.opacity,
          weight: 1.5,
          dashArray: '3, 4'
        }).bindTooltip(`Cyclone ASNA Thermal IR: ${ring.desc}`, { sticky: true });
        group.addLayer(c);
      });

      // Animated Cyclone Eyewall Badge
      const asnaEyeIcon = L.divIcon({
        className: 'cyclone-thermal-eye-asna',
        html: `
          <div style="background: linear-gradient(135deg, #7E22CE, #DC2626); color: white; border: 2.5px solid white; border-radius: 9999px; padding: 5px 12px; font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 6px; box-shadow: 0 0 25px rgba(220,38,38,0.9); cursor: pointer; white-space: nowrap; font-family: 'JetBrains Mono', monospace;">
            <span style="font-size: 14px; animation: spin 2.5s linear infinite; display: inline-block;">🌀</span>
            <span>CYCLONE ASNA • THERMAL EYE (-82.4°C • 50 kt)</span>
          </div>
        `,
        iconAnchor: [120, 16]
      });

      const asnaEyeMarker = L.marker([19.2, 67.5], { icon: asnaEyeIcon });
      const asnaPopup = `
        <div style="font-family: Inter, sans-serif; min-width: 280px; padding: 6px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background: #7E22CE; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-family: monospace;">INSAT-3D THERMAL IR</span>
            <span style="background: #DC2626; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">HIGH RISK • LEVEL 3</span>
          </div>
          <h3 style="font-size: 14px; font-weight: 800; color: #071A2B; margin: 0 0 4px 0;">CYCLONIC STORM ASNA</h3>
          <p style="font-size: 11px; color: #334155; line-height: 1.4; margin-bottom: 8px;">
            Centered in North Arabian Sea (19.20°N, 67.50°E). White-hot convective eyewall indicates rapid thermodynamic deepening fueled by high SST (30.8°C).
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; background: #F8FAFC; padding: 6px; border-radius: 6px; margin-bottom: 8px; font-family: monospace; border: 1px solid #E2E8F0;">
            <div><strong>Cloud Top:</strong> -82.4°C</div>
            <div><strong>Max Gale:</strong> 50 kt (92 km/h)</div>
            <div><strong>Pressure:</strong> 988 hPa</div>
            <div><strong>SST Fuel:</strong> 30.8°C (Extreme)</div>
          </div>
          <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 6px; border-radius: 6px; font-size: 11px; color: #991B1B; font-weight: 700; margin-bottom: 8px;">
            ⚠️ 3.4m - 4.2m swell surge impacting Saurashtra & Konkan coasts. Total fishing ban active.
          </div>
          <button id="btn-ask-asna" style="width: 100%; padding: 8px 12px; background: linear-gradient(135deg, #7E22CE, #DC2626); color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: 800; font-family: monospace; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>✨</span>
            <span>Consult ORCA AI on Cyclone ASNA Vector</span>
          </button>
        </div>
      `;

      asnaEyeMarker.bindPopup(asnaPopup);
      asnaEyeMarker.on('popupopen', () => {
        const btn = document.getElementById('btn-ask-asna');
        if (btn && onAskOrcaCallback) {
          btn.onclick = () => {
            onAskOrcaCallback('Analyze Cyclone ASNA thermal infrared cloud-top dynamics, projected 48h landfall vector, and coastal gale storm surge safety protocol.');
            map.closePopup();
          };
        }
      });
      asnaEyeMarker.on('click', () => {
        if (onZoneSelectCallback) {
          onZoneSelectCallback({
            type: 'cyclone',
            title: 'CYCLONE ASNA (THERMAL EYE)',
            category: 'Tropical Cyclonic Storm (INSAT-3D IR)',
            wind: '50 kt (Gale / Storm Force)',
            pressure: '988 hPa',
            updated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST',
            coordinates: [19.2, 67.5],
            status: 'HIGH RISK / LEVEL 3',
            threat: 'Convective cloud tops -82.4°C with 3.8m swells across Gujarat & Maharashtra offshore.'
          });
        }
      });

      group.addLayer(asnaEyeMarker);

      // Cyclone ASNA Spiral Feeder Polylines
      const asnaFeeder1 = L.polyline([
        [21.8, 65.2], [20.6, 66.2], [19.8, 67.1], [19.2, 67.5]
      ], { color: '#EF4444', weight: 3, opacity: 0.8, dashArray: '6, 6' });
      group.addLayer(asnaFeeder1);

      const asnaFeeder2 = L.polyline([
        [17.0, 71.0], [17.8, 69.5], [18.6, 68.3], [19.2, 67.5]
      ], { color: '#F97316', weight: 3, opacity: 0.8, dashArray: '6, 6' });
      group.addLayer(asnaFeeder2);
    }

    // 2. BOB-05 DEEP DEPRESSION THERMAL CONVECTIVE PLUME (Bay of Bengal [18.5, 84.8])
    if (showCyclone) {
      const bobRings = [
        { radius: 45000, color: '#9333EA', fill: '#7E22CE', opacity: 0.80, desc: 'Convective Core (-74°C / 36 kt)' },
        { radius: 110000, color: '#DC2626', fill: '#B91C1C', opacity: 0.55, desc: 'Heavy Squall Front (-60°C / 30-38 kt)' },
        { radius: 190000, color: '#EA580C', fill: '#C2410C', opacity: 0.35, desc: 'Coastal Squall Zone (-45°C / 24-30 kt)' },
        { radius: 290000, color: '#D97706', fill: '#B45309', opacity: 0.20, desc: 'Outer Inflow (-30°C / 18-24 kt)' }
      ];

      bobRings.forEach(ring => {
        const c = L.circle([18.5, 84.8], {
          radius: ring.radius,
          color: ring.color,
          fillColor: ring.fill,
          fillOpacity: ring.opacity,
          weight: 1.5,
          dashArray: '4, 4'
        }).bindTooltip(`BOB-05 Convective Plume: ${ring.desc}`, { sticky: true });
        group.addLayer(c);
      });

      const bobMarker = L.marker([18.5, 84.8], {
        icon: L.divIcon({
          className: 'bob-thermal-marker',
          html: `
            <div style="background: linear-gradient(135deg, #7E22CE, #DC2626); color: white; border: 2.5px solid white; border-radius: 9999px; padding: 5px 12px; font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 6px; box-shadow: 0 0 25px rgba(220,38,38,0.9); cursor: pointer; white-space: nowrap; font-family: 'JetBrains Mono', monospace;">
              <span style="font-size: 14px; animation: spin 3s linear infinite; display: inline-block;">🌀</span>
              <span>BOB-05 DEPRESSION • SQUALL FRONT (-74.2°C • 36 kt)</span>
            </div>
          `,
          iconAnchor: [130, 16]
        })
      });
      group.addLayer(bobMarker);
    }

    // 3. REGIONAL THERMAL WIND SPEED HEATMAP FIELDS (knots)
    if (showWind) {
      // Zone A: North Arabian Sea Gale Field (35 - 50 kt) -> Crimson/Violet Thermal
      const galeField = L.polygon([
        [17.0, 64.5], [22.0, 65.0], [21.5, 70.0], [17.5, 69.2]
      ], {
        color: '#DC2626',
        fillColor: '#9333EA',
        fillOpacity: 0.35,
        weight: 1.5,
        dashArray: '4, 4'
      }).bindTooltip('Thermal Wind Field: 35-50 kt Severe Gale (Beaufort 8-10)', { sticky: true });
      group.addLayer(galeField);

      // Zone B: SW Monsoon Coastal Squall Corridor off Kerala/Karnataka (25 - 34 kt) -> Orange Thermal
      const monsoonSquallField = L.polygon([
        [8.2, 74.0], [13.5, 72.5], [13.2, 74.8], [8.0, 76.8]
      ], {
        color: '#EA580C',
        fillColor: '#F97316',
        fillOpacity: 0.30,
        weight: 1.5,
        dashArray: '5, 5'
      }).bindTooltip('Thermal Wind Field: 25-34 kt Strong Monsoon Squall (Beaufort 6-7)', { sticky: true });
      group.addLayer(monsoonSquallField);

      // Zone C: West-Central Bay of Bengal Inflow Field (28 - 38 kt) -> Crimson/Orange Thermal
      const bobWindField = L.polygon([
        [15.5, 82.5], [20.0, 84.5], [19.2, 88.5], [15.0, 85.5]
      ], {
        color: '#DC2626',
        fillColor: '#EF4444',
        fillOpacity: 0.30,
        weight: 1.5,
        dashArray: '5, 5'
      }).bindTooltip('Thermal Wind Field: 28-38 kt Cyclonic Squall Inflow (Beaufort 7-8)', { sticky: true });
      group.addLayer(bobWindField);

      // Zone D: Gulf of Mannar Thermal Choke Corridor (22 - 28 kt) -> Amber Thermal
      const mannarChokeField = L.polygon([
        [8.0, 78.2], [9.8, 79.5], [9.2, 80.4], [7.6, 79.2]
      ], {
        color: '#D97706',
        fillColor: '#F59E0B',
        fillOpacity: 0.28,
        weight: 1.5
      }).bindTooltip('Thermal Wind Field: 22-28 kt Choke Point Wind Velocity (Beaufort 5-6)', { sticky: true });
      group.addLayer(mannarChokeField);

      // Dynamic Animated Rotating Wind Vector Barbs (Speed in Knots)
      const windVectors = [
        { lat: 19.5, lng: 66.2, kt: 48, dir: '290° WNW', color: '#9333EA', desc: 'Cyclone ASNA Eyewall Gale' },
        { lat: 18.0, lng: 68.2, kt: 38, dir: '275° W', color: '#DC2626', desc: 'North Arabian Sea Gale' },
        { lat: 16.5, lng: 71.0, kt: 28, dir: '260° WSW', color: '#EA580C', desc: 'Konkan Offshore Squall' },
        { lat: 14.0, lng: 72.8, kt: 26, dir: '250° WSW', color: '#EA580C', desc: 'Goa/Karnataka Offshore' },
        { lat: 11.2, lng: 74.2, kt: 28, dir: '245° WSW', color: '#EA580C', desc: 'Malabar Swell Run' },
        { lat: 9.8, lng: 75.3, kt: 28, dir: '240° WSW', color: '#EA580C', desc: 'Kochi Offshore Corridor' },
        { lat: 8.0, lng: 76.8, kt: 30, dir: '235° SW', color: '#EA580C', desc: 'Kanyakumari Cape Wind' },
        { lat: 8.8, lng: 79.2, kt: 25, dir: '220° SW', color: '#D97706', desc: 'Gulf of Mannar Funnel' },
        { lat: 13.2, lng: 81.0, kt: 18, dir: '200° SSW', color: '#10B981', desc: 'Chennai Coastal Breeze' },
        { lat: 17.5, lng: 84.0, kt: 35, dir: '230° SW', color: '#DC2626', desc: 'Visakhapatnam BOB Squall' },
        { lat: 19.0, lng: 85.5, kt: 32, dir: '225° SW', color: '#DC2626', desc: 'Gopalpur Coastal Squall' },
        { lat: 21.0, lng: 88.0, kt: 24, dir: '210° SSW', color: '#D97706', desc: 'Sundarbans Outer Reef' },
        { lat: 10.5, lng: 72.0, kt: 14, dir: '280° WNW', color: '#0284C7', desc: 'Lakshadweep Basin Calm' },
        { lat: 11.5, lng: 92.5, kt: 16, dir: '250° WSW', color: '#10B981', desc: 'Andaman Sea Breeze' }
      ];

      windVectors.forEach(wv => {
        const marker = L.marker([wv.lat, wv.lng], {
          icon: L.divIcon({
            className: 'thermal-wind-vector',
            html: `
              <div style="background: rgba(7, 26, 43, 0.85); border: 1.5px solid ${wv.color}; color: ${wv.color}; border-radius: 6px; padding: 2px 6px; font-weight: 800; font-size: 10px; font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 10px ${wv.color}60; white-space: nowrap; cursor: pointer;">
                <span style="display: inline-block; transform: rotate(45deg);">➔</span>
                <span>${wv.kt} kt</span>
              </div>
            `,
            iconAnchor: [24, 10]
          })
        }).bindTooltip(`${wv.desc}: ${wv.kt} knots (${wv.dir})`, { sticky: true });

        group.addLayer(marker);
      });
    }

    // 4. SST OCEANIC THERMAL HEAT CONTENT (TCWV & Hot Fuel Pools)
    if (showSst) {
      // Hot Water Pool >30.5°C fueling Cyclone ASNA off Gujarat
      const asnaFuelPool = L.polygon([
        [18.0, 66.0], [21.0, 66.5], [21.5, 69.5], [18.5, 68.5]
      ], {
        color: '#DC2626',
        fillColor: '#FF4500',
        fillOpacity: 0.28,
        weight: 1.5,
        dashArray: '3, 3'
      }).bindTooltip('SST Thermal Fuel Reservoir: 30.5°C - 31.0°C (High Cyclogenesis Fuel)', { sticky: true });
      group.addLayer(asnaFuelPool);

      // Bay of Bengal High Heat Pool >30.0°C fueling BOB-05
      const bobFuelPool = L.polygon([
        [16.0, 83.5], [19.5, 84.5], [18.5, 87.5], [15.0, 86.0]
      ], {
        color: '#EA580C',
        fillColor: '#FF6347',
        fillOpacity: 0.25,
        weight: 1.5,
        dashArray: '3, 3'
      }).bindTooltip('SST Thermal Fuel Reservoir: 29.8°C - 30.4°C (Tropical Cyclone Heat Potential)', { sticky: true });
      group.addLayer(bobFuelPool);
    }
  };

  // Standard Marine GIS Overlays
  const populateMarineLayers = (groups, map) => {
    // 0. Coastal Maritime Sectors
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
            <div style="background: ${bgGradient}; color: white; border: 1.5px solid white; border-radius: 6px; padding: 3px 6px; font-weight: 800; font-size: 10px; font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); white-space: nowrap; cursor: pointer;">
              <span>⚓</span>
              <span>${region.name}</span>
              <span style="font-size: 8px; padding: 1px 3px; border-radius: 3px; background: rgba(255,255,255,0.25);">${region.riskLevel}</span>
            </div>
          `,
          iconAnchor: [50, 14]
        });

        const sectorMarker = L.marker(region.coordinates, { icon: sectorIcon });
        groups.regions.addLayer(sectorMarker);

        if (region.bounds) {
          const polygon = L.polygon(region.bounds, {
            color: badgeColor,
            fillColor: badgeColor,
            fillOpacity: isHigh ? 0.15 : 0.06,
            weight: 1.5,
            dashArray: isHigh ? '4, 4' : '6, 6'
          });
          groups.regions.addLayer(polygon);
        }
      });
    }

    // 1. Potential Fishing Zones (PFZs)
    if (groups.pfz) {
      MOCK_PFZ.forEach(pfz => {
        const isHigh = pfz.riskLevel === 'HIGH';
        const color = isHigh ? '#C0392B' : '#10B981';

        const pfzIcon = L.divIcon({
          className: 'pfz-marker-icon',
          html: `
            <div style="background: ${color}; color: white; border: 1.5px solid white; border-radius: 9999px; padding: 2px 7px; font-weight: bold; font-size: 10px; display: flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); white-space: nowrap;">
              <span>🐟</span>
              <span>PFZ: ${pfz.zoneName}</span>
            </div>
          `,
          iconAnchor: [30, 12]
        });

        const marker = L.marker(pfz.coordinates, { icon: pfzIcon });
        groups.pfz.addLayer(marker);

        const circle = L.circle(pfz.coordinates, {
          radius: 16000,
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '3, 3'
        });
        groups.pfz.addLayer(circle);
      });
    }

    // 2. Swell & Sea State
    if (groups.waves) {
      const waveZone = L.circle([9.5, 75.5], {
        radius: 75000,
        color: '#0284C7',
        fillColor: '#0284C7',
        fillOpacity: 0.20,
        weight: 1.5,
        dashArray: '6, 6'
      }).bindTooltip('High Swell Surge: 3.2m - 3.6m (Very Rough)', { sticky: true });
      groups.waves.addLayer(waveZone);
    }

    // 3. Lightning Clusters
    if (groups.lightning) {
      const lightningMarker = L.marker([14.85, 73.90], {
        icon: L.divIcon({
          className: 'lightning-icon',
          html: `
            <div style="background: #EAB308; color: black; border-radius: 9999px; padding: 2px 6px; font-size: 9px; font-weight: bold; border: 1.5px solid white; box-shadow: 0 0 12px rgba(234, 179, 8, 0.8);">
              ⚡ Lightning (45/min)
            </div>
          `,
          iconAnchor: [40, 10]
        })
      });
      groups.lightning.addLayer(lightningMarker);
    }

    // 4. Draggable Craft: "YOU: Matsya-01"
    if (groups.vessels) {
      const myCraftIcon = L.divIcon({
        className: 'my-craft-icon',
        html: `
          <div style="background: #0284C7; color: white; border: 2.5px solid white; border-radius: 9999px; padding: 3px 8px; font-weight: 800; font-size: 10px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(2,132,199,0.7); cursor: grab; white-space: nowrap;">
            <span style="font-size: 12px;">🚢</span>
            <span>YOU: Matsya-01</span>
          </div>
        `,
        iconAnchor: [55, 14]
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
    }

    // 5. EEZ Boundary
    if (groups.boundaries) {
      const eezPoints = [
        [7.0, 77.0], [8.5, 75.0], [10.5, 73.5], [13.0, 72.5],
        [15.5, 71.5], [18.0, 70.0], [21.0, 68.0]
      ];
      const eezLine = L.polyline(eezPoints, {
        color: '#8B5CF6',
        weight: 1.5,
        dashArray: '8, 8'
      }).bindTooltip('Indian EEZ (200 NM Limit)', { sticky: true });
      groups.boundaries.addLayer(eezLine);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[420px] rounded-lg overflow-hidden border border-[#18476F] ${className}`}>
      {/* Floating Geofence Alarm Card */}
      {geofenceAlarm && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-[500] max-w-md w-[90%] p-3 rounded-lg shadow-2xl border flex items-start gap-3 animate-in zoom-in-95 duration-150 ${
          geofenceAlarm.level === 'HIGH'
            ? 'bg-rose-950/95 text-white border-rose-600 ring-2 ring-rose-500/40'
            : 'bg-amber-950/95 text-amber-50 border-amber-600'
        }`}>
          <div className="p-1.5 rounded bg-white/10 shrink-0">
            <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold tracking-wider uppercase text-[10px] text-rose-300 font-mono">
                {geofenceAlarm.title}
              </span>
              <button
                onClick={() => setGeofenceAlarm(null)}
                className="text-white/60 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-white/90 leading-tight font-sans">
              {geofenceAlarm.message}
            </p>
            <div className="mt-1.5 p-1 rounded bg-white/15 text-white font-mono text-[11px] flex items-center gap-1.5 font-bold">
              <Navigation className="w-3.5 h-3.5 text-cyan-300 rotate-45" />
              <span>{geofenceAlarm.escapeHeading}</span>
            </div>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
    </div>
  );
}
