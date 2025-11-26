"use client"

import { useState, useEffect, useRef } from "react" // Import useRef

interface TypedTextProps {
  text: string
  speed?: number // milliseconds per character
  soundEnabled?: boolean
  onTypingComplete?: () => void
}

export function TypedText({ text, speed = 10, soundEnabled = false, onTypingComplete }: TypedTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasCompletedRef = useRef(false) // Add a ref to track if completion has been called

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
        if (soundEnabled) {
          // Simulate keypress sound for output
          // In a real app, you'd play an actual sound file
          // console.log("Playing output keypress sound");
        }
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      // Only call onTypingComplete if it hasn't been called yet for this instance
      if (!hasCompletedRef.current) {
        onTypingComplete?.()
        hasCompletedRef.current = true
      }
    }
  }, [currentIndex, text, speed, soundEnabled, onTypingComplete])

  return <>{displayedText}</>
}
