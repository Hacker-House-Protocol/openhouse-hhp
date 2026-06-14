"use client"

import { use, useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useHackSpace } from "@/services/api/hack-spaces"
import { useProfile } from "@/services/api/profile"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Wrench,
  MessageSquare,
  LogOut,
  Send,
  Settings,
  ChevronLeft,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

/* ── Pixel world themes ── */
const PIXEL_WORLDS = [
  { id: "cyber-neon", name: "Cyber Neon", image: "/worlds/cyber-neon.jpg" },
  { id: "startup-cozy", name: "Startup Cozy", image: "/worlds/startup-cozy.jpg" },
  { id: "pastel-kawaii", name: "Pastel Kawaii", image: "/worlds/pastel-kawaii.jpg" },
  { id: "crypto-guru", name: "Crypto Guru", image: "/worlds/crypto-guru.jpg" },
]

/* ── Mock workspace data ── */
const MOCK_MEMBERS = [
  {
    id: "1",
    username: "Ren",
    avatar: "/cats/cat-gray.gif",
    videoAvatar: "/cats/ren-videocall.jpg",
    isOnline: true,
    isOnVideo: true,
    archetype: "Builder",
    archetypeColor: "#6EE76E",
  },
  {
    id: "2",
    username: "Vera",
    avatar: "/cats/cat-orange.gif",
    videoAvatar: "/cats/vera-videocall.jpg",
    isOnline: true,
    isOnVideo: true,
    archetype: "Visionary",
    archetypeColor: "#990070",
  },
  {
    id: "3",
    username: "Cat_Pro",
    avatar: "/cats/cat-cyan.gif",
    videoAvatar: "/cats/cat-cyan.gif",
    isOnline: true,
    isOnVideo: false,
    archetype: "Strategist",
    archetypeColor: "#8B78E6",
  },
  {
    id: "4",
    username: "HackerMage",
    avatar: "/cats/cat-blue.gif",
    videoAvatar: "/cats/cat-blue.gif",
    isOnline: false,
    isOnVideo: false,
    archetype: "Builder",
    archetypeColor: "#6EE76E",
  },
]

