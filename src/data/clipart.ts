export interface ClipartItem {
  id: string;
  name: string;
  category: string;
  svg: string;
}

export const CLIPART_CATEGORIES = [
  'All',
  'Badges & Emblems',
  'Streetwear & Y2K',
  'Nature & Adventure',
  'Sports & Fitness',
  'Music & Retro',
  'Shapes & Frames',
];

export const CLIPART_ITEMS: ClipartItem[] = [
  // Badges & Emblems
  {
    id: 'badge-vintage-shield',
    name: 'Vintage Heritage Shield',
    category: 'Badges & Emblems',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 5 L85 18 C85 55 50 90 50 95 C50 90 15 55 15 18 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M50 15 L78 26 C78 52 50 80 50 84 C50 80 22 52 22 26 Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50 25 L50 75 M30 50 L70 50" stroke="currentColor" stroke-width="3"/></svg>`,
  },
  {
    id: 'badge-laurel-wreath',
    name: 'Champion Laurel Wreath',
    category: 'Badges & Emblems',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M30 20 C25 28 25 40 32 50 C22 45 18 35 22 25 Z M25 45 C18 55 20 68 30 76 C20 70 15 58 18 48 Z M35 70 C30 80 40 90 50 92 C42 86 36 78 38 70 Z M70 20 C75 28 75 40 68 50 C78 45 82 35 78 25 Z M75 45 C82 55 80 68 70 76 C80 70 85 58 82 48 Z M65 70 C70 80 60 90 50 92 C58 86 64 78 62 70 Z"/></svg>`,
  },
  {
    id: 'badge-rosette-seal',
    name: 'Quality Starburst Seal',
    category: 'Badges & Emblems',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="3,3"/><circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="50,22 58,38 76,40 62,52 66,70 50,60 34,70 38,52 24,40 42,38" fill="currentColor"/></svg>`,
  },

  // Streetwear & Y2K
  {
    id: 'street-cyber-star',
    name: 'Four-Point Chrome Star',
    category: 'Streetwear & Y2K',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 5 Q50 45 95 50 Q50 50 50 95 Q50 50 5 50 Q50 45 50 5 Z"/></svg>`,
  },
  {
    id: 'street-flame-skull',
    name: 'Speed Lightning Bolt',
    category: 'Streetwear & Y2K',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="56,5 20,55 48,55 36,95 80,45 52,45" fill="currentColor"/></svg>`,
  },
  {
    id: 'street-smile-drip',
    name: 'Retro Acid Smiley',
    category: 'Streetwear & Y2K',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="35" cy="40" r="6"/><circle cx="65" cy="40" r="6"/><path d="M30 60 Q50 85 70 60" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'street-bar-code',
    name: 'Futuristic Barcode Tag',
    category: 'Streetwear & Y2K',
    svg: `<svg viewBox="0 0 100 60" fill="currentColor"><rect x="10" y="5" width="4" height="50"/><rect x="18" y="5" width="2" height="50"/><rect x="24" y="5" width="6" height="50"/><rect x="34" y="5" width="3" height="50"/><rect x="40" y="5" width="5" height="50"/><rect x="49" y="5" width="2" height="50"/><rect x="55" y="5" width="7" height="50"/><rect x="66" y="5" width="4" height="50"/><rect x="74" y="5" width="2" height="50"/><rect x="80" y="5" width="6" height="50"/></svg>`,
  },

  // Nature & Adventure
  {
    id: 'nature-twin-peaks',
    name: 'Alpine Mountain Peaks',
    category: 'Nature & Adventure',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="10,85 45,25 65,60 80,40 95,85" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><polygon points="45,25 35,42 42,40 45,46 48,41 55,43" fill="currentColor"/><polygon points="80,40 74,52 80,50 86,52" fill="currentColor"/><circle cx="75" cy="22" r="8" fill="currentColor"/></svg>`,
  },
  {
    id: 'nature-pine-silhouette',
    name: 'Evergreen Pine Forest',
    category: 'Nature & Adventure',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="50,15 35,38 42,38 28,62 38,62 20,85 80,85 62,62 72,62 58,38 65,38" fill="currentColor"/><rect x="46" y="85" width="8" height="10" fill="currentColor"/></svg>`,
  },
  {
    id: 'nature-compass-rose',
    name: 'Explorer Compass Rose',
    category: 'Nature & Adventure',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="3"/><polygon points="50,12 55,45 88,50 55,55 50,88 45,55 12,50 45,45" fill="currentColor"/><circle cx="50" cy="50" r="5" fill="#fff"/></svg>`,
  },

  // Sports & Fitness
  {
    id: 'sports-barbell-iron',
    name: 'Iron Barbell Weight',
    category: 'Sports & Fitness',
    svg: `<svg viewBox="0 0 100 60" fill="currentColor"><rect x="10" y="27" width="80" height="6" rx="3"/><rect x="20" y="15" width="8" height="30" rx="3"/><rect x="15" y="10" width="6" height="40" rx="2"/><rect x="72" y="15" width="8" height="30" rx="3"/><rect x="79" y="10" width="6" height="40" rx="2"/></svg>`,
  },
  {
    id: 'sports-winged-foot',
    name: 'Running Winged Shoe',
    category: 'Sports & Fitness',
    svg: `<svg viewBox="0 0 100 70" fill="currentColor"><path d="M15 50 C25 45 40 46 55 45 C65 44 80 48 88 55 C70 58 50 58 15 55 Z" stroke="currentColor" stroke-width="3"/><path d="M40 40 C35 25 50 15 75 10 C65 20 62 28 65 38 Z" fill="currentColor"/><path d="M25 42 C20 30 35 22 55 20 C48 28 45 34 48 40 Z" fill="currentColor"/></svg>`,
  },

  // Music & Retro
  {
    id: 'retro-cassette-tape',
    name: '80s Mixtape Cassette',
    category: 'Music & Retro',
    svg: `<svg viewBox="0 0 100 70" fill="currentColor"><rect x="10" y="10" width="80" height="50" rx="6" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="35" cy="35" r="8" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="65" cy="35" r="8" fill="none" stroke="currentColor" stroke-width="3"/><rect x="25" y="25" width="50" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="20,60 28,48 72,48 80,60" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  },
  {
    id: 'music-classic-mic',
    name: 'Vintage Studio Microphone',
    category: 'Music & Retro',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><rect x="38" y="15" width="24" height="40" rx="12" fill="none" stroke="currentColor" stroke-width="4"/><line x1="38" y1="28" x2="62" y2="28" stroke="currentColor" stroke-width="3"/><line x1="38" y1="40" x2="62" y2="40" stroke="currentColor" stroke-width="3"/><path d="M28 35 C28 65 72 65 72 35" fill="none" stroke="currentColor" stroke-width="4"/><line x1="50" y1="65" x2="50" y2="85" stroke="currentColor" stroke-width="4"/><line x1="35" y1="85" x2="65" y2="85" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  },

  // Shapes & Frames
  {
    id: 'shape-geometric-hexagon',
    name: 'Double Hexagon Frame',
    category: 'Shapes & Frames',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="50,8 88,28 88,72 50,92 12,72 12,28" fill="none" stroke="currentColor" stroke-width="4"/><polygon points="50,16 80,33 80,67 50,84 20,67 20,33" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  },
  {
    id: 'shape-curved-banner',
    name: 'Vintage Text Ribbon Banner',
    category: 'Shapes & Frames',
    svg: `<svg viewBox="0 0 100 45" fill="currentColor"><path d="M10 25 L20 10 L80 10 L90 25 L80 40 L20 40 Z" fill="none" stroke="currentColor" stroke-width="3"/><polyline points="20,40 25,25 20,10" stroke="currentColor" stroke-width="2"/><polyline points="80,40 75,25 80,10" stroke="currentColor" stroke-width="2"/></svg>`,
  },
];
