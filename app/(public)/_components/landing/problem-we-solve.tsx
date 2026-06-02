const problems = [
  {
    title: "No Coordination Layer",
    body: "You meet the right builder at a hackathon. Pure luck. There's no system to match you by what you actually bring — only by who you happen to sit next to.",
    color: "#990070",
  },
  {
    title: "Housing is a Nightmare",
    body: "Expensive hotels, sketchy Airbnbs, or sleeping at the venue. Finding trusted builders to co-live with requires weeks of manual pre-selection.",
    color: "#8B78E6",
  },
  {
    title: "Connections That Fade",
    body: "You meet your future co-founder at DevCon. Then Discord. Then silence. There's no persistent layer to keep builders building together after events end.",
    color: "#6EE76E",
  },
]

export function ProblemWeSolve() {
  return (
    <section
      className="px-4 py-20 relative"
      style={{ backgroundImage: "url('/bg-features-v1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[#180149]/60" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            The Problem We Solve
          </h2>
          <p className="text-[#7B7A8E] text-lg max-w-2xl mx-auto">
            Hackathons are where builders meet. But the coordination layer has
            never existed — until now.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Cat */}
          <div className="flex justify-center order-last lg:order-first">
            <img
              src="/cypher-kitten/cat-crying.gif"
              alt="Frustrated builder"
              className="w-48 h-48 md:w-56 md:h-56"
            />
          </div>

          {/* Problem cards */}
          <div className="space-y-4">
            {problems.map((p) => (
              <div
                key={p.title}
                className="bg-[#180149] border border-[#2E2A5A] rounded-lg p-5 hover:border-[#6B00C9] transition-colors duration-200"
              >
                <h3
                  className="font-display font-bold text-lg mb-2"
                  style={{ color: p.color }}
                >
                  {p.title}
                </h3>
                <p className="text-[#7B7A8E] text-sm leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
