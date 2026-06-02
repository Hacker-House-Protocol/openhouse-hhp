import { AuthButton } from "@/components/auth/auth-button"

export function FinalCta() {
  return (
    <section
      className="px-4 py-20 relative"
      style={{ backgroundImage: "url('/bg-features-v1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[#180149]/60" />
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
          Ready to create your own Hacker House?
        </h2>

        <AuthButton label="Join the protocol" className="h-14 px-8 inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg font-bold rounded-xl border-2 border-purple-400/30 shadow-2xl transition-all duration-300 hover:scale-[1.02]" />


      </div>
    </section>
  )
}
