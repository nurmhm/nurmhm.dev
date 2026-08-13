"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Calendar,
  Check,
  CircleUserRound,
  Code2,
  Download,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Maximize2,
  MessageSquareQuote,
  Minimize2,
  Phone,
  Terminal,
  X,
} from "lucide-react"

import { TypedText } from "@/components/typed-text"
import type { PublicPortfolioProfile } from "@/lib/profile"

type CommandOutput = {
  typed: string
  rich?: React.ReactNode
}

type HistoryEntry = {
  input: string
  output: CommandOutput
  timestamp: string
  isTypingComplete: boolean
}

type CLITerminalProps = {
  isOpen: boolean
  onClose: () => void
  profile: PublicPortfolioProfile
}

type CommandHandler = (args: string[]) => CommandOutput

const commandDescriptions = [
  ["about", "Personal profile and availability"],
  ["skills [category]", "Technical skills, optionally filtered"],
  ["experience", "Professional work history"],
  ["projects [search]", "Projects, optionally filtered"],
  ["testimonials", "Professional recommendations"],
  ["blog", "Latest articles"],
  ["education", "Academic background"],
  ["contact", "Contact details and social links"],
  ["github | linkedin | medium", "Open a social profile"],
  ["resume", "Download the current resume"],
  ["clear", "Reset the terminal"],
] as const

const joinLines = (lines: Array<string | false | null | undefined>) => lines.filter(Boolean).join("\n")

const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "")

function EmptyState({ message }: { message: string }) {
  return <div className="border border-yellow-500/30 bg-yellow-950/20 p-3 text-yellow-200">{message}</div>
}

