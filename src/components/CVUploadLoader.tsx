import { useState, useEffect } from "react";
import { FileText, Sparkles, FileEdit, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface CVUploadLoaderProps {
  progress: number;
}

export default function CVUploadLoader({ progress }: CVUploadLoaderProps) {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();

  const steps = [
    { icon: FileText, textKey: "cv_reading" },
    { icon: Sparkles, textKey: "cv_analyzing" },
    { icon: FileEdit, textKey: "cv_filling" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [steps.length]);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy/95 backdrop-blur-md rounded-3xl overflow-hidden">
      <div className="relative">
        {/* Animated Icon */}
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse-soft">
          <CurrentIcon className="w-10 h-10 text-yellow animate-float-1" />
        </div>
        
        {/* Sparkles around */}
        <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow animate-spin-fast" />
        <Sparkles className="absolute bottom-4 -left-4 w-4 h-4 text-teal animate-pulse" />
      </div>

      {/* Text */}
      <div className="h-8 mb-6">
        <h3 className="text-white font-bold text-lg bangla-font animate-fadeIn text-center">
          {t(steps[step].textKey)}
        </h3>
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-yellow transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 text-white/60 text-xs font-mono">{Math.round(progress)}%</div>
    </div>
  );
}
