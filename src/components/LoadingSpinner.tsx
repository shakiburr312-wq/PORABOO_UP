import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  color?: "white" | "navy" | "yellow" | "teal";
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ text, className = "", color = "white", size = "md" }: LoadingSpinnerProps) {
  const colorMap = {
    white: "text-white",
    navy: "text-navy",
    yellow: "text-yellow",
    teal: "text-teal"
  };

  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin-fast ${colorMap[color]}`} />
      {text && <span className={`font-medium ${colorMap[color]}`}>{text}</span>}
    </div>
  );
}
