export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 
      shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full 
          bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 
            rounded w-1/3 mb-2" />
          <div className="h-2 bg-gray-200 
            rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />
      </div>
      <div className="flex gap-4 mt-4 pt-3 
        border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
    </div>
  )
}
