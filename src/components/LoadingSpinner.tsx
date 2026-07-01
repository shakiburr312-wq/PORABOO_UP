export default function LoadingSpinner({ 
  size = 20, 
  color = 'white',
  text,
  className = ""
}: { size?: number | string; color?: string; text?: string; className?: string }) {
  // Handle old string sizes for backward compatibility
  const numericSize = size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : typeof size === 'number' ? size : 20;
  
  const spinner = (
    <svg 
      width={numericSize} 
      height={numericSize} 
      viewBox="0 0 24 24" 
      fill="none"
      className={`animate-spin ${className}`}
    >
      <circle 
        cx="12" cy="12" r="10" 
        stroke={color === 'navy' ? '#1B2F6E' : color === 'yellow' ? '#F5A623' : color === 'teal' ? '#0F7B6C' : color} 
        strokeOpacity="0.25" 
        strokeWidth="3"
      />
      <path 
        d="M12 2a10 10 0 0 1 10 10" 
        stroke={color === 'navy' ? '#1B2F6E' : color === 'yellow' ? '#F5A623' : color === 'teal' ? '#0F7B6C' : color} 
        strokeWidth="3" 
        strokeLinecap="round"
      />
    </svg>
  );

  if (text) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        {spinner}
        <span className="font-medium" style={{ color: color === 'navy' ? '#1B2F6E' : color === 'yellow' ? '#F5A623' : color === 'teal' ? '#0F7B6C' : color }}>
          {text}
        </span>
      </div>
    );
  }

  return spinner;
}
