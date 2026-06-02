export function HackTheWorld() {
  return (
    <section
      className="px-4 py-20 relative"
      style={{ backgroundImage: "url('/bg-features-v1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[#180149]/60" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6">
              Hack The World
            </h2>
            <p className="text-[#7B7A8E] text-lg mb-8 leading-relaxed">
              From Arbitrum Open House to DevCon — HHP is the coordination
              layer for builders who show up IRL. We create spaces where you
              can live, work, and ship together.
            </p>

            <div className="space-y-5">
              {[
                {
                  number: "1",
                  color: "#6EE76E",
                  title: "Co-living during events",
                  desc: "Share a house with fellow hackers during major hackathons and conferences.",
                },
                {
                  number: "2",
                  color: "#8B78E6",
                  title: "Match before you arrive",
                  desc: "Form your team online with complementary archetypes — show up ready to build.",
                },
                {
                  number: "3",
                  color: "#990070",
                  title: "Ship together",
                  desc: "Collaborate in-person, build winning projects, and keep building after the event ends.",
                },
              ].map((item) => (
                <div key={item.number} className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    {item.number}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-[#7B7A8E] text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — globe */}
          <div className="flex justify-center">
            <img
              src="/globe-logo.gif"
              alt="Global network of hacker houses"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
