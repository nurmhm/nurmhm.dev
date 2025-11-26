"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface DynamicCodeDisplayProps {
  codeSnippets: string[]
}

export function DynamicCodeDisplay({ codeSnippets }: DynamicCodeDisplayProps) {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0)
  const [displayedCode, setDisplayedCode] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentSnippet = codeSnippets[currentSnippetIndex]

    if (isTyping) {
      if (charIndex < currentSnippet.length) {
        const typingTimeout = setTimeout(() => {
          setDisplayedCode((prev) => prev + currentSnippet[charIndex])
          setCharIndex((prev) => prev + 1)
        }, 50)
        return () => clearTimeout(typingTimeout)
      } else {
        const pauseTimeout = setTimeout(() => {
          setIsTyping(false)
          setCharIndex(currentSnippet.length)
        }, 2000)
        return () => clearTimeout(pauseTimeout)
      }
    } else {
      if (charIndex > 0) {
        const deletingTimeout = setTimeout(() => {
          setDisplayedCode((prev) => prev.slice(0, -1))
          setCharIndex((prev) => prev - 1)
        }, 30)
        return () => clearTimeout(deletingTimeout)
      } else {
        const nextSnippetTimeout = setTimeout(() => {
          setCurrentSnippetIndex((prev) => (prev + 1) % codeSnippets.length)
          setIsTyping(true)
        }, 500)
        return () => clearTimeout(nextSnippetTimeout)
      }
    }
  }, [charIndex, isTyping, currentSnippetIndex, codeSnippets])

  return (
    <div className="relative w-full h-96 bg-slate-900/90 rounded-2xl backdrop-blur-sm border border-slate-700 overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-slate-400 text-sm font-mono">developer.ts</span>
      </div>

      {/* Code Preview */}
      <div className="p-6 font-mono text-sm text-slate-100 h-[calc(100%-48px)] overflow-auto">
        <pre className="whitespace-pre-wrap break-words">
          <code className="language-typescript">
            {displayedCode}
            <motion.span
              className="inline-block w-2 h-5 bg-emerald-400 align-bottom ml-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, ease: "easeInOut" }}
            />
          </code>
        </pre>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-16 right-4 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
    </div>
  )
}