const MOCK_MESSAGES = [
  { id: "1", username: "Ren", message: "Just deployed the new cat battle animations!", time: "2m ago", isBot: false },
  { id: "2", username: "Vera", message: "NFT marketplace integration is live on testnet.", time: "1m ago", isBot: false },
  { id: "3", username: "HackerMage", message: "Testing the cat breeding mechanics.", time: "30s ago", isBot: false },
  { id: "4", username: "Hackerbot", message: "All systems purring. Ready to launch!", time: "just now", isBot: true },
]

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: hackSpace } = useHackSpace(id)
  const { data: profile } = useProfile({ enabled: true })

  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedWorld, setSelectedWorld] = useState("startup-cozy")
  const [chatMessage, setChatMessage] = useState("")
  const [messages, setMessages] = useState(MOCK_MESSAGES)

  // Real local camera/mic — the "You" tile in the hangout spot.
  // Camera and mic are independent streams so the mic works even with video off.
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const camStreamRef = useRef<MediaStream | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const [camError, setCamError] = useState(false)
  const [micLevel, setMicLevel] = useState(0)

  // Player cat movement
  const [catPos, setCatPos] = useState({ x: 50, y: 50 })
  const [catDir, setCatDir] = useState<"left" | "right">("right")

  // NPC cat positions + directions
  const [npc1, setNpc1] = useState({ x: 70, y: 60 })
  const [npc1Dir, setNpc1Dir] = useState<"left" | "right">("right")
  const [npc2, setNpc2] = useState({ x: 30, y: 70 })
  const [npc2Dir, setNpc2Dir] = useState<"left" | "right">("left")
  const [npc3, setNpc3] = useState({ x: 85, y: 45 })
  const [npc3Dir, setNpc3Dir] = useState<"left" | "right">("right")

  const currentWorld = PIXEL_WORLDS.find((w) => w.id === selectedWorld) ?? PIXEL_WORLDS[1]
  const onlineMembers = MOCK_MEMBERS.filter((m) => m.isOnline)

  // Move player cat
  const movePlayerCat = useCallback((direction: "up" | "down" | "left" | "right") => {
    const step = 3
    setCatPos((prev) => {
      let newX = prev.x
      let newY = prev.y
      switch (direction) {
        case "up":
          newY = Math.max(20, prev.y - step)
          break
        case "down":
          newY = Math.min(85, prev.y + step)
          break
        case "left":
          newX = Math.max(5, prev.x - step)
          setCatDir("left")
          break
        case "right":
          newX = Math.min(95, prev.x + step)
          setCatDir("right")
          break
      }
      return { x: newX, y: newY }
    })
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") movePlayerCat("up")
      if (e.key === "ArrowDown" || e.key === "s") movePlayerCat("down")
      if (e.key === "ArrowLeft" || e.key === "a") movePlayerCat("left")
      if (e.key === "ArrowRight" || e.key === "d") movePlayerCat("right")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [movePlayerCat])

  // Acquire / release the real camera (video-only) when the user toggles video
  useEffect(() => {
    let cancelled = false

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCamError(true)
        setIsVideoOn(false)
        toast.error("Camera needs a secure context — open the app on localhost or https.")
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        camStreamRef.current = stream
        setCamError(false)
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
      } catch (err) {
        if (cancelled) return
        setCamError(true)
        setIsVideoOn(false)
        const name = err instanceof DOMException ? err.name : ""
        if (name === "NotAllowedError") {
          toast.error("Camera permission denied. Allow it in your browser's site settings, then try again.")
        } else if (name === "NotFoundError") {
          toast.error("No camera found on this device.")
        } else if (name === "NotReadableError") {
          toast.error("Your camera is already in use by another app.")
        } else {
          toast.error("Couldn't access your camera. Check your browser permissions.")
        }
      }
    }

    if (isVideoOn) void start()

    return () => {
      cancelled = true
      if (camStreamRef.current) {
        camStreamRef.current.getTracks().forEach((t) => t.stop())
        camStreamRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoOn])

  // Acquire / release the real mic (audio-only) when unmuted, plus a live level
  // meter so you can see your voice is actually being captured.
  useEffect(() => {
    let cancelled = false
    let raf = 0
    let ctx: AudioContext | null = null

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setIsMuted(true)
        toast.error("Mic needs a secure context — open the app on localhost or https.")
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        micStreamRef.current = stream
        try {
          const AC =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          ctx = new AC()
          const source = ctx.createMediaStreamSource(stream)
          const analyser = ctx.createAnalyser()
          analyser.fftSize = 256
          source.connect(analyser)
          const data = new Uint8Array(analyser.frequencyBinCount)
          const tick = () => {
            analyser.getByteTimeDomainData(data)
            let sum = 0
            for (let i = 0; i < data.length; i++) {
              const v = (data[i] - 128) / 128
              sum += v * v
            }
            setMicLevel(Math.min(1, Math.sqrt(sum / data.length) * 3))
            raf = requestAnimationFrame(tick)
          }
          tick()
        } catch {
          // AnalyserNode/AudioContext unsupported — the mic still captures fine
        }
      } catch (err) {
        if (cancelled) return
        setIsMuted(true)
        const name = err instanceof DOMException ? err.name : ""
        if (name === "NotAllowedError") {
          toast.error("Mic permission denied. Allow it in your browser's site settings, then try again.")
        } else if (name === "NotFoundError") {
          toast.error("No microphone found on this device.")
        } else if (name === "NotReadableError") {
          toast.error("Your mic is already in use by another app.")
        } else {
          toast.error("Couldn't access your microphone. Check your browser permissions.")
        }
      }
    }

    if (!isMuted) void start()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      if (ctx) void ctx.close()
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop())
        micStreamRef.current = null
      }
      setMicLevel(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted])

  // NPC random movement
  useEffect(() => {
    function randomMove(
      setter: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
      dirSetter: React.Dispatch<React.SetStateAction<"left" | "right">>,
      step: number,
      bounds: { minX: number; maxX: number; minY: number; maxY: number },
    ) {
      const dirs = ["up", "down", "left", "right", "stay", "stay"] as const
      const dir = dirs[Math.floor(Math.random() * dirs.length)]
      setter((prev) => {
        let newX = prev.x
        let newY = prev.y
        switch (dir) {
          case "up":
            newY = Math.max(bounds.minY, prev.y - step)
            break
          case "down":
            newY = Math.min(bounds.maxY, prev.y + step)
            break
          case "left":
            newX = Math.max(bounds.minX, prev.x - step)
            dirSetter("left")
            break
          case "right":
            newX = Math.min(bounds.maxX, prev.x + step)
            dirSetter("right")
            break
        }
        return { x: newX, y: newY }
      })
    }

    const i1 = setInterval(() => randomMove(setNpc1, setNpc1Dir, 2, { minX: 10, maxX: 90, minY: 25, maxY: 80 }), 800)
    const i2 = setInterval(() => randomMove(setNpc2, setNpc2Dir, 2.5, { minX: 5, maxX: 95, minY: 30, maxY: 85 }), 1000)
    const i3 = setInterval(() => randomMove(setNpc3, setNpc3Dir, 1.5, { minX: 15, maxX: 85, minY: 20, maxY: 75 }), 1200)
    return () => {
      clearInterval(i1)
      clearInterval(i2)
      clearInterval(i3)
    }
  }, [])

  function getMemberAvatar(username: string) {
    return MOCK_MEMBERS.find((m) => m.username === username)?.avatar ?? "/cats/cat-gray.gif"
  }

  function sendMessage() {
    if (!chatMessage.trim()) return
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        username: profile?.handle ?? "you",
        message: chatMessage.trim(),
        time: "just now",
        isBot: false,
      },
    ])
    setChatMessage("")
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0B2B] flex flex-col overflow-hidden">
      {/* ── Main Content ── */}
      <div className="flex-1 relative min-h-0">
        {/* Pixel World Background */}
        <div className="absolute inset-0">
          <img
            src={currentWorld.image}
            alt={currentWorld.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* ── Player Cat (walking GIF) ── */}
        <div
          className="absolute z-[5] transition-all duration-150"
          style={{
            left: `${catPos.x}%`,
            top: `${catPos.y}%`,
            transform: `translateX(-50%) ${catDir === "left" ? "scaleX(-1)" : "scaleX(1)"}`,
          }}
        >
          <img
            src="/cats/cat-walking-gray.gif"
            alt="Your cat"
            className="w-24 h-24 lg:w-48 lg:h-48"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* ── NPC Cat 1 - Red ── */}
        <div
          className="absolute z-[5] transition-all duration-500"
          style={{
            left: `${npc1.x}%`,
            top: `${npc1.y}%`,
            transform: `translateX(-50%) ${npc1Dir === "left" ? "scaleX(-1)" : "scaleX(1)"}`,
          }}
        >
          <img
            src="/cats/cat-walking-red.gif"
            alt="NPC cat"
            className="w-24 h-24 lg:w-48 lg:h-48"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* ── NPC Cat 2 - Cyan ── */}
        <div
          className="absolute z-[5] transition-all duration-500"
          style={{
            left: `${npc2.x}%`,
            top: `${npc2.y}%`,
            transform: `translateX(-50%) ${npc2Dir === "left" ? "scaleX(-1)" : "scaleX(1)"}`,
          }}
        >
          <img
            src="/cats/cat-walking-cyan.gif"
            alt="NPC cat 2"
            className="w-24 h-24 lg:w-48 lg:h-48"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* ── NPC Cat 3 - Orange ── */}
        <div
          className="absolute z-[5] transition-all duration-500"
          style={{
            left: `${npc3.x}%`,
            top: `${npc3.y}%`,
            transform: `translateX(-50%) ${npc3Dir === "left" ? "scaleX(-1)" : "scaleX(1)"}`,
          }}
        >
          <img
            src="/cats/cat-walking-orange.gif"
            alt="NPC cat 3"
            className="w-24 h-24 lg:w-48 lg:h-48"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* ── Header ── */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
          <Link
            href={`/dashboard/hack-spaces/${id}`}
            className="flex items-center gap-2 px-3 py-2 bg-[#0D0B2B]/80 backdrop-blur-sm rounded-lg text-white hover:bg-[#0D0B2B] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">{hackSpace?.title ?? "Workspace"}</span>
          </Link>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-[#0D0B2B]/80 backdrop-blur-sm rounded-lg text-white hover:bg-[#0D0B2B] transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* ── Video Chat Overlay — real local camera ── */}
        <div className="absolute top-16 left-4 z-10 flex gap-3 lg:max-w-[calc(100%-22rem)]">
          <div className="relative w-56 h-48 sm:w-72 sm:h-56 md:w-[22rem] md:h-64 rounded-lg overflow-hidden border-2 border-[#6B00C9] shadow-lg shrink-0 bg-[#1A1740]">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOn ? "" : "hidden"}`}
              style={{ transform: "scaleX(-1)" }}
            />
            {!isVideoOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-3">
                <VideoOff className="w-9 h-9 text-[#7B7A8E]" />
                <span className="text-xs text-[#7B7A8E]">
                  {camError ? "Camera blocked" : "Camera off"}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-xs sm:text-sm truncate">
                  {profile?.handle ? `@${profile.handle}` : "You"}
                </span>
                {isMuted ? (
                  <MicOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
                ) : (
                  <span className="relative flex items-center justify-center w-4 h-4 shrink-0">
                    <span
                      className="absolute rounded-full bg-[#6EE76E]/40 transition-transform duration-75"
                      style={{ width: 16, height: 16, transform: `scale(${0.35 + micLevel * 1.3})` }}
                    />
                    <span className="absolute w-2 h-2 bg-[#6EE76E] rounded-full" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── D-Pad Controls - Mobile ── */}
        <div className="absolute bottom-6 left-4 z-20 lg:hidden">
          <div className="relative w-32 h-32">
            <button
              onTouchStart={() => movePlayerCat("up")}
              onClick={() => movePlayerCat("up")}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#0D0B2B]/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white active:bg-[#6B00C9]"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button
              onTouchStart={() => movePlayerCat("down")}
              onClick={() => movePlayerCat("down")}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#0D0B2B]/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white active:bg-[#6B00C9]"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onTouchStart={() => movePlayerCat("left")}
              onClick={() => movePlayerCat("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0D0B2B]/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white active:bg-[#6B00C9]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onTouchStart={() => movePlayerCat("right")}
              onClick={() => movePlayerCat("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0D0B2B]/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white active:bg-[#6B00C9]"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0D0B2B]/60 rounded-full flex items-center justify-center">
              <img src="/cats/cat-gray.gif" alt="Move" className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ── Desktop D-Pad ── */}
        <div className="absolute bottom-6 left-4 z-20 hidden lg:block">
          <div className="bg-[#0D0B2B]/80 backdrop-blur-sm rounded-lg p-3">
            <p className="text-[#7B7A8E] text-xs mb-2 text-center">Use Arrow Keys or WASD</p>
            <div className="relative w-24 h-24">
              <button
                onClick={() => movePlayerCat("up")}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1A1740] hover:bg-[#6B00C9] rounded flex items-center justify-center text-white transition-colors"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => movePlayerCat("down")}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1A1740] hover:bg-[#6B00C9] rounded flex items-center justify-center text-white transition-colors"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => movePlayerCat("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1A1740] hover:bg-[#6B00C9] rounded flex items-center justify-center text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => movePlayerCat("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1A1740] hover:bg-[#6B00C9] rounded flex items-center justify-center text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#2E2A5A] rounded flex items-center justify-center">
                <img src="/cats/cat-gray.gif" alt="Move" className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop Right Sidebar — Members & Chat ── */}
        <div className="hidden lg:flex absolute top-16 right-4 bottom-4 w-80 bg-[#0D0B2B]/90 backdrop-blur-sm rounded-lg border border-[#2E2A5A] flex-col z-10">
          {/* Online Members */}
          <div className="p-4 border-b border-[#2E2A5A]">
            <h3 className="text-white font-medium mb-3">Online ({onlineMembers.length})</h3>
            <div className="space-y-2">
              {MOCK_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden border-2 bg-[#1A1740]"
                      style={{ borderColor: member.archetypeColor }}
                    >
                      <img
                        src={member.avatar}
                        alt={member.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0D0B2B] ${
                        member.isOnline ? "bg-[#6EE76E]" : "bg-[#7B7A8E]"
                      }`}
                    />
                  </div>
                  <span className="text-white text-sm">{member.username}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2 text-sm">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1A1740] shrink-0">
                  <img
                    src={getMemberAvatar(msg.username)}
                    alt={msg.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className={`font-medium ${msg.isBot ? "text-[#6EE76E]" : "text-[#8B78E6]"}`}>
                    {msg.username}:
                  </span>{" "}
                  <span className="text-[#F0EFF8]">{msg.message}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-[#2E2A5A]">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-[#1A1740] border border-[#2E2A5A] rounded-lg text-white text-sm placeholder:text-[#7B7A8E] focus:outline-none focus:border-[#6B00C9]"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-[#6B00C9] rounded-lg text-white hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Chat Overlay ── */}
        {showChat && (
          <div className="lg:hidden absolute bottom-0 left-0 right-0 h-1/2 bg-[#0D0B2B]/95 backdrop-blur-sm border-t border-[#2E2A5A] z-30 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-[#2E2A5A]">
              <h3 className="text-white font-medium">Chat</h3>
              <button onClick={() => setShowChat(false)} className="p-1 text-[#7B7A8E] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Online Members - Compact */}
            <div className="flex gap-2 p-3 border-b border-[#2E2A5A] overflow-x-auto">
              {MOCK_MEMBERS.map((member) => (
                <div key={member.id} className="flex flex-col items-center gap-1 min-w-[50px]">
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden border-2 bg-[#1A1740]"
                      style={{ borderColor: member.archetypeColor }}
                    >
                      <img src={member.avatar} alt={member.username} className="w-full h-full object-cover" />
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0D0B2B] ${
                        member.isOnline ? "bg-[#6EE76E]" : "bg-[#7B7A8E]"
                      }`}
                    />
                  </div>
                  <span className="text-white text-xs truncate max-w-[50px]">{member.username}</span>
                </div>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-[#1A1740] shrink-0">
                    <img src={getMemberAvatar(msg.username)} alt={msg.username} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className={`font-medium ${msg.isBot ? "text-[#6EE76E]" : "text-[#8B78E6]"}`}>
                      {msg.username}:
                    </span>{" "}
                    <span className="text-[#F0EFF8]">{msg.message}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-[#2E2A5A]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-[#1A1740] border border-[#2E2A5A] rounded-lg text-white text-sm placeholder:text-[#7B7A8E] focus:outline-none focus:border-[#6B00C9]"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-[#6B00C9] rounded-lg text-white hover:opacity-90 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Toolbar ── */}
      <div className="bg-[#0D0B2B] border-t border-[#2E2A5A] p-3 sm:p-4 z-20">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors ${
              isMuted
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-[#6B00C9] text-white hover:opacity-90"
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span className="hidden md:inline">{isMuted ? "Unmute" : "Mute"}</span>
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors ${
              !isVideoOn
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-[#6B00C9] text-white hover:opacity-90"
            }`}
          >
            {isVideoOn ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span className="hidden md:inline">{isVideoOn ? "Stop Video" : "Start Video"}</span>
          </button>

          <button className="hidden sm:flex px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-[#6B00C9] text-white rounded-lg font-medium text-xs sm:text-sm items-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity">
            <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden md:inline">Share Screen</span>
          </button>

          <button className="hidden sm:flex px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-[#6B00C9] text-white rounded-lg font-medium text-xs sm:text-sm items-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity">
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden md:inline">Hacker Tools</span>
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`lg:hidden px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors ${
              showChat
                ? "bg-[#6B00C9] text-white"
                : "bg-[#1A1740] text-[#7B7A8E] hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden md:inline">Chat</span>
          </button>

          <Link
            href={`/dashboard/hack-spaces/${id}`}
            className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-red-500/20 text-red-400 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden md:inline">Leave</span>
          </Link>
        </div>
      </div>

      {/* ── Settings Modal — World Selection ── */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1740] border border-[#2E2A5A] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#2E2A5A]">
              <h2 className="font-display font-bold text-xl text-white">Workspace Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-[#7B7A8E] hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="font-medium text-white mb-4">Choose your pixel world</h3>
              <div className="grid grid-cols-2 gap-4">
                {PIXEL_WORLDS.map((world) => (
                  <button
                    key={world.id}
                    onClick={() => setSelectedWorld(world.id)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedWorld === world.id
                        ? "border-[#6B00C9] ring-2 ring-[#6B00C9]/50"
                        : "border-[#2E2A5A] hover:border-[#6B00C9]/50"
                    }`}
                  >
                    <div className="relative h-32 w-full">
                      <img
                        src={world.image}
                        alt={world.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-[#0D0B2B]">
                      <span className="text-white font-medium text-sm">{world.name}</span>
                    </div>
                    {selectedWorld === world.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#6B00C9] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">&#10003;</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-[#2E2A5A] flex justify-end gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 text-[#7B7A8E] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-[#6B00C9] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
