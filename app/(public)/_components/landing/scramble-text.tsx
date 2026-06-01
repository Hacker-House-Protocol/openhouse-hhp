"use client"

import { useEffect, useState, useRef } from "react"

interface ScrambleTextProps {
  text: string
  className?: string
  scrambleOnHover?: boolean
  autoScramble?: boolean
  scrambleInterval?: number
}

export function ScrambleText({ 
  text, 
  className = "", 
  scrambleOnHover = false,
  autoScramble = true,
  scrambleInterval = 5000 
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const isScrambling = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>[]{}+=?:~"

  const scramble = () => {
    if (isScrambling.current) return
    isScrambling.current = true

    let iteration = 0
    const maxIterations = text.length * 3

    animationRef.current = setInterval(() => {
      let result = ""
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " "
        } else if (i < iteration / 3) {
          result += text[i]
        } else {
          result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        }
      }
      
      setDisplayText(result)
      iteration++

      if (iteration >= maxIterations) {
        if (animationRef.current) clearInterval(animationRef.current)
        setDisplayText(text)
        isScrambling.current = false
      }
    }, 30)
  }

  useEffect(() => {
    setDisplayText(text)
    
    if (autoScramble) {
      const initialTimeout = setTimeout(scramble, 100)
      
      intervalRef.current = setInterval(scramble, scrambleInterval)

      return () => {
        clearTimeout(initialTimeout)
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (animationRef.current) clearInterval(animationRef.current)
      }
    }
  }, [text, autoScramble, scrambleInterval])

  return (
    <span className={className} onMouseEnter={scrambleOnHover ? scramble : undefined}>
      {displayText}
    </span>
  )
}
