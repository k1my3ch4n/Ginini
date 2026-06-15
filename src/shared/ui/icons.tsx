interface IconProps {
  className?: string;
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg
      width="12"
      height="20"
      viewBox="0 0 9 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 1L1 8L8 15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function GuineaPigMascotIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="gp-head-clip">
          <rect x="10" y="24" width="80" height="62" rx="30" />
        </clipPath>
      </defs>

      {/* 귀 */}
      <circle cx="26" cy="24" r="13" fill="#F4C9A8" stroke="#4B3A2F" strokeWidth="3" />
      <circle cx="74" cy="24" r="13" fill="#F4C9A8" stroke="#4B3A2F" strokeWidth="3" />

      {/* 얼굴 */}
      <rect x="10" y="24" width="80" height="62" rx="30" fill="#FFFDF9" />
      <rect x="50" y="24" width="40" height="62" fill="#E6A57E" clipPath="url(#gp-head-clip)" />
      <rect x="10" y="24" width="80" height="62" rx="30" fill="none" stroke="#4B3A2F" strokeWidth="3.5" />

      {/* 눈 */}
      <circle cx="37" cy="56" r="4.5" fill="#4B3A2F" />
      <circle cx="63" cy="56" r="4.5" fill="#4B3A2F" />

      {/* 코 */}
      <ellipse cx="50" cy="67" rx="5" ry="3.5" fill="#4B3A2F" />

      {/* 수염 */}
      <g stroke="#4B3A2F" strokeWidth="1.5" strokeLinecap="round">
        <line x1="14" y1="64" x2="32" y2="62" />
        <line x1="14" y1="72" x2="32" y2="71" />
        <line x1="86" y1="64" x2="68" y2="62" />
        <line x1="86" y1="72" x2="68" y2="71" />
      </g>
    </svg>
  );
}

export function AlbumIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
