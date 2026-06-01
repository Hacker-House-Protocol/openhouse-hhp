const steps = [
  {
    number: "1",
    title: "Create your Cypher Identity",
    body: "Connect wallet or email. POAPs, NFTs and on-chain credentials import automatically.",
  },
  {
    number: "2",
    title: "Match with complementary builders",
    body: "Post your project or browse Hack Spaces. The algorithm finds who fits — not who copies you.",
  },
  {
    number: "3",
    title: "Coordinate, build, ship",
    body: "Join a Community, spin up a Hack Space, or secure your slot in a Hacker House. Meet IRL. Ship.",
  },
]

export function HowItWorks() {
  return (
    <section className="px-4 py-20 bg-[#180149]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center flex flex-col gap-4 group"
            >
              <div className="h-16 flex items-center justify-center">
                <div className="w-12 h-12 bg-[#6B00C9] rounded-full flex items-center justify-center transition-all duration-300 group-hover:w-16 group-hover:h-16 group-hover:shadow-[0_0_24px_rgba(107,0,201,0.6)]">
                  <span className="text-white font-bold text-lg font-display">
                    {step.number}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  {step.title}
                </h3>
                <p className="text-[#7B7A8E] text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
