import React from 'react'

interface ChromaMinerIconProps {
  className?: string
  size?: number
}

export const ChromaMinerIcon: React.FC<ChromaMinerIconProps> = ({ 
  className = "w-8 h-8", 
  size = 32 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Neural network background structure */}
      <g opacity="0.7">
        {/* Layer 1 nodes */}
        <circle cx="6" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="6" cy="16" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="6" cy="24" r="1.5" fill="currentColor" opacity="0.6" />
        
        {/* Layer 2 nodes */}
        <circle cx="14" cy="6" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="14" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="14" cy="18" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="14" cy="26" r="1.5" fill="currentColor" opacity="0.8" />
        
        {/* Layer 3 nodes */}
        <circle cx="22" cy="10" r="1.5" fill="currentColor" opacity="0.9" />
        <circle cx="22" cy="16" r="1.5" fill="currentColor" opacity="0.9" />
        <circle cx="22" cy="22" r="1.5" fill="currentColor" opacity="0.9" />
        
        {/* Connection lines between nodes */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.4">
          {/* Layer 1 to Layer 2 connections */}
          <line x1="6" y1="8" x2="14" y2="6" />
          <line x1="6" y1="8" x2="14" y2="12" />
          <line x1="6" y1="16" x2="14" y2="12" />
          <line x1="6" y1="16" x2="14" y2="18" />
          <line x1="6" y1="24" x2="14" y2="18" />
          <line x1="6" y1="24" x2="14" y2="26" />
          
          {/* Layer 2 to Layer 3 connections */}
          <line x1="14" y1="6" x2="22" y2="10" />
          <line x1="14" y1="12" x2="22" y2="10" />
          <line x1="14" y1="12" x2="22" y2="16" />
          <line x1="14" y1="18" x2="22" y2="16" />
          <line x1="14" y1="18" x2="22" y2="22" />
          <line x1="14" y1="26" x2="22" y2="22" />
        </g>
      </g>
      
      {/* Magnifying glass overlay */}
      <g>
        {/* Magnifying glass circle */}
        <circle 
          cx="20" 
          cy="12" 
          r="6" 
          fill="url(#glass-gradient)" 
          stroke="currentColor" 
          strokeWidth="2"
          opacity="0.9"
        />
        
        {/* Magnifying glass handle */}
        <line 
          x1="24.5" 
          y1="16.5" 
          x2="28" 
          y2="20" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
        
        {/* Highlighted nodes inside magnifying glass */}
        <circle cx="18" cy="10" r="1.2" fill="currentColor" />
        <circle cx="22" cy="12" r="1.2" fill="currentColor" />
        <circle cx="20" cy="14" r="1.2" fill="currentColor" />
        
        {/* Connection lines inside magnifying glass */}
        <g stroke="currentColor" strokeWidth="1.2" opacity="0.8">
          <line x1="18" y1="10" x2="22" y2="12" />
          <line x1="22" y1="12" x2="20" y2="14" />
          <line x1="20" y1="14" x2="18" y2="10" />
        </g>
        
        {/* Glass reflection effect */}
        <path 
          d="M16 8 Q18 6 20 8 Q18 10 16 8" 
          fill="white" 
          opacity="0.3"
        />
      </g>
      
      {/* Data discovery sparkles */}
      <g opacity="0.6">
        <path d="M4 4L5 5L4 6L3 5L4 4Z" fill="currentColor" />
        <path d="M28 6L29 7L28 8L27 7L28 6Z" fill="currentColor" />
        <path d="M2 28L3 29L2 30L1 29L2 28Z" fill="currentColor" />
      </g>
      
      <defs>
        <radialGradient id="glass-gradient" cx="30%" cy="30%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
          <stop offset="70%" stopColor="rgba(99, 102, 241, 0.1)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default ChromaMinerIcon 