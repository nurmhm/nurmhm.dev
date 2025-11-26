"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Nur delivered exceptional work on our E-commerce ERP system. His expertise in Next.js and Prisma helped us build a robust, scalable platform. Highly professional and communicative throughout the project.",
    name: "Mohammad Rahman",
    title: "CTO",
    company: "Trodad International",
    avatar: "/professional-man-portrait.png",
    rating: 5,
  },
  {
    quote:
      "Working with Nur on the RAJSEBA platform was a fantastic experience. He consistently delivered high-quality, pixel-perfect UIs and always went the extra mile to ensure optimal performance.",
    name: "Ahmed Hossain",
    title: "Project Manager",
    company: "Ankabut Software",
    avatar: "/professional-young-man.png",
    rating: 5,
  },
  {
    quote:
      "Nur's expertise in React and Web development is evident in every project he touches. His attention to detail and ability to solve complex problems makes him invaluable to any development team.",
    name: "Sarah Khan",
    title: "Senior Developer",
    company: "Tech Solutions BD",
    avatar: "/professional-woman-portrait.png",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            What Colleagues Say
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">Feedback from professionals I've collaborated with</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-700 hover:border-pink-500/50 transition-all duration-300 h-full flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <Quote className="w-8 h-8 text-pink-400 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-200 leading-relaxed mb-6">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                    />
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-300">
                        {testimonial.title}, {testimonial.company}
                      </p>
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
