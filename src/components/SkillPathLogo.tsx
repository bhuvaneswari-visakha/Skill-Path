import React from 'react';

interface SkillPathLogoProps {
  variant?: 'mark' | 'full' | 'horizontal';
  size?: number | string;
  className?: string;
  showTagline?: boolean;
}

export const SkillPathLogo: React.FC<SkillPathLogoProps> = ({
  variant = 'mark',
  size = 40,
  className = '',
  showTagline = true,
}) => {
  // If variant is 'full' (the complete badge matching the user's uploaded logo exactly)
  if (variant === 'full') {
    return (
      <div className={`inline-flex flex-col items-center justify-center ${className}`}>
        <img
          src="/logo.svg"
          alt="SkillPath - Learn, Grow, Get Job-Ready"
          width={typeof size === 'number' ? size : undefined}
          height={typeof size === 'number' ? size : undefined}
          className="rounded-full shadow-2xl shadow-blue-900/30"
          style={typeof size === 'string' ? { width: size, height: size } : { width: `${size}px`, height: `${size}px` }}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // If variant is 'horizontal', display the circular emblem alongside styled typography
  if (variant === 'horizontal') {
    const iconDim = typeof size === 'number' ? size : 40;
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div
          className="relative shrink-0 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-md shadow-blue-500/20"
          style={{ width: `${iconDim}px`, height: `${iconDim}px` }}
        >
          <img
            src="/logo.svg"
            alt="SkillPath Emblem"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white flex items-center">
              Sk<span className="text-white relative">
                i
                <span className="absolute -top-1 left-0.5 text-[8px] text-cyan-400">▶</span>
              </span>ll
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                Path
              </span>
            </span>
          </div>
          {showTagline && (
            <p className="text-[11px] font-medium text-[#a1a1aa] tracking-tight flex items-center gap-1 mt-0.5">
              <span>Learn</span>
              <span className="text-cyan-400 font-bold">•</span>
              <span>Grow</span>
              <span className="text-purple-400 font-bold">•</span>
              <span>Get Job-Ready</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default 'mark' variant: The circular emblem
  const dim = typeof size === 'number' ? `${size}px` : size;
  return (
    <div
      className={`relative shrink-0 rounded-full p-[1.5px] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform ${className}`}
      style={{ width: dim, height: dim }}
    >
      <img
        src="/logo.svg"
        alt="SkillPath Logo"
        className="w-full h-full object-cover rounded-full bg-black"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default SkillPathLogo;
