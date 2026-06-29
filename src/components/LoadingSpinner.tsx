import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  color?: "white" | "navy" | "yellow" | "teal";
}

export default function LoadingSpinner({ text, className = "", color = "white" }: LoadingSpinnerProps) {
  const colorMap = {
    white: "text-white",
    navy: "text-navy",
    yellow: "text-yellow",
    teal: "text-teal"
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`w-5 h-5 animate-spin-fast ${colorMap[color]}`} />
      {text && <span className={`font-medium ${colorMap[color]}`}>{text}</span>}
    </div>
  );
}
