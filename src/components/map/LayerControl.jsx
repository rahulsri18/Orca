import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Layers, Eye, EyeOff, Check, AlertTriangle, Fish, Wind, Waves, CloudLightning, ShieldAlert, Navigation, Compass, Globe } from 'lucide-react';

export const LAYER_DEFINITIONS = [
  { id: 'regions', name: 'Coastal Maritime Sectors (Pan-India)', icon: Compass, color: '#0284C7', category: 'Sectors' },
  { id: 'pfz', name: 'Potential Fishing Zones (PFZ)', icon: Fish, color: '#10B981', category: 'Biology & Catch' },
  { id: 'sst', name: 'Sea Surface Temp (SST)', icon: Globe, color: '#F97316', category: 'Oceanography' },
  { id: 'chlorophyll', name: 'Chlorophyll Concentration', icon: Layers, color: '#059669', category: 'Biology & Catch' },
  { id: 'waves', name: 'Wave / Swell Sea State', icon: Waves, color: '#0284C7', category: 'Hazards' },
  { id: 'wind', name: 'Wind Vectors & Squalls', icon: Wind, color: '#38BDF8', category: 'Meteorology' },
  { id: 'cyclone', name: 'Cyclone / Storm Cone', icon: ShieldAlert, color: '#C0392B', category: 'Hazards' },
  { id: 'lightning', name: 'Lightning Strike Clusters', icon: CloudLightning, color: '#EAB308', category: 'Hazards' },
  { id: 'tides', name: 'Tide & Surface Currents', icon: Compass, color: '#6366F1', category: 'Oceanography' },
  { id: 'protected', name: 'Marine Protected & Reefs', icon: AlertTriangle, color: '#D97706', category: 'Boundaries' },
  { id: 'vessels', name: 'Fleet AIS / Vessel GPS', icon: Navigation, color: '#0EA5E9', category: 'Navigation' },
  { id: 'boundaries', name: '12nm Territorial Waters & EEZ', icon: ShieldAlert, color: '#8B5CF6', category: 'Boundaries' },
];

export function LayerControl({ activeLayers, onToggleLayer, isOpen = false, onClose = null }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="absolute top-4 right-4 z-[500] w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-ocean-deep text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-ocean-cyan" />
          <span className="font-bold text-sm">{t('marineGisLayers', 'Marine GIS Layers')} ({Object.values(activeLayers).filter(Boolean).length}/{LAYER_DEFINITIONS.length})</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-colors"
          >
            {t('done', 'Done')}
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-100">
        {LAYER_DEFINITIONS.map((layer) => {
          const isActive = !!activeLayers[layer.id];
          const Icon = layer.icon;

          return (
            <div
              key={layer.id}
              onClick={() => onToggleLayer(layer.id)}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                isActive ? 'bg-sky-50/80 text-slate-900 font-medium' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: layer.color }}
                />
                <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? layer.color : '#94A3B8' }} />
                <span className="text-xs leading-tight">{t(layer.name)}</span>
              </div>

              <button
                type="button"
                className={`p-1 rounded-md transition-colors ${
                  isActive ? 'text-ocean-teal bg-white shadow-xs' : 'text-slate-300 hover:text-slate-500'
                }`}
              >
                {isActive ? <Eye className="w-4 h-4 text-ocean-teal" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
        <span>Data: ISRO / INCOIS / IMD</span>
        <button
          onClick={() => {
            LAYER_DEFINITIONS.forEach(l => {
              if (!activeLayers[l.id]) onToggleLayer(l.id);
            });
          }}
          className="text-ocean-teal font-semibold hover:underline"
        >
          {t('enableAll', 'Enable All')}
        </button>
      </div>
    </div>
  );
}
