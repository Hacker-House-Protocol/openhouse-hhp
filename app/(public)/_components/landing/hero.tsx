import { MatrixBackground } from "./matrix-background"
import { HeroCta } from "./hero-cta"
import { ScrambleText } from "./scramble-text"

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
      <MatrixBackground />

      {/* Mobile layout — stacked */}
      <div className="relative z-10 lg:hidden max-w-md mx-auto w-full flex flex-col items-center gap-6 text-center">
        <img
          src="/assets/hacker-house-protocol-logo.svg"
          alt="Hacker House Protocol"
          className="w-72 md:w-80 animate-float"
          style={{
            filter:
              "drop-shadow(0 0 40px rgba(107,0,201,0.5)) drop-shadow(0 0 80px rgba(107,0,201,0.25))",
          }}
        />
        <img
          src="/logo-text.png"
          alt="Hacker House Protocol"
          className="w-64 md:w-80"
        />
        <h1 className="font-display font-bold text-3xl md:text-4xl text-white whitespace-nowrap">
          <ScrambleText text="Match. Build. Co-Live." scrambleInterval={6000} />
        </h1>
        <HeroCta />
      </div>

      {/* Desktop layout — 2×2 grid */}
      <div className="relative z-10 hidden lg:grid max-w-6xl mx-auto w-full grid-cols-2 gap-x-8 gap-y-8 items-center">
        {/* Row 1, Col 1: Logo text */}
        <div className="flex justify-end">
          <img
            src="/logo-text.png"
            alt="Hacker House Protocol"
            className="w-full max-w-lg"
          />
        </div>

        {/* Row 1, Col 2: Mascot */}
        <div className="flex justify-start">
          <img
            src="/assets/hacker-house-protocol-logo.svg"
            alt="Hacker House Protocol"
            className="w-[420px] xl:w-[480px] animate-float"
            style={{
              filter:
                "drop-shadow(0 0 40px rgba(107,0,201,0.5)) drop-shadow(0 0 80px rgba(107,0,201,0.25))",
            }}
          />
        </div>

        {/* Row 2, Col 1: Headline */}
        <div className="flex flex-col items-end text-right">
          <h1 className="font-display font-bold text-4xl xl:text-5xl text-white whitespace-nowrap">
            <ScrambleText text="Match. Build. Co-Live." scrambleInterval={6000} />
          </h1>
        </div>

        {/* Row 2, Col 2: CTA */}
        <div className="flex justify-center items-center">
          <HeroCta />
        </div>
      </div>
    </section>
  )
}
