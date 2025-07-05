import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  isDecorative?: boolean;
  title?: string;
}

const PomodoroLogo: React.FC<LogoProps> = ({ 
  size = 48, 
  className = '', 
  isDecorative = false,
  title = 'Pomodoro Timer Logo'
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`pomodoro-logo ${className}`}
      role={isDecorative ? 'presentation' : 'img'}
      aria-hidden={isDecorative}
      aria-label={isDecorative ? undefined : title}
    >
      {!isDecorative && <title>{title}</title>}
      {/* Tomato body */}
      <circle cx="32" cy="36" r="24" fill="#E53E3E" stroke="#C53030" strokeWidth="2"/>
      
      {/* Tomato highlight */}
      <ellipse cx="26" cy="30" rx="6" ry="8" fill="#FC8181" opacity="0.7"/>
      
      {/* Tomato stem */}
      <path d="M32 12 C32 12, 28 8, 24 10 C20 12, 22 16, 26 14 C30 12, 32 12, 32 12 Z" fill="#38A169"/>
      <path d="M32 12 C32 12, 36 8, 40 10 C44 12, 42 16, 38 14 C34 12, 32 12, 32 12 Z" fill="#38A169"/>
      
      {/* Timer elements */}
      <circle cx="32" cy="36" r="18" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.8"/>
      
      {/* Timer hand */}
      <line x1="32" y1="36" x2="32" y2="22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
      <line x1="32" y1="36" x2="42" y2="36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      
      {/* Center dot */}
      <circle cx="32" cy="36" r="2" fill="#FFFFFF"/>
      
      {/* Timer markers */}
      <circle cx="32" cy="20" r="1" fill="#FFFFFF"/>
      <circle cx="44" cy="36" r="1" fill="#FFFFFF"/>
      <circle cx="32" cy="52" r="1" fill="#FFFFFF"/>
      <circle cx="20" cy="36" r="1" fill="#FFFFFF"/>
    </svg>
  );
};

export default PomodoroLogo;
