import styles from './NavbarWaves.module.css';

/**
 * Organic wave / mesh-style backdrop for the header (navy + soft gold).
 */
export function NavbarWaves() {
  return (
    <svg
      className={styles.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="navMeshBase" x1="8%" y1="0%" x2="92%" y2="100%">
          <stop offset="0%" stopColor="#020d18" />
          <stop offset="35%" stopColor="#062b4f" />
          <stop offset="65%" stopColor="#0b3558" />
          <stop offset="100%" stopColor="#041526" />
        </linearGradient>
        <linearGradient id="navWaveDeep" x1="0%" y1="100%" x2="100%" y2="15%">
          <stop offset="0%" stopColor="#010a12" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#062b4f" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#0b3558" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="navWaveMid" x1="100%" y1="80%" x2="0%" y2="10%">
          <stop offset="0%" stopColor="#031a2e" stopOpacity="0.92" />
          <stop offset="45%" stopColor="#084a72" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0b3558" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="navWaveHighlight" x1="70%" y1="0%" x2="30%" y2="100%">
          <stop offset="0%" stopColor="#0e4a73" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#062b4f" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="navGoldCrest" cx="72%" cy="18%" r="42%">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.55" />
          <stop offset="25%" stopColor="#f6c56d" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#f6c56d" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#f6c56d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="navGoldSoft" cx="28%" cy="35%" r="35%">
          <stop offset="0%" stopColor="#f6c56d" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f6c56d" stopOpacity="0" />
        </radialGradient>
        <filter id="navBlurGold" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b" />
          </feMerge>
        </filter>
        <filter id="navBlurWave" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
        </filter>
      </defs>

      <rect width="1440" height="260" fill="url(#navMeshBase)" />

      <g className={styles.driftSlow}>
        <path
          fill="url(#navWaveDeep)"
          d="M0,200 C200,245 340,175 520,205 C700,235 820,165 980,195 C1140,225 1280,185 1440,210 V260 H0 Z"
        />
      </g>

      <g className={styles.driftMid}>
        <path
          fill="url(#navWaveMid)"
          filter="url(#navBlurWave)"
          d="M0,220 C260,160 400,248 620,198 C840,148 980,238 1200,188 C1320,163 1380,208 1440,195 V260 H0 Z"
        />
      </g>

      <g className={styles.driftFast}>
        <path
          fill="url(#navWaveHighlight)"
          d="M0,235 C220,205 380,255 600,220 C820,185 960,245 1180,215 C1300,200 1360,228 1440,218 V260 H0 Z"
          opacity="0.85"
        />
      </g>

      <ellipse cx="1040" cy="48" rx="320" ry="140" fill="url(#navGoldCrest)" filter="url(#navBlurGold)" className={styles.goldPulse} />
      <ellipse cx="380" cy="95" rx="220" ry="100" fill="url(#navGoldSoft)" opacity="0.9" />

      <path
        fill="none"
        stroke="rgba(246,197,109,0.14)"
        strokeWidth="1"
        d="M0,178 C240,130 480,210 720,165 S1080,125 1440,155"
        className={styles.ridgeLine}
      />
    </svg>
  );
}
