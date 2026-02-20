import { type WallpaperConfig } from '../types/theme.types';

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// 1. Neon Dreams (Animated Gradient)
const neonDreams = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a">
        <animate attributeName="stop-color" values="#0f172a;#312e81;#0f172a" dur="10s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#312e81">
        <animate attributeName="stop-color" values="#312e81;#4c1d95;#312e81" dur="10s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#a)"/>
</svg>
`);

// 2. Sunset Vibes (Animated Gradient)
const sunsetVibes = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b">
        <animate attributeName="stop-color" values="#1e1b4b;#4c1d95;#1e1b4b" dur="15s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#be185d">
        <animate attributeName="stop-color" values="#be185d;#9d174d;#be185d" dur="15s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#b)"/>
</svg>
`);

// 3. Northern Lights (Animated Gradient)
const northernLights = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <linearGradient id="c" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#064e3b">
        <animate attributeName="stop-color" values="#064e3b;#065f46;#064e3b" dur="12s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#0f766e">
        <animate attributeName="stop-color" values="#0f766e;#115e59;#0f766e" dur="12s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#c)"/>
</svg>
`);

// 7. Particles (Animated CSS/SVG)
const particles = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#0f172a"/>
  <circle cx="10%" cy="10%" r="2" fill="white" opacity="0.5">
    <animate attributeName="cy" values="10%;90%;10%" dur="20s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="10%;20%;10%" dur="20s" repeatCount="indefinite"/>
  </circle>
  <circle cx="30%" cy="40%" r="3" fill="white" opacity="0.3">
    <animate attributeName="cy" values="40%;80%;40%" dur="25s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="30%;50%;30%" dur="25s" repeatCount="indefinite"/>
  </circle>
    <circle cx="70%" cy="20%" r="2" fill="white" opacity="0.6">
    <animate attributeName="cy" values="20%;60%;20%" dur="18s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="70%;90%;70%" dur="18s" repeatCount="indefinite"/>
  </circle>
    <circle cx="50%" cy="50%" r="4" fill="white" opacity="0.2">
    <animate attributeName="cy" values="50%;10%;50%" dur="30s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="50%;30%;50%" dur="30s" repeatCount="indefinite"/>
  </circle>
</svg>
`);

// 8. Waves (Animated CSS/SVG)
const waves = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none">
  <rect width="1440" height="320" fill="#0f172a"/>
  <path fill="#1e293b" fill-opacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
    <animate attributeName="d" dur="10s" repeatCount="indefinite"
      values="
      M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
      M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,213.3C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
      M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </path>
</svg>
`);

export const WALLPAPERS: WallpaperConfig[] = [
  {
    id: 'neon-dreams',
    name: 'Neon Dreams',
    type: 'animated',
    source: neonDreams,
    thumbnail: 'gradient-blue-purple',
    blur: 0,
    brightness: 100,
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    type: 'animated',
    source: sunsetVibes,
    thumbnail: 'gradient-orange-purple',
    blur: 0,
    brightness: 100,
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    type: 'animated',
    source: northernLights,
    thumbnail: 'gradient-green-teal',
    blur: 0,
    brightness: 100,
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    type: 'static',
    source: 'linear-gradient(to bottom, #000000, #434343)',
    thumbnail: 'gradient-black-gray',
    blur: 0,
    brightness: 100,
  },
  {
    id: 'clean-slate',
    name: 'Clean Slate',
    type: 'static',
    source: '#f8fafc',
    thumbnail: 'solid-white',
    blur: 0,
    brightness: 100,
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    type: 'static',
    source: '#1e3a8a',
    thumbnail: 'solid-blue',
    blur: 0,
    brightness: 100,
  },
  {
    id: 'particles',
    name: 'Particles',
    type: 'animated',
    source: particles,
    thumbnail: 'particles-dark',
    blur: 0,
    brightness: 100,
  },
  {
    id: 'waves',
    name: 'Waves',
    type: 'animated',
    source: waves,
    thumbnail: 'waves-dark',
    blur: 0,
    brightness: 100,
  },
];
