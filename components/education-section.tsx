"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Calendar, MapPin, Award, BookOpen } from "lucide-react"

const education = [
  {
    degree: "Bachelor of Science in Computer Science & Engineering",
    institution: "Uttara University",
    location: "Dhaka, Bangladesh",
    period: "2024 – Present",
    status: "In Progress",
    description:
      "Currently pursuing advanced computer science concepts with focus on software engineering, algorithms, and modern web technologies.",
    subjects: [
      "Data Structures & Algorithms",
      "Software Engineering",
      "Database Management Systems",
      "Computer Networks",
      "Web Technologies",
      "Object-Oriented Programming",
    ],
    achievements: [
      "Active participation in coding competitions",
      "Member of university programming club",
      "Contributing to open-source projects",
    ],
  },
  {
    degree: "Diploma in Computer Technology",
    institution: "Jessore Polytechnic Institute",
    location: "Jessore, Bangladesh",
    period: "2019 – 2024",
    status: "Completed",
    cgpa: "3.66 out of 4.00",
    description:
      "Comprehensive study of computer systems, programming fundamentals, and practical application development.",
    subjects: [
      "Programming Fundamentals",
      "Computer Systems Architecture",
      "Database Design",
      "Web Development",
      "Software Testing",
      "Project Management",
    ],
    achievements: [
      "Graduated with distinction (CGPA: 3.66/4.00)",
      "Led multiple group projects successfully",
      "Received excellence award in web development",
      "Completed internship with outstanding performance",
    ],
  },
]

export function EducationSection() {
  return (
    <section id="education" className="py-20 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Education
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            My academic journey in computer science and technology
          </p>
        </motion.div>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                className={`bg-slate-900/50 border-2 transition-all duration-300 hover:shadow-2xl ${
                  edu.status === "In Progress"
                    ? "border-cyan-500/50 hover:border-cyan-400"
                    : "border-emerald-500/50 hover:border-emerald-400"
                }`}
              >
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          edu.status === "In Progress"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-2xl text-white leading-tight">{edu.degree}</CardTitle>
                        <div className="text-lg font-semibold text-amber-400">{edu.institution}</div>
                        <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{edu.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{edu.period}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <Badge
                        className={`${
                          edu.status === "In Progress"
                            ? "bg-cyan-600 hover:bg-cyan-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {edu.status}
                      </Badge>
                      {edu.cgpa && (
                        <div className="flex items-center gap-2 bg-amber-900/30 px-3 py-1 rounded-full">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-400 font-semibold">CGPA: {edu.cgpa}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-slate-200 leading-relaxed">{edu.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Key Subjects
                      </h4>
                      <div className="space-y-2">
                        {edu.subjects.map((subject, subIndex) => (
                          <motion.div
                            key={subject}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: subIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 text-slate-200"
                          >
                            <span className="text-cyan-400">•</span>
                            <span>{subject}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Achievements
                      </h4>
                      <div className="space-y-2">
                        {edu.achievements.map((achievement, achIndex) => (
                          <motion.div
                            key={achievement}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: achIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3 text-slate-200"
                          >
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>{achievement}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
