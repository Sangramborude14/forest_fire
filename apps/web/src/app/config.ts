/**
 * Application-wide configuration and environmental constants
 */

export const APP_CONFIG = {
  // API URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',

  // Tile layers
  tileLayers: {
    darkMatter: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
    },
  },

  // Default geographic viewport (Uttarakhand / Western Himalayas)
  defaultViewport: {
    lat: 30.2241,
    lng: 78.7842,
    zoom: 9,
  },

  // Standard spatial grid properties
  grid: {
    resolutionMeters: 500,
    areaHectaresPerCell: 25, // 500m * 500m = 250,000m² = 25 ha
    projection: 'EPSG:4326',
  },

  // Simulation bounds
  simulation: {
    minDurationHours: 1,
    maxDurationHours: 12,
    defaultDurationHours: 6,
    defaultStepMinutes: 60,
  },

  // Standard Risk Color System (consistent across all GIS layers and UI)
  riskColors: {
    LOW: {
      label: 'Low',
      fillColor: '#10b981', // emerald-500
      strokeColor: '#059669',
      fillOpacity: 0.45,
      threshold: '0.00 – 0.25',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    MODERATE: {
      label: 'Moderate',
      fillColor: '#f59e0b', // amber-500
      strokeColor: '#d97706',
      fillOpacity: 0.5,
      threshold: '0.25 – 0.50',
      badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    HIGH: {
      label: 'High',
      fillColor: '#f97316', // orange-500
      strokeColor: '#ea580c',
      fillOpacity: 0.6,
      threshold: '0.50 – 0.75',
      badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    EXTREME: {
      label: 'Extreme',
      fillColor: '#ef4444', // red-500
      strokeColor: '#dc2626',
      fillOpacity: 0.7,
      threshold: '0.75 – 1.00',
      badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
  },
} as const;

export type RiskLevelKey = keyof typeof APP_CONFIG.riskColors;
