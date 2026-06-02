export function OurSolution() {
  return (
    <section
      className="px-4 py-20 relative"
      style={{ backgroundImage: "url('/bg-features-v1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[#180149]/60" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Our Solution
          </h2>
          <p className="text-[#7B7A8E] text-lg max-w-2xl mx-auto">
            One protocol to find your crew, your space, and your next big project.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* Left card */}
          <div className="bg-[#1A1740] border border-[#2E2A5A] rounded-lg p-6 flex flex-col hover:border-[#6B00C9] transition-colors duration-200">
            <h3 className="font-display font-bold text-xl text-white mb-4">
              Hack Spaces & Communities
            </h3>
            <ul className="space-y-3 text-[#7B7A8E] flex-1">
              {[
                { text: "Share ideas, find projects, attract the right builders.", color: "#6EE76E" },
                { text: "Matched by archetype AND project alignment — not just skills.", color: "#6EE76E" },
                { text: "Your on-chain reputation is your profile. No forms. No LinkedIn.", color: "#6EE76E" },
                { text: "Communities to build your scene and coordinate your DAO.", color: "#6EE76E" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0" style={{ color: item.color }}>{">"}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Center — mascot */}
          <div className="flex items-center justify-center">
            <img
              src="/cypher-kitten/cats-happy.png"
              alt="Builders together"
              className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain"
            />
          </div>

          {/* Right card */}
          <div className="bg-[#1A1740] border border-[#2E2A5A] rounded-lg p-6 flex flex-col hover:border-[#6B00C9] transition-colors duration-200">
            <h3 className="font-display font-bold text-xl text-white mb-4">
              IRL — Hacker Houses
            </h3>
            <ul className="space-y-3 text-[#7B7A8E] flex-1">
              {[
                { text: "Co-living during events and in active builder cities.", color: "#8B78E6" },
                { text: "Builder-filtered access — no randoms.", color: "#8B78E6" },
                { text: "Stake to secure your slot. Key NFT per room.", color: "#8B78E6" },
                { text: "From team-online to room-in-the-same-building.", color: "#8B78E6" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0" style={{ color: item.color }}>{">"}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
