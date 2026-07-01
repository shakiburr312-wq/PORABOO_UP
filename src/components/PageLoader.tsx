export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 
      flex flex-col items-center justify-center">
      <span className="logo-font text-4xl text-navy 
        mb-6 animate-pulse">
        PORABOO
      </span>
      <div className="w-48 h-1.5 bg-gray-200 
        rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r 
          from-navy via-yellow to-teal rounded-full
          animate-loading-bar" />
      </div>
      <p className="bangla-font text-text-muted text-sm mt-4">
        লোড হচ্ছে...
      </p>
    </div>
  )
}
