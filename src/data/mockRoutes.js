export const HARBORS = [
  { id: 'MNG', name: 'New Mangalore Port / Malpe', coordinates: [13.15, 74.45], region: 'Karnataka' },
  { id: 'KOC', name: 'Kochi Port & Fishing Harbor', coordinates: [9.9312, 76.2673], region: 'Kerala' },
  { id: 'KRW', name: 'Karwar Baithkol Harbor', coordinates: [14.805, 74.125], region: 'Karnataka' },
  { id: 'VZG', name: 'Visakhapatnam Fishing Harbor', coordinates: [17.6868, 83.2185], region: 'Andhra Pradesh' },
  { id: 'CHN', name: 'Kasimedu Fishing Harbor, Chennai', coordinates: [13.125, 80.301], region: 'Tamil Nadu' },
  { id: 'BOM', name: 'Sassoon Docks, Mumbai', coordinates: [18.915, 72.825], region: 'Maharashtra' }
];

export const MOCK_ROUTES = {
  'KOC-MNG': {
    origin: 'Kochi',
    destination: 'Mangalore',
    directRoute: {
      distanceNm: 58.4,
      estimatedHours: 4.8,
      maxWaveHeight: 4.2,
      riskLevel: 'HIGH',
      riskScore: 88,
      riskWarning: 'Crosses active 4.2m breaking swell zone off submerged rocky shoals and severe coastal squall front.',
      waypoints: [
        [9.9312, 76.2673],
        [10.80, 75.80],
        [11.90, 75.30],
        [12.914, 74.856]
      ],
      segments: [
        { from: 'Kochi Departure', to: 'Ponnani Shoals', risk: 'HIGH', wave: '3.8m' },
        { from: 'Ponnani Shoals', to: 'Kozhikode Outer', risk: 'HIGH', wave: '4.2m' },
        { from: 'Kozhikode Outer', to: 'Mangalore Fairway', risk: 'HIGH', wave: '3.6m' }
      ]
    },
    safeRoute: {
      distanceNm: 62.8,
      estimatedHours: 5.1,
      maxWaveHeight: 1.4,
      riskLevel: 'LOW',
      riskScore: 22,
      safetyBonus: 'Shifts heading 15° West into deep water (42m depth), circumventing breaking swell and saving 18% fuel with favorable southbound drift.',
      waypoints: [
        [9.9312, 76.2673],
        [10.20, 75.80],
        [11.20, 75.10],
        [12.10, 74.50],
        [12.75, 74.60],
        [12.914, 74.856]
      ],
      segments: [
        { from: 'Kochi Channel', to: 'Deep Water WP-1', risk: 'LOW', wave: '1.2m' },
        { from: 'Deep Water WP-1', to: 'Offshore WP-2', risk: 'LOW', wave: '1.4m' },
        { from: 'Offshore WP-2', to: 'Mangalore Approach', risk: 'LOW', wave: '1.1m' }
      ]
    }
  },
  'MNG-KRW': {
    origin: 'New Mangalore / Malpe',
    destination: 'Karwar Harbor',
    directRoute: {
      distanceNm: 62.4,
      estimatedHours: 6.2,
      maxWaveHeight: 2.9,
      riskLevel: 'HIGH',
      riskScore: 74,
      riskWarning: 'Crosses active 2.9m breaking swell zone off submerged rocky reef (St. Mary Shoals).',
      waypoints: [
        [13.15, 74.45],
        [13.50, 74.55], // close to shoal
        [14.20, 74.35],
        [14.805, 74.125]
      ],
      segments: [
        { from: 'Malpe', to: 'Shoal Zone', risk: 'MEDIUM', wave: '2.1m' },
        { from: 'Shoal Zone', to: 'Bhatkal Outer', risk: 'HIGH', wave: '2.9m' },
        { from: 'Bhatkal Outer', to: 'Karwar', risk: 'MEDIUM', wave: '2.2m' }
      ]
    },
    safeRoute: {
      distanceNm: 66.8, // slight detour 4.4 nm
      estimatedHours: 6.4,
      maxWaveHeight: 1.4,
      riskLevel: 'LOW',
      riskScore: 22,
      safetyBonus: 'Avoids shallow shoals by holding >40m depth contour. Reduces vessel rolling by 65%. 16% fuel savings due to favorable current.',
      waypoints: [
        [13.15, 74.45],
        [13.25, 74.25], // deep water vector
        [13.80, 74.10], // clear of shoals
        [14.40, 74.00],
        [14.75, 74.10],
        [14.805, 74.125]
      ],
      segments: [
        { from: 'Departure', to: 'Deep Water WP-1', risk: 'LOW', wave: '1.2m' },
        { from: 'Deep Water WP-1', to: 'Offshore WP-2', risk: 'LOW', wave: '1.4m' },
        { from: 'Offshore WP-2', to: 'Karwar Channel', risk: 'LOW', wave: '1.1m' }
      ]
    }
  },
  'KOC-KLM': {
    origin: 'Kochi Port',
    destination: 'Kollam Outer Bank',
    directRoute: {
      distanceNm: 44.0,
      estimatedHours: 4.4,
      maxWaveHeight: 3.5,
      riskLevel: 'HIGH',
      riskScore: 86,
      riskWarning: 'Intersecting high swell surge and cyclone depression track.',
      waypoints: [
        [9.9312, 76.2673],
        [9.50, 76.15],
        [9.10, 76.15],
        [8.88, 76.58]
      ]
    },
    safeRoute: {
      distanceNm: 41.5,
      estimatedHours: 4.8,
      maxWaveHeight: 1.8,
      riskLevel: 'MEDIUM',
      riskScore: 48,
      safetyBonus: 'Nearshore sheltered inland waterways route advised. Open sea navigation prohibited by Coast Guard.',
      waypoints: [
        [9.9312, 76.2673],
        [9.75, 76.35],
        [9.35, 76.50],
        [8.88, 76.58]
      ]
    }
  }
};
