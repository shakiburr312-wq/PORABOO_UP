import { CheckCircle2 } from "lucide-react";

interface ImageUploadLoaderProps {
  progress: number; // 0 to 100
  isComplete: boolean;
}

export default function ImageUploadLoader({ progress, isComplete }: ImageUploadLoaderProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
      {isComplete ? (
        <div className="flex flex-col items-center animate-fadeIn">
          <CheckCircle2 className="w-12 h-12 text-teal mb-2" />
          <span className="text-sm font-bold text-teal bangla-font">আপলোড সম্পন্ন</span>
        </div>
      ) : (
        <div className="relative flex flex-col items-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              className="text-teal/20"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="40"
              cy="40"
            />
            <circle
              className="text-teal transition-all duration-300 ease-out"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="40"
              cy="40"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-navy">{Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
