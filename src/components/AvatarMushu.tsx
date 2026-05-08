
import React from "react";

interface AvatarMushuProps {
  size?: number;
  className?: string;
  isTalking?: boolean;
}

const AvatarMushu: React.FC<AvatarMushuProps> = ({ size = 64, className = "", isTalking = false }) => {
  return (
    <div
      className={`relative rounded-full border-2 border-yellow-300 bg-white shadow ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        overflow: "hidden",
        objectFit: 'cover',
      }}
      aria-label="Mushu el perro"
    >
      {/* Imagen base de Mushu */}
      <img
        src="/mushu-avatar.png"
        alt="Mushu, tu guía perruno"
        width={size}
        height={size}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      {/* Boca animada (simulada con SVG, puedes reemplazar por imagen después) */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: size * 0.24,
          transform: "translateX(-50%)",
          width: size * 0.23,
          height: size * 0.18,
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 60 40">
          <ellipse
            cx="30"
            cy="25"
            rx="20"
            ry={isTalking ? 15 : 8}
            fill="#3a2317"
            className={isTalking ? "animate-mushu-boca" : ""}
          />
        </svg>
        <style>
          {`
            @keyframes mushu-boca-move {
              0%   { ry: 8; }
              25%  { ry: 17; }
              50%  { ry: 11; }
              75%  { ry: 18; }
              100% { ry: 8; }
            }
            .animate-mushu-boca {
              animation: mushu-boca-move 0.6s infinite linear;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default AvatarMushu;
