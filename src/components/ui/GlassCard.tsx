import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  return (
    <div
      className={`
        backdrop-blur-md bg-white/10 
        border border-white/20 
        rounded-xl shadow-xl
        ${hover ? 'hover:bg-white/20 hover:shadow-2xl transition-all duration-300' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
