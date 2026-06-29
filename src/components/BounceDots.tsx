export default function BounceDots({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div className="flex gap-2">
        <div className="w-2.5 h-2.5 bg-navy rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
        <div className="w-2.5 h-2.5 bg-navy rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2.5 h-2.5 bg-navy rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
      </div>
      {text && <span className="text-sm font-medium text-text-muted">{text}</span>}
    </div>
  );
}
