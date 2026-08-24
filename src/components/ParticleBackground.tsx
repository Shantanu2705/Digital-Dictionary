export function ParticleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Blue dots */}
      <div className="absolute top-[10%] left-[5%] w-1 h-1 bg-blue-600 rounded-full" />
      <div className="absolute top-[15%] right-[25%] w-1.5 h-1.5 bg-blue-600 rounded-full" />
      <div className="absolute top-[40%] left-[30%] w-1 h-1 bg-blue-600 rounded-full" />
      <div className="absolute top-[60%] right-[10%] w-1 h-1 bg-blue-600 rounded-full" />
      <div className="absolute bottom-[20%] left-[15%] w-1.5 h-1.5 bg-blue-600 rounded-full" />
      <div className="absolute bottom-[5%] right-[35%] w-1 h-1 bg-blue-600 rounded-full" />

      {/* Red dots */}
      <div className="absolute top-[5%] right-[5%] w-1 h-1 bg-red-500 rounded-full" />
      <div className="absolute top-[25%] left-[20%] w-1 h-1 bg-red-500 rounded-full" />
      <div className="absolute top-[45%] right-[40%] w-1.5 h-1.5 bg-red-500 rounded-full" />
      <div className="absolute bottom-[35%] left-[5%] w-1 h-1 bg-red-500 rounded-full" />
      <div className="absolute bottom-[10%] right-[15%] w-1 h-1 bg-red-500 rounded-full" />

      {/* Black dots */}
      <div className="absolute top-[20%] left-[45%] w-1 h-1 bg-black rounded-full" />
      <div className="absolute top-[50%] right-[5%] w-1 h-1 bg-black rounded-full" />
      <div className="absolute top-[75%] left-[35%] w-1.5 h-1.5 bg-black rounded-full" />
      <div className="absolute bottom-[15%] left-[50%] w-1 h-1 bg-black rounded-full" />
      <div className="absolute bottom-[30%] right-[20%] w-1 h-1 bg-black rounded-full" />
    </div>
  );
}
