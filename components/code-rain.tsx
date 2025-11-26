"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function CodeRain() {
  const [lines, setLines] = useState<Array<{ id: number; delay: number; duration: number }>>([])

  useEffect(() => {
    const newLines = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }))
    setLines(newLines)
  }, [])

  const codeSnippets = [
    "const developer = 'Nur Mohammad';",
    "function buildAmazingApps() {",
    "  return 'React + Next.js';",
    "}",
    "npm install creativity",
    "git commit -m 'Added magic'",
    "console.log('Hello World!');",
    "export default Portfolio;",
    "useState('creative');",
    "useEffect(() => {",
    "  makeAwesome();",
    "});",
    "import { success } from 'career';",
    "const skills = ['React', 'Next.js'];",
    "async function deploy() {",
    "  await vercel.deploy();",
    "}",
    "// Building the future",
    "class Developer extends Human {",
    "  constructor() {",
    "    super('passionate');",
    "  }",
    "}",
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute text-green-400/30 font-mono text-xs whitespace-nowrap"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-20px",
          }}
          animate={{
            y: "100vh",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
        </motion.div>
      ))}
    </div>
  )
}
