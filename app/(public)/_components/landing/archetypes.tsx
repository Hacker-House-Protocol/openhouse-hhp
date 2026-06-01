const archetypes = [
  {
    name: "The Visionary",
    emoji: "💡",
    tagline: "The one with the idea",
    body: "You define direction, generate narrative, and attract talent. You need builders who can execute on what you see.",
    skills: ["Founder", "Product", "Vision"],
    color: "#990070",
  },
  {
    name: "The Strategist",
    emoji: "♟",
    tagline: "The one who connects the dots",
    body: "GTM, ops, partnerships, execution. You turn chaos into roadmap. You need a Visionary's idea and a Builder's hands.",
    skills: ["GTM", "Operations", "Partnerships"],
    color: "#8B78E6",
  },
  {
    name: "The Builder",
    emoji: "⚙️",
    tagline: "You ship. That's it. That's the whole bio.",
    body: "Frontend, backend, smart contracts, design — you make the thing real. The most wanted archetype on the protocol.",
    skills: ["Frontend", "Backend", "Smart Contracts", "Design"],
    color: "#6EE76E",
  },
]

export function Archetypes() {
  return (
    <section id="archetypes" className="px-4 py-20 bg-[#180149]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 flex flex-col gap-3">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            {"What's your archetype?"}
          </h2>
          <p className="text-[#7B7A8E] text-lg">
            The protocol matches you based on yours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {archetypes.map((a) => (
            <div
              key={a.name}
              className="bg-[#1A1740] border border-[#2E2A5A] rounded-lg p-6 text-center flex flex-col gap-5 hover:scale-[1.03] hover:-translate-y-1 transition-transform duration-200"
              style={{ borderTopColor: a.color, borderTopWidth: "3px" }}
            >
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl border-2 transition-transform duration-500 hover:[transform:rotate(360deg)]"
                style={{
                  backgroundColor: `${a.color}20`,
                  borderColor: a.color,
                }}
              >
                {a.emoji}
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-xl text-white">
                  {a.name}
                </h3>
                <p className="text-sm font-medium" style={{ color: a.color }}>
                  {a.tagline}
                </p>
              </div>

              <p className="text-[#7B7A8E] text-sm leading-relaxed flex-1">
                {a.body}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-auto">
                {a.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded border font-mono"
                    style={{
                      borderColor: a.color,
                      color: a.color,
                      backgroundColor: `${a.color}15`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[#7B7A8E] mt-12 text-base">
          Choose your archetype. The algorithm does the rest.
        </p>
      </div>
    </section>
  )
}
