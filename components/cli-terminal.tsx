"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react" // Added useCallback
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Minimize2, Maximize2, X, Volume2, VolumeX, ArrowRight } from "lucide-react"
import { TypedText } from "./typed-text"
import { Calendar } from "lucide-react"

interface Command {
  input: string
  output: {
    typed: string
    rich?: React.ReactNode
  }
  timestamp: string
  isTypingComplete?: boolean // Added flag for rich content timing
}

interface CLITerminalProps {
  isOpen: boolean
  onClose: () => void
}

const testimonials = [
  {
    name: "Jane Doe",
    title: "Product Manager",
    company: "Tech Solutions Inc.",
    quote:
      "Nur is an exceptional frontend developer. His ability to translate complex designs into pixel-perfect, responsive UIs is truly impressive. He's a great communicator and a valuable asset to any team.",
    avatar: "/placeholder.svg?height=64&width=64", // More descriptive query
  },
  {
    name: "John Smith",
    title: "Lead Backend Engineer",
    company: "Global Innovations",
    quote:
      "Working with Nur was a fantastic experience. He consistently delivered high-quality code, optimized for performance, and always went the extra mile to ensure user satisfaction. Highly recommended!",
    avatar: "/placeholder.svg?height=64&width=64", // More descriptive query
  },
  {
    quote:
      "Nur's expertise in React and Next.js is evident in the robust and scalable applications he builds. He's proactive, detail-oriented, and a pleasure to collaborate with. A true professional.",
    name: "Emily White",
    title: "UI/UX Designer",
    company: "Creative Studio",
    avatar: "/placeholder.svg?height=64&width=64", // More descriptive query
  },
]

const blogPosts = [
  {
    title: "Mastering React Hooks: A Deep Dive into useState and useEffect",
    date: "July 25, 2025",
    excerpt:
      "Explore the power of React Hooks with our in-depth guide to useState and useEffect. Learn how to manage state and side effects effectively in your React applications.",
    link: "#", // Placeholder link
  },
  {
    title: "Next.js 15: New Features and Performance Optimizations",
    date: "July 10, 2025",
    excerpt:
      "Discover the latest features and performance improvements in Next.js 15. Stay up-to-date with the cutting-edge of web development and optimize your Next.js projects.",
    link: "#", // Placeholder link
  },
  {
    title: "Building Accessible Web Interfaces with Tailwind CSS",
    date: "June 28, 2025",
    excerpt:
      "Learn how to create accessible web interfaces using Tailwind CSS. Ensure your websites are inclusive and user-friendly for everyone, regardless of their abilities.",
    link: "#", // Placeholder link
  },
]