function TagList({ items, tone = "cyan" }: { items: string[]; tone?: "cyan" | "green" | "amber" | "violet" }) {
  const styles = {
    cyan: "border-cyan-500/30 bg-cyan-950/30 text-cyan-200",
    green: "border-emerald-500/30 bg-emerald-950/30 text-emerald-200",
    amber: "border-amber-500/30 bg-amber-950/30 text-amber-200",
    violet: "border-violet-500/30 bg-violet-950/30 text-violet-200",
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`border px-2 py-1 text-xs ${styles[tone]}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-base font-bold text-cyan-300">
      {icon}
      <span>{children}</span>
    </div>
  )
}

export function CLITerminal({ isOpen, onClose, profile }: CLITerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const welcomeMessage = useMemo<HistoryEntry>(
    () => ({
      input: "system_init",
      output: {
        typed: joinLines([
          `${profile.fullName.toUpperCase()} PORTFOLIO CLI`,
          `${profile.professionalTitle} | ${profile.location}`,
          profile.tagline,
          "",
          "System status: ONLINE",
          "Type 'help' to list available commands.",
        ]),
        rich: (
          <div className="space-y-4 border-l-2 border-emerald-500 pl-4">
            <div>
              <div className="text-lg font-bold text-emerald-300">{profile.fullName} Portfolio CLI</div>
              <div className="text-cyan-200">{profile.professionalTitle}</div>
            </div>
            <p className="max-w-3xl text-gray-300">{profile.tagline}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
              <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{profile.location}</span>
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" />System online</span>
            </div>
          </div>
        ),
      },
      timestamp: new Date().toLocaleTimeString(),
      isTypingComplete: true,
    }),
    [profile],
  )

  const commands = useMemo<Record<string, CommandHandler>>(() => {
    const help: CommandHandler = () => ({
      typed: joinLines([
        "AVAILABLE COMMANDS",
        ...commandDescriptions.map(([command, description]) => `${command.padEnd(28)} ${description}`),
        "",
        "Tip: use the up and down arrow keys to browse command history.",
      ]),
      rich: (
        <div className="space-y-3">
          <SectionTitle icon={<Terminal className="h-4 w-4" />}>Available commands</SectionTitle>
          <div className="grid gap-px overflow-hidden border border-gray-700 bg-gray-700 md:grid-cols-2">
            {commandDescriptions.map(([command, description]) => (
              <div key={command} className="bg-gray-950 p-3">
                <div className="text-amber-300">{command}</div>
                <div className="mt-1 text-xs text-gray-400">{description}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    })

    const about: CommandHandler = () => ({
      typed: joinLines([
        `Name: ${profile.fullName}`,
        `Role: ${profile.professionalTitle}`,
        `Location: ${profile.location}`,
        `Experience: ${profile.yearsExperience}`,
        `Current company: ${profile.currentCompany}`,
        "",
        profile.shortBio,
        ...profile.aboutParagraphs.map((paragraph) => `\n${paragraph}`),
      ]),
      rich: (
        <div className="space-y-4">
          <SectionTitle icon={<CircleUserRound className="h-4 w-4" />}>About {profile.fullName}</SectionTitle>
          <div className="grid gap-3 border border-gray-700 p-4 sm:grid-cols-2">
            <div><span className="text-gray-500">Role</span><div className="text-white">{profile.professionalTitle}</div></div>
            <div><span className="text-gray-500">Experience</span><div className="text-white">{profile.yearsExperience}</div></div>
            <div><span className="text-gray-500">Company</span><div className="text-white">{profile.currentCompany}</div></div>
            <div><span className="text-gray-500">Location</span><div className="text-white">{profile.location}</div></div>
          </div>
          <p className="max-w-4xl leading-relaxed text-gray-300">{profile.shortBio}</p>
          <TagList items={profile.traits} tone="green" />
        </div>
      ),
    })

    const skills: CommandHandler = (args) => {
      const query = args.join(" ").toLowerCase()
      const categories = query
        ? profile.skillCategories.filter((category) =>
            `${category.title} ${category.skills.join(" ")}`.toLowerCase().includes(query),
          )
        : profile.skillCategories

      return {
        typed: categories.length
          ? joinLines([
              profile.skillsHeading.toUpperCase(),
              ...categories.map((category) => `${category.title}: ${category.skills.join(", ")}`),
              `Soft skills: ${profile.softSkills.join(", ")}`,
              `Languages: ${profile.languages.map((language) => `${language.name} (${language.level})`).join(", ")}`,
            ])
          : `No skill category matched "${args.join(" ")}". Run 'skills' to show all categories.`,
        rich: categories.length ? (
          <div className="space-y-4">
            <SectionTitle icon={<Code2 className="h-4 w-4" />}>{profile.skillsHeading}</SectionTitle>
            <div className="grid gap-3 md:grid-cols-2">
              {categories.map((category) => (
                <div key={category.title} className="border border-cyan-500/20 p-4">
                  <div className="mb-3 font-semibold text-white">{category.title}</div>
                  <TagList items={category.skills} />
                </div>
              ))}
            </div>
            <div><div className="mb-2 text-sm text-gray-400">Soft skills</div><TagList items={profile.softSkills} tone="green" /></div>
          </div>
        ) : <EmptyState message={`No skill category matched "${args.join(" ")}".`} />,
      }
    }

    const experience: CommandHandler = () => ({
      typed: profile.experiences.length
        ? joinLines(profile.experiences.flatMap((item) => [
            `${item.title} at ${item.company} (${item.period})`,
            `${item.location} | ${item.employmentType}`,
            item.description,
            ...item.achievements.map((achievement) => `- ${achievement}`),
            `Technologies: ${item.technologies.join(", ")}`,
            "",
          ]))
        : "No work experience is currently published.",
      rich: profile.experiences.length ? (
        <div className="space-y-4">
          <SectionTitle icon={<BriefcaseBusiness className="h-4 w-4" />}>{profile.experienceHeading}</SectionTitle>
          {profile.experiences.map((item) => (
            <div key={`${item.company}-${item.title}-${item.period}`} className="border border-emerald-500/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><div className="font-bold text-white">{item.title}</div><div className="text-emerald-300">{item.company}</div></div>
                <span className="text-xs text-gray-400">{item.period}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">{item.location} | {item.employmentType}</div>
              <p className="my-3 text-gray-300">{item.description}</p>
              <ul className="mb-3 space-y-1 text-sm text-gray-300">{item.achievements.map((achievement) => <li key={achievement}>- {achievement}</li>)}</ul>
              <TagList items={item.technologies} tone="green" />
            </div>
          ))}
        </div>
      ) : <EmptyState message="No work experience is currently published." />,
    })

    const projects: CommandHandler = (args) => {
      const query = args.join(" ").toLowerCase()
      const matches = query
        ? profile.projects.filter((project) =>
            [project.title, project.subtitle, project.category, project.description, ...project.technologies]
              .join(" ")
              .toLowerCase()
              .includes(query),
          )
        : profile.projects

      return {
        typed: matches.length
          ? joinLines(matches.flatMap((project) => [
              `${project.title} [${project.status}]`,
              project.description,
              `Technologies: ${project.technologies.join(", ")}`,
              project.liveUrl && `Live: ${project.liveUrl}`,
              project.githubUrl && `Source: ${project.githubUrl}`,
              "",
            ]))
          : `No project matched "${args.join(" ")}". Run 'projects' to show all projects.`,
        rich: matches.length ? (
          <div className="space-y-4">
            <SectionTitle icon={<Code2 className="h-4 w-4" />}>{profile.projectsHeading}</SectionTitle>
            {matches.map((project) => (
              <div key={`${project.title}-${project.category}`} className="border border-amber-500/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div><div className="font-bold text-white">{project.title}</div><div className="text-sm text-amber-300">{project.subtitle}</div></div>
                  <span className="border border-amber-500/30 px-2 py-1 text-xs text-amber-200">{project.status}</span>
                </div>
                <p className="my-3 text-gray-300">{project.description}</p>
                <TagList items={project.technologies} tone="amber" />
                {(project.liveUrl || project.githubUrl) && (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    {project.liveUrl && <a className="flex items-center gap-1 text-cyan-300 hover:underline" href={project.liveUrl} target="_blank" rel="noreferrer">Live <ExternalLink className="h-3.5 w-3.5" /></a>}
                    {project.githubUrl && <a className="flex items-center gap-1 text-cyan-300 hover:underline" href={project.githubUrl} target="_blank" rel="noreferrer">Source <ExternalLink className="h-3.5 w-3.5" /></a>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : <EmptyState message={`No project matched "${args.join(" ")}".`} />,
      }
    }

    const testimonials: CommandHandler = () => ({
      typed: profile.testimonials.length
        ? joinLines(profile.testimonials.flatMap((item) => [`${item.name}, ${item.title} at ${item.company}`, `"${item.quote}"`, `Rating: ${item.rating}/5`, ""]))
        : "No testimonials are currently published.",
      rich: profile.testimonials.length ? (
        <div className="space-y-4">
          <SectionTitle icon={<MessageSquareQuote className="h-4 w-4" />}>{profile.testimonialsHeading}</SectionTitle>
          {profile.testimonials.map((item) => (
            <blockquote key={`${item.name}-${item.company}`} className="border-l-2 border-violet-500 bg-violet-950/10 p-4">
              <p className="text-gray-200">"{item.quote}"</p>
              <footer className="mt-3 text-sm"><span className="text-white">{item.name}</span><span className="text-gray-500"> | {item.title}, {item.company} | {item.rating}/5</span></footer>
            </blockquote>
          ))}
        </div>
      ) : <EmptyState message="No testimonials are currently published." />,
    })

    const blog: CommandHandler = () => ({
      typed: profile.blogPosts.length
        ? joinLines(profile.blogPosts.flatMap((post) => [`${post.title} (${post.date}, ${post.readTime})`, post.excerpt, post.link, ""]))
        : "No articles are currently published.",
      rich: profile.blogPosts.length ? (
        <div className="space-y-4">
          <SectionTitle icon={<Calendar className="h-4 w-4" />}>{profile.blogHeading}</SectionTitle>
          {profile.blogPosts.map((post) => (
            <article key={`${post.title}-${post.date}`} className="border border-orange-500/20 p-4">
              <a href={post.link} target="_blank" rel="noreferrer" className="font-bold text-white hover:text-orange-300">{post.title}</a>
              <div className="mt-1 text-xs text-gray-500">{post.date} | {post.readTime}</div>
              <p className="my-3 text-gray-300">{post.excerpt}</p>
              <TagList items={post.tags} tone="amber" />
            </article>
          ))}
        </div>
      ) : <EmptyState message="No articles are currently published." />,
    })

    const education: CommandHandler = () => ({
      typed: profile.education.length
        ? joinLines(profile.education.flatMap((item) => [
            `${item.degree} at ${item.institution} (${item.period})`,
            `${item.location} | ${item.status}${item.cgpa ? ` | CGPA: ${item.cgpa}` : ""}`,
            item.description,
            ...item.achievements.map((achievement) => `- ${achievement}`),
            "",
          ]))
        : "No education entries are currently published.",
      rich: profile.education.length ? (
        <div className="space-y-4">
          <SectionTitle icon={<GraduationCap className="h-4 w-4" />}>{profile.educationHeading}</SectionTitle>
          {profile.education.map((item) => (
            <div key={`${item.degree}-${item.institution}`} className="border border-blue-500/20 p-4">
              <div className="flex flex-wrap justify-between gap-2"><div><div className="font-bold text-white">{item.degree}</div><div className="text-blue-300">{item.institution}</div></div><span className="text-xs text-gray-400">{item.period}</span></div>
              <div className="mt-1 text-xs text-gray-500">{item.location} | {item.status}{item.cgpa ? ` | CGPA: ${item.cgpa}` : ""}</div>
              <p className="my-3 text-gray-300">{item.description}</p>
              <TagList items={item.subjects} tone="violet" />
            </div>
          ))}
        </div>
      ) : <EmptyState message="No education entries are currently published." />,
    })

    const contact: CommandHandler = () => ({
      typed: joinLines([
        `Email: ${profile.email}`,
        `Phone: ${profile.phone}`,
        `Location: ${profile.location}`,
        `GitHub: ${profile.githubUrl}`,
        `LinkedIn: ${profile.linkedinUrl}`,
        `Medium: ${profile.mediumUrl}`,
        `Freelance: ${profile.availableForFreelance ? "Available" : "Unavailable"}`,
        `Full-time: ${profile.openToFullTime ? "Open to opportunities" : "Not currently open"}`,
        `Response time: ${profile.responseTime}`,
      ]),
      rich: (
        <div className="space-y-4">
          <SectionTitle icon={<Mail className="h-4 w-4" />}>Contact information</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 border border-gray-700 p-3 hover:border-cyan-500"><Mail className="h-4 w-4 text-cyan-300" /><span>{profile.email}</span></a>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 border border-gray-700 p-3 hover:border-emerald-500"><Phone className="h-4 w-4 text-emerald-300" /><span>{profile.phone}</span></a>
            <div className="flex items-center gap-3 border border-gray-700 p-3"><MapPin className="h-4 w-4 text-violet-300" /><span>{profile.location}</span></div>
            <div className="flex items-center gap-3 border border-gray-700 p-3"><Check className="h-4 w-4 text-emerald-300" /><span>Response: {profile.responseTime}</span></div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {[["GitHub", profile.githubUrl], ["LinkedIn", profile.linkedinUrl], ["Medium", profile.mediumUrl]].map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-cyan-300 hover:underline">{label}<ArrowUpRight className="h-3.5 w-3.5" /></a>
            ))}
          </div>
        </div>
      ),
    })

    const externalLink = (label: string, url: string): CommandOutput => ({
      typed: url ? `Opening ${label}: ${url}` : `${label} URL is not configured.`,
      rich: url ? (
        <div className="flex items-center gap-3 border border-cyan-500/30 p-4">
          <ExternalLink className="h-5 w-5 text-cyan-300" />
          <div><div className="text-white">Opening {label}</div><a href={url} target="_blank" rel="noreferrer" className="text-sm text-cyan-300 hover:underline">{displayUrl(url)}</a></div>
        </div>
      ) : <EmptyState message={`${label} URL is not configured.`} />,
    })

    const resume: CommandHandler = () => ({
      typed: profile.resumeUrl ? `Downloading resume: ${profile.resumeUrl}` : "Resume URL is not configured.",
      rich: profile.resumeUrl ? (
        <div className="flex items-center gap-3 border border-emerald-500/30 p-4">
          <Download className="h-5 w-5 text-emerald-300" />
          <div><div className="text-white">Resume download started</div><a href={profile.resumeUrl} download className="text-sm text-emerald-300 hover:underline">Download again</a></div>
        </div>
      ) : <EmptyState message="Resume URL is not configured." />,
    })

    return {
      help,
      about,
      whoami: about,
      skills,
      experience,
      projects,
      testimonials,
      blog,
      education,
      contact,
      github: () => externalLink("GitHub", profile.githubUrl),
      linkedin: () => externalLink("LinkedIn", profile.linkedinUrl),
      medium: () => externalLink("Medium", profile.mediumUrl),
      resume,
      cv: resume,
    }
  }, [profile])

  const focusInput = useCallback(() => window.setTimeout(() => inputRef.current?.focus(), 0), [])

  useEffect(() => {
    if (!isOpen) return
    setHistory([welcomeMessage])
    setCommandHistory([])
    setHistoryIndex(-1)
    setInput("")
    setIsTyping(false)
    focusInput()
  }, [focusInput, isOpen, welcomeMessage])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [history, isTyping])

  const handleTypingComplete = useCallback((index: number) => {
    setHistory((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, isTypingComplete: true } : entry))
    setIsTyping(false)
    focusInput()
  }, [focusInput])

  const executeCommand = useCallback((rawCommand: string) => {
    const trimmedCommand = rawCommand.trim()
    if (!trimmedCommand || isTyping) return

    const [commandName, ...args] = trimmedCommand.split(/\s+/)
    const command = commandName.toLowerCase()

    if (command === "clear") {
      setHistory([welcomeMessage])
      setInput("")
      setHistoryIndex(-1)
      return
    }

    const handler = commands[command]
    const output = handler
      ? handler(args)
      : {
          typed: `Command not found: ${commandName}\nRun 'help' to list available commands.`,
          rich: <EmptyState message={`Command not found: ${commandName}. Run 'help' to list available commands.`} />,
        }

    if (command === "github" && profile.githubUrl) window.open(profile.githubUrl, "_blank", "noopener,noreferrer")
    if (command === "linkedin" && profile.linkedinUrl) window.open(profile.linkedinUrl, "_blank", "noopener,noreferrer")
    if (command === "medium" && profile.mediumUrl) window.open(profile.mediumUrl, "_blank", "noopener,noreferrer")
    if ((command === "resume" || command === "cv") && profile.resumeUrl) {
      const link = document.createElement("a")
      link.href = profile.resumeUrl
      link.download = `${profile.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
    }

    setHistory((current) => [...current, {
      input: trimmedCommand,
      output,
      timestamp: new Date().toLocaleTimeString(),
      isTypingComplete: false,
    }])
    setCommandHistory((current) => [...current, trimmedCommand])
    setHistoryIndex(-1)
    setInput("")
    setIsTyping(true)
  }, [commands, isTyping, profile, welcomeMessage])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      executeCommand(input)
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1
        setHistoryIndex(nextIndex)
        setInput(commandHistory[commandHistory.length - 1 - nextIndex])
      }
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1
        setHistoryIndex(nextIndex)
        setInput(commandHistory[commandHistory.length - 1 - nextIndex])
      } else {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={`${profile.fullName} portfolio terminal`}
        onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          className={`flex w-full max-w-6xl flex-col overflow-hidden border border-gray-700 bg-black shadow-2xl ${isMinimized ? "h-12" : "h-[min(820px,90vh)]"}`}
        >
          <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-gray-700 bg-gray-900 px-3 sm:px-4">
            <div className="flex gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="flex min-w-0 items-center gap-2 text-gray-200">
              <Terminal className="h-4 w-4 flex-shrink-0" />
              <span className="truncate font-mono text-xs sm:text-sm">{profile.fullName.toLowerCase().replace(/\s+/g, "-")}@portfolio:~$</span>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setIsMinimized((value) => !value)} className="p-2 text-gray-400 hover:text-white" title={isMinimized ? "Maximize" : "Minimize"} aria-label={isMinimized ? "Maximize terminal" : "Minimize terminal"}>
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-red-400" title="Close" aria-label="Close terminal"><X className="h-4 w-4" /></button>
            </div>
          </div>

          {!isMinimized && (
            <div ref={terminalRef} className="flex-1 overflow-y-auto bg-black p-3 font-mono text-sm text-green-400 sm:p-4" onClick={focusInput}>
              <div className="space-y-6">
                {history.map((entry, index) => (
                  <motion.div key={`${entry.timestamp}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-blue-400">portfolio:~$</span>
                      <span className="break-all text-white">{entry.input}</span>
                      <span className="ml-auto text-xs text-gray-600">{entry.timestamp}</span>
                    </div>
                    <div className="ml-0 overflow-hidden text-gray-200 sm:ml-4">
                      <TypedText text={entry.output.typed} speed={4} soundEnabled={false} onTypingComplete={() => handleTypingComplete(index)} />
                      {entry.isTypingComplete && entry.output.rich && <div className="mt-4">{entry.output.rich}</div>}
                    </div>
                  </motion.div>
                ))}

                <div className="sticky bottom-0 flex items-center gap-2 border-t border-gray-900 bg-black py-3">
                  <span className="flex-shrink-0 text-blue-400">portfolio:~$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                    className="min-w-0 flex-1 border-none bg-transparent text-white outline-none disabled:cursor-wait"
                    placeholder={isTyping ? "Rendering output..." : "Type 'help' for commands"}
                    aria-label="Terminal command"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <span className="animate-pulse text-white">_</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}