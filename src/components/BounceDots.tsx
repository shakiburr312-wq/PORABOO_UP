export default function BounceDots() {
  return (
    <div className="flex items-center 
      justify-center gap-1.5 py-4">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-[#1B2F6E]"
          style={{
            animation: `bounce 0.8s ease-in-out 
              ${i * 0.15}s infinite`
          }}
        />
      ))}
    </div>
  )
}
