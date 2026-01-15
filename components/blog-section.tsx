"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, Clock } from "lucide-react"

const blogPosts = [
  {
    title: "Goodbye Boilerplate: Why Zustand is the State Management You’ve Been Waiting For",
    date: "Dec 28, 2025",
    readTime: "2 min read",
    excerpt:
      "When you build a web application, communication between your app and the server is essential. When your web application or Node.js server wants to communicate with another server, Axios works as the medium.",
    image: "/database-schema-prisma-postgresql-dark-theme.jpg",
    tags: ["React", "State Management", "Zustand", "JavaScript"],
    link: "https://medium.com/@nurmhm/goodbye-boilerplate-why-zustand-is-the-state-management-youve-been-waiting-for-29bfdbd267d2",
  },
  {
    title: "Axios Explained: A Beginner-Friendly Guide to HTTP Requests in JavaScript .",
    date: "Sep 25, 2025",
    readTime: "5 min read",
    excerpt:
      "Implement secure authentication in your Next.js applications using JWT, sessions, and best security practices. Complete guide from frontend to backend.",
    image: "/authentication-security-login-dark-theme.jpg",
    tags: ["Web Development", "Website", "Data Fetching", "JavaScript"],
    link: "https://medium.com/@nurmhm/axios-explained-a-beginner-friendly-guide-to-http-requests-in-javascript-a281825d0fd7",
  },
  {
    title: "Unsupported color function “oklch” error in html2canvas within a Next.js project",
    date: "Jul 16, 2025",
    readTime: "3 min read",
    excerpt:
      "Recently, I was working on a feature in my Next.js project using jsPDF and html2canvas to download HTML as PDF. Everything was working fine until I clicked the download button and saw this error in the console: Uncaught (in promise) Error: Attempting to parse an unsupported color function oklch",
    image: "/erp-system-dashboard-enterprise-dark-theme.jpg",
    tags: ["Jspdf", "Html2canvas", "Next.js", "Tailwind CSS"],
    link: "https://medium.com/@nurmhm/unsupported-color-function-oklch-error-in-html2canvas-within-a-next-js-project-0d69037b8e85",
  },
]

export function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Latest Articles
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">Insights and tutorials on Web development</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all duration-300 h-full flex flex-col overflow-hidden">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                <CardHeader className="flex-shrink-0 pb-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-lg text-white leading-tight">{post.title}</CardTitle>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-0">
                  <p className="text-slate-300 text-sm mb-4">{post.excerpt}</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-amber-400 hover:text-amber-300 justify-start"
                    asChild
                  >
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
