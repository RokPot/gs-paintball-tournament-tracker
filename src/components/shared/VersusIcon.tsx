import React from 'react';

interface VersusIconProps {
  size?: number;
  className?: string;
}

const VersusIcon: React.FC<VersusIconProps> = ({
  size = 60,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="vsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ff4757', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#ff6b6b', stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      {/* Background rectangle with rounded corners */}
      <rect
        x="5"
        y="5"
        width="90"
        height="30"
        rx="15"
        fill="url(#vsGradient)"
        stroke="#fff"
        strokeWidth="1"
      />

      {/* VS text - much larger and clearer */}
      <text
        x="50"
        y="25"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize="18"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        VS
      </text>
    </svg>
  );
};

export default VersusIcon;
