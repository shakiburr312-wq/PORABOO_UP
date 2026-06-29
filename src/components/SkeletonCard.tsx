interface SkeletonCardProps {
  className?: string;
}

export default function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden flex flex-col gap-4 ${className}`}>
      {/* Header/Title Area */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2 w-3/4">
          <div className="h-6 w-full rounded animate-shimmer"></div>
          <div className="h-4 w-2/3 rounded animate-shimmer"></div>
        </div>
        <div className="h-8 w-16 rounded-full animate-shimmer shrink-0"></div>
      </div>
      
      {/* Body lines */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="h-4 w-full rounded animate-shimmer"></div>
        <div className="h-4 w-5/6 rounded animate-shimmer"></div>
        <div className="h-4 w-4/6 rounded animate-shimmer"></div>
      </div>
      
      {/* Footer / Meta info */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full animate-shimmer"></div>
          <div className="h-6 w-16 rounded-full animate-shimmer"></div>
        </div>
        <div className="h-8 w-24 rounded-full animate-shimmer"></div>
      </div>
    </div>
  );
}