export function CLITerminal({ isOpen, onClose }: CLITerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Command[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMinimized, setIsMinimized] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isTyping, setIsTyping] = useState(false) // Added typing indicator state
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Audio elements for sound effects
  // const keypressAudioRef = useRef<HTMLAudioElement | null>(null)
  // const enterAudioRef = useRef<HTMLAudioElement | null>(null)
  // const errorAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio elements
    // keypressAudioRef.current = new Audio("/sounds/keypress.mp3")
    // enterAudioRef.current = new Audio("/sounds/enter.mp3")
    // errorAudioRef.current = new Audio("/sounds/error.mp3")
  }, [])

  const playSound = useCallback(
    (type: "keypress" | "enter" | "error") => {
      if (!soundEnabled) return
      // let audio: HTMLAudioElement | null = null
      // if (type === "keypress") audio = keypressAudioRef.current
      // else if (type === "enter") audio = enterAudioRef.current
      // else if (type === "error") audio = errorAudioRef.current

      // if (audio) {
      //   audio.currentTime = 0 // Rewind to start for quick playback
      //   audio.play().catch((e) => console.error("Error playing sound:", e))
      // }
    },
    [soundEnabled],
  )

  const welcomeMessage: Command = {
    input: "system_init",
    output: {
      typed: `
╔══════════════════════════════════════════════════════════════╗
║ NUR'S PORTFOLIO CLI v2.0 ║
╚══════════════════════════════════════════════════════════════╝
Welcome! I'm Nur Mohammad - Frontend Developer
Specializing in React.js, Next.js & Modern Web Technologies
Based in Dhaka, Bangladesh

System Status: ONLINE | Ready for commands
Type 'help' to explore my portfolio
      `.trim(),
      rich: (
        <div className="space-y-2">
          <div className="text-green-400 text-lg font-bold animate-pulse">
            ╔══════════════════════════════════════════════════════════════╗
          </div>
          <div className="text-green-400 text-lg font-bold animate-pulse">║ NUR'S PORTFOLIO CLI v2.0 ║</div>
          <div className="text-green-400 text-lg font-bold animate-pulse">
            ╚══════════════════════════════════════════════════════════════╝
          </div>
          <div className="text-cyan-400 mt-4">
            <div className="flex items-center gap-2">
              <span className="animate-bounce">👋</span>
              <span>Welcome! I'm Nur Mohammad - Frontend Developer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="animate-pulse">🚀</span>
              <span>Specializing in React.js, Next.js & Modern Web Technologies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="animate-ping">📍</span>
              <span>Based in Dhaka, Bangladesh</span>
            </div>
          </div>
          <div className="text-yellow-400 mt-4 p-2 border border-yellow-500/30 rounded">
            <div className="flex items-center gap-2">
              <span className="animate-spin">⚡</span>
              <span>System Status: ONLINE | Ready for commands</span>
            </div>
            <div className="mt-2">
              Type <span className="text-white bg-gray-800 px-2 py-1 rounded font-mono">help</span> to explore my
              portfolio
            </div>
          </div>
        </div>
      ),
    },
    timestamp: new Date().toLocaleTimeString(),
    isTypingComplete: true, // Welcome message is instantly complete
  }

  useEffect(() => {
    if (isOpen) {
      setHistory([welcomeMessage])
      inputRef.current?.focus()
    }
  }, [isOpen])

  const commands: { [key: string]: Command["output"] | ((cmd: string) => Command["output"]) } = {
    help: {
      typed: `📋 AVAILABLE COMMANDS
🔍 NAVIGATION:
  about        - Personal information
  skills       - Technical expertise
  experience   - Work history
  projects     - Featured projects
  testimonials - Client testimonials
  blog         - My articles and insights
  education    - Academic background
  contact      - Contact info
🔗 ACTIONS:
  resume       - Download CV
  github       - Open GitHub
  linkedin     - Open LinkedIn
  clear        - Clear terminal
💡 Pro Tip: Use arrow keys ↑↓ to navigate command history`,
      rich: (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold text-lg">📋 AVAILABLE COMMANDS</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-500/30 p-3 rounded">
              <div className="text-green-400 font-bold mb-2">🔍 NAVIGATION</div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-yellow-400">about</span> - About me
                </div>
                <div>
                  <span className="text-yellow-400">skills</span> - Technical skills
                </div>
                <div>
                  <span className="text-yellow-400">experience</span> - Work history
                </div>
                <div>
                  <span className="text-yellow-400">projects</span> - My projects
                </div>
                <div>
                  <span className="text-yellow-400">testimonials</span> - Client testimonials
                </div>
                <div>
                  <span className="text-yellow-400">blog</span> - My articles and insights
                </div>
                <div>
                  <span className="text-yellow-400">education</span> - Academic background
                </div>
                <div>
                  <span className="text-yellow-400">contact</span> - Contact info
                </div>
              </div>
            </div>
            <div className="border border-blue-500/30 p-3 rounded">
              <div className="text-blue-400 font-bold mb-2">🔗 ACTIONS</div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-yellow-400">resume</span> - Download CV
                </div>
                <div>
                  <span className="text-yellow-400">github</span> - Open GitHub
                </div>
                <div>
                  <span className="text-yellow-400">linkedin</span> - Open LinkedIn
                </div>
                <div>
                  <span className="text-yellow-400">clear</span> - Clear terminal
                </div>
              </div>
            </div>
          </div>
          <div className="text-purple-400 text-sm mt-4 p-2 border border-purple-500/30 rounded">
            💡 <strong>Pro Tip:</strong> Use arrow keys ↑↓ to navigate command history
          </div>
        </div>
      ),
    },
    about: {
      typed: `🧑‍💻 ABOUT NUR MOHAMMAD
Name: Nur Mohammad
Role: Frontend Developer & React Specialist
Location: Dhaka, Bangladesh
Experience: 2+ Years in Web Development

Professional Summary:
Passionate Frontend Developer with expertise in modern web technologies. Currently working at Trodad International, developing scalable HealthTech platforms using the React ecosystem. My journey in web development started with a curiosity about how websites work, and it has evolved into a passion for creating clean, efficient, and user-friendly applications that solve real-world problems. I believe in writing clean code, following best practices, and continuously learning new technologies to stay at the forefront of web development.`,
      rich: (
        <div className="space-y-4">
          <div className="text-cyan-400 font-bold text-lg">🧑‍💻 ABOUT NUR MOHAMMAD</div>
          <div className="border-l-4 border-blue-500 pl-6 space-y-3">
            <div className="text-gray-100">
              <span className="text-yellow-400">Name:</span> Nur Mohammad
            </div>
            <div className="text-gray-100">
              <span className="text-yellow-400">Role:</span> Frontend Developer & React Specialist
            </div>
            <div className="text-gray-100">
              <span className="text-yellow-400">Location:</span> Dhaka, Bangladesh
            </div>
            <div className="text-gray-100">
              <span className="text-yellow-400">Experience:</span> 2+ Years in Web Development
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded border border-green-500/30">
            <div className="text-white mb-2">📝 Professional Summary:</div>
            <div className="text-gray-200 leading-relaxed">
              Passionate Frontend Developer with expertise in modern web technologies. Currently working at{" "}
              <span className="text-green-400 font-semibold">Trodad International</span>, developing scalable HealthTech
              platforms using the React ecosystem.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-900/30 p-3 rounded border border-blue-500/30">
              <div className="text-blue-400 font-bold">🎯 Focus Areas</div>
              <div className="text-sm text-gray-200 mt-1">
                • Responsive Web Design
                <br />• Performance Optimization
                <br />• Clean Code Architecture
              </div>
            </div>
            <div className="bg-purple-900/30 p-3 rounded border border-purple-500/30">
              <div className="text-purple-400 font-bold">💡 Passion</div>
              <div className="text-sm text-gray-200 mt-1">
                Building user-friendly applications that solve real-world problems with modern technologies.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    skills: {
      typed: `🛠️ TECHNICAL SKILLS
Frontend Technologies: HTML5, CSS3, JavaScript, TypeScript, React.js, Next.js, Tailwind CSS, Vite
Libraries & Tools: Redux, Zustand, React Hook Form, Zod, TanStack Query, TanStack Table, MongoDB, Figma
Development Tools: Git, GitHub, RESTful APIs, VS Code, Netlify, Vercel, Firebase
Backend Integration: Node.js, Express.js, Django REST, Laravel
Soft Skills: Problem Solving, Team Collaboration, Fast Learner, Adaptability`,
      rich: (
        <div className="space-y-4">
          <div className="text-cyan-400 font-bold text-lg">🛠️ TECHNICAL SKILLS</div>
          <div className="space-y-4">
            <div className="border border-blue-500/30 p-4 rounded">
              <div className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <span>🎨</span> Frontend Technologies
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", "Tailwind CSS", "Vite"].map(
                  (skill) => (
                    <span key={skill} className="bg-blue-900/30 text-blue-200 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div className="border border-purple-500/30 p-4 rounded">
              <div className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                <span>📚</span> Libraries & Tools
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {[
                  "Redux",
                  "Zustand",
                  "React Hook Form",
                  "Zod",
                  "TanStack Query",
                  "TanStack Table",
                  "MongoDB",
                  "Figma",
                ].map((skill) => (
                  <span key={skill} className="bg-purple-900/30 text-purple-200 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="border border-green-500/30 p-4 rounded">
              <div className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <span>🔧</span> Development Tools
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {["Git", "GitHub", "RESTful APIs", "VS Code", "Netlify", "Vercel", "Firebase"].map((skill) => (
                  <span key={skill} className="bg-green-900/30 text-green-200 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="border border-yellow-500/30 p-4 rounded">
              <div className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                <span>⚙️</span> Backend Integration
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {["Node.js", "Express.js", "Django REST", "Laravel"].map((skill) => (
                  <span key={skill} className="bg-yellow-900/30 text-yellow-200 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded border border-cyan-500/30 mt-4">
            <div className="text-cyan-400 font-bold mb-2">🌟 Soft Skills</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Problem Solving
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Team Collaboration
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Fast Learner
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Adaptability
              </div>
            </div>
          </div>
        </div>
      ),
    },
    experience: {
      typed: `💼 WORK EXPERIENCE
Frontend Developer at Trodad International (May 2025 – Present)
- Developing and maintaining a scalable HealthTech platform using modern React ecosystem
- Implementing reusable and modular frontend components with Next.js, Tailwind CSS, and TanStack libraries
- Collaborating with backend team to integrate Django REST APIs for data-driven features and interactive dashboards
- Enhanced development speed and maintainability through clean code architecture

Junior Frontend Developer at Ankabut Software (Jun 2024 – Apr 2025)
- Developed and delivered over 30 frontend modules for various client projects
- Built responsive, performant, and pixel-perfect UIs using React.js and Tailwind CSS
- Integrated various third-party APIs ensuring clean code architecture and UI scalability
- Ensured UI scalability for diverse client requirements
Key Project: RAJSEBA (rajseba.com) - Home service booking platform built with Next.js, TypeScript, and Tailwind CSS`,
      rich: (
        <div className="space-y-4">
          <div className="text-cyan-400 font-bold text-lg">💼 WORK EXPERIENCE</div>
          <div className="space-y-6">
            <div className="border border-green-500/30 p-4 rounded bg-green-900/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-green-400 font-bold text-lg">Frontend Developer</div>
                <div className="text-green-300 text-sm bg-green-800/30 px-2 py-1 rounded">CURRENT</div>
              </div>
              <div className="text-yellow-400 font-semibold">Trodad International</div>
              <div className="text-gray-300 text-sm mb-3">May 2025 – Present | Mohakhali (DOHS), Dhaka</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▶</span>
                  <span>Developing and maintaining a scalable HealthTech platform using modern React ecosystem</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▶</span>
                  <span>
                    Implementing reusable and modular frontend components with Next.js, Tailwind CSS, and TanStack
                    libraries
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▶</span>
                  <span>
                    Collaborating with backend team to integrate Django REST APIs for data-driven features and
                    interactive dashboards
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▶</span>
                  <span>Enhanced development speed and maintainability through clean code architecture</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["React.js", "Next.js", "Tailwind CSS", "TanStack", "Django REST API"].map((tech) => (
                  <span key={tech} className="bg-green-800/30 text-green-200 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-blue-500/30 p-4 rounded bg-blue-900/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-400 font-bold text-lg">Junior Frontend Developer</div>
                <div className="text-blue-300 text-sm bg-blue-800/30 px-2 py-1 rounded">COMPLETED</div>
              </div>
              <div className="text-yellow-400 font-semibold">Ankabut Software</div>
              <div className="text-gray-300 text-sm mb-3">Jun 2024 – Apr 2025 | Rajshahi</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▶</span>
                  <span>Developed and delivered over 30 frontend modules for various client projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▶</span>
                  <span>Built responsive, performant, and pixel-perfect UIs using React.js and Tailwind CSS</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▶</span>
                  <span>Integrated various third-party APIs with clean code architecture</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▶</span>
                  <span>Ensured UI scalability for diverse client requirements</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                <div className="text-yellow-400 font-bold text-sm">🌟 Key Project:</div>
                <div className="text-white font-semibold">RAJSEBA</div>
                <div className="text-gray-200 text-sm">
                  Home service booking platform built with Next.js, TypeScript, and Tailwind CSS
                </div>
                <div className="text-blue-400 text-sm">
                  🔗 Live at:{" "}
                  <a href="https://rajseba.com" target="_blank" rel="noopener noreferrer" className="underline">
                    rajseba.com
                  </a>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["React.js", "Tailwind CSS", "JavaScript", "RESTful APIs"].map((tech) => (
                  <span key={tech} className="bg-blue-800/30 text-blue-200 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    projects: {
      typed: `🚀 FEATURED PROJECTS
BoiZaar: Peer-to-peer marketplace for academic books.
Technologies: Next.js, TypeScript, Tailwind CSS, TanStack Query, Django, PostgreSQL
Live: https://trio-beam-boi-zaar.vercel.app | GitHub: https://github.com/nurmhm/boizaar

StudyBuddyHub: Collaborative group study platform.
Technologies: React.js, Node.js, Express.js, MongoDB, JWT, Socket.io
Live: N/A | Client Code: N/A | Server Code: N/A

RAJSEBA: Comprehensive home service booking platform.
Technologies: Next.js, TypeScript, Tailwind CSS, API Integration, Payment Gateway
Live: https://rajseba.com`,
      rich: (
        <div className="space-y-4">
          <div className="text-cyan-400 font-bold text-lg">🚀 FEATURED PROJECTS</div>
          <div className="space-y-4">
            <div className="border border-yellow-500/30 p-4 rounded bg-yellow-900/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-yellow-400 font-bold text-lg flex items-center gap-2">
                  <span>📚</span> BoiZaar
                </div>
                <div className="text-yellow-300 text-sm bg-yellow-800/30 px-2 py-1 rounded animate-pulse">
                  IN DEVELOPMENT
                </div>
              </div>
              <div className="text-gray-200 mb-3">
                A peer-to-peer marketplace for academic books, connecting students for buying and selling used
                textbooks.
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="text-green-400">🎯 Key Features:</div>
                <div className="ml-4 space-y-1">
                  <div>• User authentication system with secure login/registration</div>
                  <div>• Book listings with advanced search and filter functionality</div>
                  <div>• Direct messaging system between buyers and sellers</div>
                  <div>• Responsive, modern UI/UX for seamless transactions</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["Next.js", "TypeScript", "Tailwind CSS", "TanStack Query", "Django", "PostgreSQL"].map((tech) => (
                  <span key={tech} className="bg-yellow-800/30 text-yellow-200 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-blue-400 text-sm">
                🔗{" "}
                <a
                  href="https://trio-beam-boi-zaar.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  trio-beam-boi-zaar.vercel.app
                </a>{" "}
                | 📁{" "}
                <a
                  href="https://github.com/nurmhm/boizaar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className="border border-purple-500/30 p-4 rounded bg-purple-900/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-purple-400 font-bold text-lg flex items-center gap-2">
                  <span>👥</span> StudyBuddyHub
                </div>
                <div className="text-purple-300 text-sm bg-purple-800/30 px-2 py-1 rounded">COMPLETED</div>
              </div>
              <div className="text-gray-200 mb-3">
                A collaborative group study platform enabling users to create, submit, and evaluate assignments with
                secure authentication.
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="text-green-400">🎯 Key Features:</div>
                <div className="ml-4 space-y-1">
                  <div>• JWT-based authentication with user roles and permissions</div>
                  <div>• Full CRUD functionality for assignment management</div>
                  <div>• Collaborative features for group study sessions</div>
                  <div>• Fully responsive design deployed on Vercel</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["React.js", "Node.js", "Express.js", "MongoDB", "JWT"].map((tech) => (
                  <span key={tech} className="bg-purple-800/30 text-purple-200 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-blue-400 text-sm">
                🔗 <span className="underline">Live Demo (N/A)</span> | 📁{" "}
                <span className="underline">Client Code (N/A)</span> | 🗄️{" "}
                <span className="underline">Server Code (N/A)</span>
              </div>
            </div>

            <div className="border border-green-500/30 p-4 rounded bg-green-900/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-green-400 font-bold text-lg flex items-center gap-2">
                  <span>🏠</span> RAJSEBA
                </div>
                <div className="text-green-300 text-sm bg-green-800/30 px-2 py-1 rounded">LIVE</div>
              </div>
              <div className="text-gray-200 mb-3">
                A comprehensive home service booking platform connecting service providers with customers for various
                home services.
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="text-green-400">🎯 Key Features:</div>
                <div className="ml-4 space-y-1">
                  <div>• Service booking system with real-time availability</div>
                  <div>• Provider management dashboard</div>
                  <div>• Real-time notifications and updates</div>
                  <div>• Integrated payment processing system</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["Next.js", "TypeScript", "Tailwind CSS", "API Integration"].map((tech) => (
                  <span key={tech} className="bg-green-800/30 text-green-200 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-blue-400 text-sm">
                🔗{" "}
                <a href="https://rajseba.com" target="_blank" rel="noopener noreferrer" className="underline">
                  rajseba.com
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    testimonials: {
      typed: `🌟 CLIENT TESTIMONIALS
Jane Doe, Product Manager at Tech Solutions Inc.:
"Nur is an exceptional frontend developer. His ability to translate complex designs into pixel-perfect, responsive UIs is truly impressive. He's a great communicator and a valuable asset to any team."

John Smith, Lead Backend Engineer at Global Innovations:
"Working with Nur was a fantastic experience. He consistently delivered high-quality code, optimized for performance, and always went the extra mile to ensure user satisfaction. Highly recommended!"

Emily White, UI/UX Designer at Creative Studio:
"Nur's expertise in React and Next.js is evident in the robust and scalable applications he builds. He's proactive, detail-oriented, and a pleasure to collaborate with. A true professional."`,
      rich: (
        <div className="space-y-4">
          <div className="text-cyan-400 font-bold text-lg">🌟 CLIENT TESTIMONIALS</div>
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="border border-pink-500/30 p-4 rounded bg-pink-900/10">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                  />
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-300">
                      {testimonial.title}, {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className="text-gray-200 leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    blog: {
      typed: `📝 MY LATEST ARTICLES
Mastering React Hooks: A Deep Dive into useState and useEffect (July 25, 2025)
Next.js 15: New Features and Performance Optimizations (July 10, 2025)
Building Accessible Web Interfaces with Tailwind CSS (June 28, 2025)
💡 Visit the blog section on the main website for full articles!`,
      rich: (
        <div className="space-y-4">
          <div className="text-cyan-400 font-bold text-lg">📝 MY LATEST ARTICLES</div>
          <div className="space-y-6">
            {blogPosts.map((post, index) => (
              <div key={index} className="border border-orange-500/30 p-4 rounded bg-orange-900/10">
                <div className="font-bold text-white text-lg mb-2">{post.title}</div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <p className="text-gray-200 mb-3">{post.excerpt}</p>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline flex items-center gap-2"
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
          <div className="text-yellow-400 mt-4 text-sm">
            💡 Visit the blog section on the main website for full articles!
          </div>
        </div>
      ),
    },
    education: {
      typed: `🎓 EDUCATION
Bachelor of Science in Computer Science & Engineering at Uttara University (2024 – Present)
- Currently pursuing advanced computer science concepts with focus on software engineering and web technologies.
- Active participation in coding competitions, member of university programming club, contributing to open-source projects.

Diploma in Computer Technology at Jessore Polytechnic Institute (2019 – 2024)
- Graduated with distinction (CGPA: 3.66 out of 4.00).
- Comprehensive study of computer systems and programming.
- Led multiple group projects successfully, received excellence award in web development, completed internship with outstanding performance.`,
      rich: (
        <div className="space-y-4">
          <div className="text-cyan-400 font-bold text-lg">🎓 EDUCATION</div>
          <div className="space-y-4">
            <div className="border border-blue-500/30 p-4 rounded bg-blue-900/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-blue-400 text-2xl">🎓</div>
                <div>
                  <div className="text-blue-400 font-bold text-lg">
                    Bachelor of Science in Computer Science & Engineering
                  </div>
                  <div className="text-yellow-400 font-semibold">Uttara University</div>
                </div>
              </div>
              <div className="text-gray-300 text-sm mb-3">2024 – Present | Dhaka, Bangladesh</div>
              <div className="bg-blue-800/20 p-3 rounded border border-blue-500/20">
                <div className="text-blue-300 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">📚</span>
                    <span>Currently pursuing advanced computer science concepts</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">💻</span>
                    <span>Focus on software engineering and web technologies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">🎯</span>
                    <span>Expected graduation: 2028</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-green-500/30 p-4 rounded bg-green-900/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-green-400 text-2xl">🏆</div>
                <div>
                  <div className="text-green-400 font-bold text-lg">Diploma in Computer Technology</div>
                  <div className="text-yellow-400 font-semibold">Jessore Polytechnic Institute</div>
                </div>
              </div>
              <div className="text-gray-300 text-sm mb-3">2019 – 2024 | Jessore, Bangladesh</div>
              <div className="bg-green-800/20 p-3 rounded border border-green-500/20">
                <div className="text-green-300 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">🌟</span>
                    <span className="font-bold">CGPA: 3.66 out of 4.00</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">📖</span>
                    <span>Comprehensive study of computer systems and programming</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">🔧</span>
                    <span>Hands-on experience with various technologies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">🏅</span>
                    <span>Strong foundation in computer science fundamentals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    contact: {
      typed: `📞 CONTACT INFORMATION
Direct Contact:
Email: nurmd7228@gmail.com
Phone: +8801770514004
Location: Dhaka, Bangladesh

Social Links:
LinkedIn: linkedin.com/in/nurmhm7228
GitHub: github.com/nurmhm

Availability:
Available for freelance projects, open to full-time opportunities.
Response time: Email (Within 24 hours), LinkedIn (Within 12 hours), Phone (Business hours 9 AM - 6 PM).`,
      rich: (
        <div className="space-y-4">
          <div className="text-cyan-400 font-bold text-lg">📞 CONTACT INFORMATION</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-green-500/30 p-4 rounded bg-green-900/10">
              <div className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <span>📧</span> Direct Contact
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-green-800/20 rounded">
                  <span className="text-green-400">📧</span>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-green-200 text-sm">nurmd7228@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-800/20 rounded">
                  <span className="text-green-400">📱</span>
                  <div>
                    <div className="text-white font-semibold">Phone</div>
                    <div className="text-green-200 text-sm">+8801770514004</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-800/20 rounded">
                  <span className="text-green-400">📍</span>
                  <div>
                    <div className="text-white font-semibold">Location</div>
                    <div className="text-green-200 text-sm">Dhaka, Bangladesh</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-blue-500/30 p-4 rounded bg-blue-900/10">
              <div className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <span>🔗</span> Social Links
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-blue-800/20 rounded hover:bg-blue-700/30 transition-colors cursor-pointer">
                  <span className="text-blue-400">🔗</span>
                  <div>
                    <div className="text-white font-semibold">LinkedIn</div>
                    <div className="text-blue-200 text-sm">linkedin.com/in/nurmhm7228</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-800/20 rounded hover:bg-blue-700/30 transition-colors cursor-pointer">
                  <span className="text-purple-400">🐙</span>
                  <div>
                    <div className="text-white font-semibold">GitHub</div>
                    <div className="text-purple-200 text-sm">github.com/nurmhm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-yellow-500/30 p-4 rounded bg-yellow-900/10">
            <div className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span>💼</span> Availability
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-green-400 font-semibold">✅ Available For:</div>
                <div className="text-sm space-y-1 ml-4 text-gray-200">
                  <div>• Freelance Projects</div>
                  <div>• Full-time Opportunities</div>
                  <div>• Consulting & Code Reviews</div>
                  <div>• Technical Collaborations</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-blue-400 font-semibold">🕒 Response Time:</div>
                <div className="text-sm space-y-1 ml-4 text-gray-200">
                  <div>• Email: Within 24 hours</div>
                  <div>• LinkedIn: Within 12 hours</div>
                  <div>• Phone: Business hours (9 AM - 6 PM)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded border border-cyan-500/30">
            <div className="text-cyan-400 font-bold mb-2">🚀 Let's Build Something Amazing Together!</div>
            <div className="text-gray-200 text-sm">
              I'm always excited to work on innovative projects and collaborate with talented teams.
            </div>
          </div>
        </div>
      ),
    },
    resume: {
      typed: `📄 RESUME DOWNLOAD
Preparing Resume Download...
Latest version with all experience and projects
Document Type: PDF
File Size: ~2.5 MB
Last Updated: January 2025
Includes: Experience, Projects, Skills, Education
💡 In a real implementation, this would trigger a PDF download!`,
      rich: (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold text-lg">📄 RESUME DOWNLOAD</div>
          <div className="border border-green-500/30 p-4 rounded bg-green-900/10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-green-400 text-2xl animate-bounce">📥</span>
              <div>
                <div className="text-green-400 font-bold">Preparing Resume Download...</div>
                <div className="text-gray-200 text-sm">Latest version with all experience and projects</div>
              </div>
            </div>
            <div className="bg-green-800/20 p-3 rounded">
              <div className="text-green-200 text-sm space-y-1">
                <div>📋 Document Type: PDF</div>
                <div>📊 File Size: ~2.5 MB</div>
                <div>🔄 Last Updated: January 2025</div>
                <div>📝 Includes: Experience, Projects, Skills, Education</div>
              </div>
            </div>
            <div className="text-yellow-400 mt-3 text-sm">
              💡 In a real implementation, this would trigger a PDF download!
            </div>
          </div>
        </div>
      ),
    },
    github: {
      typed: `🐙 OPENING GITHUB PROFILE
Redirecting to GitHub...
https://github.com/nurmhm
Public Repositories: 15+
Total Stars: 50+
Forks: 20+
Contributions: Active daily`,
      rich: (
        <div className="space-y-3">
          <div className="text-purple-400 font-bold text-lg flex items-center gap-2">
            <span className="animate-spin">🐙</span> OPENING GITHUB PROFILE
          </div>
          <div className="border border-purple-500/30 p-4 rounded bg-purple-900/10">
            <div className="text-green-400 mb-2">✅ Redirecting to GitHub...</div>
            <div className="text-white font-mono">
              <a href="https://github.com/nurmhm" target="_blank" rel="noopener noreferrer" className="underline">
                https://github.com/nurmhm
              </a>
            </div>
            <div className="mt-3 text-sm text-gray-200">
              <div>📊 Public Repositories: 15+</div>
              <div>⭐ Total Stars: 50+</div>
              <div>🍴 Forks: 20+</div>
              <div>📈 Contributions: Active daily</div>
            </div>
          </div>
        </div>
      ),
    },
    linkedin: {
      typed: `🔗 OPENING LINKEDIN PROFILE
Redirecting to LinkedIn...
https://linkedin.com/in/nurmhm7228
Connections: 500+
Posts: Regular tech updates
Recommendations: Available
Professional Network: Growing`,
      rich: (
        <div className="space-y-3">
          <div className="text-blue-400 font-bold text-lg flex items-center gap-2">
            <span className="animate-pulse">🔗</span> OPENING LINKEDIN PROFILE
          </div>
          <div className="border border-blue-500/30 p-4 rounded bg-blue-900/10">
            <div className="text-green-400 mb-2">✅ Redirecting to LinkedIn...</div>
            <div className="text-white font-mono">
              <a
                href="https://linkedin.com/in/nurmhm7228"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                https://linkedin.com/in/nurmhm7228
              </a>
            </div>
            <div className="mt-3 text-sm text-gray-200">
              <div>👥 Connections: 500+</div>
              <div>📝 Posts: Regular tech updates</div>
              <div>🏆 Recommendations: Available</div>
              <div>💼 Professional Network: Growing</div>
            </div>
          </div>
        </div>
      ),
    },
    error: (cmd: string) => ({
      typed: `❌ Command not found: ${cmd}
💡 Did you mean:
• help - Show all available commands
• about - Learn about me
• projects - View my projects`,
      rich: (
        <div className="space-y-2">
          <div className="text-red-400 flex items-center gap-2">
            <span className="animate-pulse">❌</span>
            <span>
              Command not found: <span className="text-white font-mono bg-red-900/30 px-2 py-1 rounded">{cmd}</span>
            </span>
          </div>
          <div className="text-yellow-400 bg-yellow-900/20 p-3 rounded border border-yellow-500/30">
            <div className="font-bold mb-1">💡 Did you mean:</div>
            <div className="text-sm space-y-1">
              <div>
                • <span className="text-white">help</span> - Show all available commands
              </div>
              <div>
                • <span className="text-white">about</span> - Learn about me
              </div>
              <div>
                • <span className="text-white">projects</span> - View my projects
              </div>
            </div>
          </div>
        </div>
      ),
    }),
  }

  const handleTypingComplete = useCallback((index: number) => {
    setHistory((prevHistory) => prevHistory.map((cmd, i) => (i === index ? { ...cmd, isTypingComplete: true } : cmd)))
    setIsTyping(false)
  }, [])

  const executeCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim()
    const timestamp = new Date().toLocaleTimeString()

    // playSound("enter")

    if (command === "clear") {
      setHistory([welcomeMessage])
      setInput("")
      return
    }

    let outputContent: Command["output"]
    const commandHandler = commands[command as keyof typeof commands]
    if (commandHandler) {
      outputContent = typeof commandHandler === "function" ? commandHandler(cmd) : commandHandler
    } else {
      outputContent = commands.error(cmd)
      // playSound("error") // Play error sound for unknown commands
    }

    const newCommand: Command = { input: cmd, output: outputContent, timestamp, isTypingComplete: false }
    setHistory((prev) => [...prev, newCommand])
    setCommandHistory((prev) => [...prev, cmd])
    setHistoryIndex(-1)
    setInput("")
    setIsTyping(true) // Set typing indicator when a new command is executed

    // Handle external links
    if (command === "github") {
      setTimeout(() => window.open("https://github.com/nurmhm", "_blank"), 1500)
    } else if (command === "linkedin") {
      setTimeout(() => window.open("https://linkedin.com/in/nurmhm7228", "_blank"), 1500)
    } else if (command === "resume") {
      // Simulate resume download
      setTimeout(() => {
        console.log("Simulating resume download...")
        // In a real app, you'd trigger a file download here, e.g.:
        // const link = document.createElement('a');
        // link.href = '/path/to/your/resume.pdf';
        // link.download = 'Nur_Mohammad_Resume.pdf';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
      }, 1500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key.length === 1) {
      // Only play sound for single character keys
      // playSound("keypress")
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null
    if (isTyping) {
      scrollInterval = setInterval(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, 50) // Scroll every 50ms while typing
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval)
      }
    }
  }, [isTyping]) // This effect runs when isTyping changes

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`w-full max-w-6xl bg-black rounded-lg shadow-2xl border border-gray-700 overflow-hidden flex flex-col ${
            isMinimized ? "h-12" : "max-h-[80vh] min-h-[300px]"
          } transition-all duration-300`}
        >
          {/* Terminal Header - Always visible */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer transition-colors"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer transition-colors"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer transition-colors"></div>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-mono">nur@portfolio:~$</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                // onClick={() => setSoundEnabled(!soundEnabled)}
                onClick={() => console.log("Sound toggle commented out")}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title={soundEnabled ? "Disable Sound" : "Enable Sound"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-400 transition-colors p-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terminal Content */}
          {!isMinimized && (
            <div
              ref={terminalRef}
              className="p-4 flex-1 overflow-y-auto font-mono text-sm bg-black text-green-400 custom-scrollbar"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="space-y-6">
                {history.map((cmd, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-blue-400">nur@portfolio:~$</span>
                      <span className="text-white">{cmd.input}</span>
                      <span className="text-gray-500 text-xs ml-auto">{cmd.timestamp}</span>
                    </div>
                    <div className="ml-4 text-gray-200">
                      <TypedText
                        text={cmd.output.typed}
                        speed={10}
                        soundEnabled={soundEnabled}
                        onTypingComplete={() => handleTypingComplete(index)}
                      />
                      {cmd.isTypingComplete && cmd.output.rich && <div className="mt-4">{cmd.output.rich}</div>}
                    </div>
                  </motion.div>
                ))}

                {/* Current Input Line */}
                <div className="flex items-center gap-2 sticky bottom-0 bg-black py-2">
                  <span className="text-blue-400">nur@portfolio:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white"
                    placeholder="Type 'help' to get started..."
                    autoFocus
                  />
                  {isTyping && <span className="text-yellow-400 text-xs">typing...</span>}
                  <span className="animate-pulse text-white">|</span>
                </div>
              </div>
            </div>
          )}

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #1f2937;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #10b981;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #059669;
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
