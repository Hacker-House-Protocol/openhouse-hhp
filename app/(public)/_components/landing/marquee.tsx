export function Marquee() {
  return (
    <div className="w-full bg-[#0D0B2B] border-y border-[#6B00C9]/30 py-3 md:py-6 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-white text-xs uppercase tracking-widest font-medium mx-0">
            FIND YOUR COMMUNITY &nbsp;&middot;&nbsp; BUILD YOUR HACK SPACE &nbsp;&middot;&nbsp; CO-LIVE IN HACKER HOUSES AROUND THE WORLD &nbsp;&middot;&nbsp;&nbsp;
          </span>
        ))}
        {[...Array(4)].map((_, i) => (
          <span key={`dup-${i}`} className="text-white text-xs uppercase tracking-widest font-medium mx-0">
            FIND YOUR COMMUNITY &nbsp;&middot;&nbsp; BUILD YOUR HACK SPACE &nbsp;&middot;&nbsp; CO-LIVE IN HACKER HOUSES AROUND THE WORLD &nbsp;&middot;&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  )
}
