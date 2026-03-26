import { createFileRoute } from '@tanstack/react-router'
import { allProjects } from 'content-collections'
import { useState, useEffect, useRef, type ReactNode } from 'react'
import { ExternalLink, Github, Mail, Send, Download, MessageCircle, ChevronDown } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Portfolio,
})

// Default portfolio data
const DEFAULT_ABOUT = {
  name: 'Farrukhbey',
  title: 'Full-Stack Developer',
  subtitle: 'Building modern web experiences with passion and precision',
  bio: `I'm a passionate full-stack developer with expertise in modern web technologies. I love crafting elegant solutions to complex problems and turning ideas into impactful digital products.\n\nWith a strong foundation in React, TypeScript, and Node.js, I build scalable applications that deliver exceptional user experiences. Always learning, always improving.`,
  imageUrl: '/headshot-on-white.jpg',
}

const DEFAULT_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'TanStack', 'Tailwind CSS',
  'Firebase', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs', 'Git',
  'Docker', 'AWS', 'Vite', 'JavaScript', 'Python', 'Figma',
]

const DEFAULT_CONTACT = {
  email: 'hello@farrukhbey.uz',
  telegram: '@farrukhbey',
  cvUrl: '',
}

type Project = {
  id?: string
  title: string
  description: string
  image?: string
  tags: string[]
  github?: string
  liveUrl?: string
}

type AboutData = typeof DEFAULT_ABOUT
type ContactData = typeof DEFAULT_CONTACT

// Scroll reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function RevealSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function Portfolio() {
  const [about] = useState<AboutData>(DEFAULT_ABOUT)
  const [skills] = useState<string[]>(DEFAULT_SKILLS)
  const [contact] = useState<ContactData>(DEFAULT_CONTACT)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [formSent, setFormSent] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Use content collections projects as default, merged with any Firestore projects
  const projects: Project[] = allProjects.map((p) => ({
    id: p._meta.path,
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags,
    github: p.github,
    liveUrl: p.liveUrl,
  }))

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      const formData = new FormData()
      formData.append('form-name', 'contact')
      formData.append('name', contactForm.name)
      formData.append('email', contactForm.email)
      formData.append('message', contactForm.message)
      await fetch('/contact.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      })
      setFormSent(true)
      setContactForm({ name: '', email: '', message: '' })
    } catch {
      // silently handle
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <main className="pt-16">
      {/* Hero */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Background decorations */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            {/* Text content */}
            <div className="flex-1 text-center md:text-left">
              <div
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
                style={{
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  color: '#c4b5fd',
                  opacity: 1,
                  animation: 'none',
                }}
              >
                👋 Available for new projects
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                <span style={{ color: '#f0f0ff' }}>Hi, I'm </span>
                <span className="gradient-text">{about.name}</span>
              </h1>

              <h2
                className="text-xl sm:text-2xl font-medium mb-6"
                style={{ color: 'rgba(196,181,253,0.9)' }}
              >
                {about.title}
              </h2>

              <p
                className="text-lg leading-relaxed mb-10 max-w-xl mx-auto md:mx-0"
                style={{ color: 'rgba(156,163,175,0.9)' }}
              >
                {about.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a
                  href="/#projects"
                  className="btn-gradient px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2"
                >
                  View Projects
                  <ChevronDown size={16} />
                </a>
                <a
                  href="/#contact"
                  className="px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2"
                  style={{
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#f0f0ff',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  }}
                >
                  <Mail size={16} />
                  Contact Me
                </a>
                {contact.cvUrl && (
                  <a
                    href={contact.cvUrl}
                    download
                    className="px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2"
                    style={{
                      border: '1px solid rgba(139,92,246,0.4)',
                      color: '#c4b5fd',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Download size={16} />
                    Download CV
                  </a>
                )}
              </div>
            </div>

            {/* Profile image */}
            <div className="relative flex-shrink-0">
              <div
                className="w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden float"
                style={{
                  border: '3px solid rgba(139,92,246,0.4)',
                  boxShadow: '0 0 40px rgba(139,92,246,0.25), 0 0 80px rgba(139,92,246,0.1)',
                  background: 'rgba(139,92,246,0.05)',
                }}
              >
                <img
                  src={about.imageUrl}
                  alt={about.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: '1px solid rgba(139,92,246,0.2)',
                  transform: 'scale(1.15)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          style={{ color: 'rgba(156,163,175,0.5)', animation: 'float 2s ease-in-out infinite' }}
        >
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider" />

      {/* About */}
      <section id="about" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold gradient-text inline-block mb-4">About Me</h2>
              <p style={{ color: 'rgba(156,163,175,0.8)' }}>Get to know me better</p>
            </div>
          </RevealSection>

          <RevealSection delay={150}>
            <div
              className="glass-strong p-8 sm:p-12 max-w-4xl mx-auto"
              style={{ borderRadius: '1.5rem' }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  {about.bio.split('\n\n').map((paragraph, i) => (
                    <p
                      key={i}
                      className="leading-relaxed mb-6 last:mb-0 text-lg"
                      style={{ color: 'rgba(209,213,219,0.9)' }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div
                  className="flex-shrink-0 w-40 h-40 rounded-2xl overflow-hidden hidden md:block"
                  style={{
                    border: '2px solid rgba(139,92,246,0.3)',
                    boxShadow: '0 0 20px rgba(139,92,246,0.15)',
                  }}
                >
                  <img
                    src={about.imageUrl}
                    alt={about.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Quick stats */}
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-10"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
              >
                {[
                  { label: 'Years of Exp.', value: '3+' },
                  { label: 'Projects Built', value: `${projects.length}+` },
                  { label: 'Technologies', value: `${skills.length}+` },
                  { label: 'Happy Clients', value: '20+' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm mt-1" style={{ color: 'rgba(156,163,175,0.7)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="section-divider" />

      {/* Skills */}
      <section id="skills" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold gradient-text inline-block mb-4">Skills</h2>
              <p style={{ color: 'rgba(156,163,175,0.8)' }}>Technologies I work with</p>
            </div>
          </RevealSection>

          <RevealSection delay={150}>
            <div className="glass-strong p-8 sm:p-10 max-w-4xl mx-auto" style={{ borderRadius: '1.5rem' }}>
              <div className="flex flex-wrap gap-3 justify-center">
                {skills.map((skill, i) => (
                  <span
                    key={skill}
                    className="skill-tag"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="section-divider" />

      {/* Projects */}
      <section id="projects" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold gradient-text inline-block mb-4">Projects</h2>
              <p style={{ color: 'rgba(156,163,175,0.8)' }}>Things I've built</p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <RevealSection key={project.id ?? project.title} delay={i * 100}>
                <ProjectCard project={project} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold gradient-text inline-block mb-4">Contact</h2>
              <p style={{ color: 'rgba(156,163,175,0.8)' }}>Let's work together</p>
            </div>
          </RevealSection>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact info */}
            <RevealSection delay={100}>
              <div className="glass-strong p-8" style={{ borderRadius: '1.5rem', height: '100%' }}>
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#f0f0ff' }}>
                  Get In Touch
                </h3>
                <div className="space-y-5">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-4 group"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(139,92,246,0.15)',
                          border: '1px solid rgba(139,92,246,0.3)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Mail size={20} style={{ color: '#c4b5fd' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(156,163,175,0.7)' }}>
                          Email
                        </p>
                        <p
                          className="font-medium group-hover:underline"
                          style={{ color: '#f0f0ff' }}
                        >
                          {contact.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {contact.telegram && (
                    <a
                      href={`https://t.me/${contact.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 group"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(6,182,212,0.15)',
                          border: '1px solid rgba(6,182,212,0.3)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <MessageCircle size={20} style={{ color: '#67e8f9' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(156,163,175,0.7)' }}>
                          Telegram
                        </p>
                        <p
                          className="font-medium group-hover:underline"
                          style={{ color: '#f0f0ff' }}
                        >
                          {contact.telegram}
                        </p>
                      </div>
                    </a>
                  )}

                  {contact.cvUrl && (
                    <a
                      href={contact.cvUrl}
                      download
                      className="flex items-center gap-4 group"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(251,191,36,0.12)',
                          border: '1px solid rgba(251,191,36,0.25)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Download size={20} style={{ color: '#fcd34d' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(156,163,175,0.7)' }}>
                          Resume
                        </p>
                        <p
                          className="font-medium group-hover:underline"
                          style={{ color: '#f0f0ff' }}
                        >
                          Download CV
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </RevealSection>

            {/* Contact form */}
            <RevealSection delay={200}>
              <div className="glass-strong p-8" style={{ borderRadius: '1.5rem' }}>
                {formSent ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'rgba(139,92,246,0.2)', border: '2px solid rgba(139,92,246,0.4)' }}
                    >
                      <Send size={24} style={{ color: '#c4b5fd' }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#f0f0ff' }}>
                      Message Sent!
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'rgba(156,163,175,0.8)' }}>
                      Thanks for reaching out. I'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setFormSent(false)}
                      className="btn-gradient px-6 py-2 rounded-full text-sm font-medium"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    onSubmit={handleContactSubmit}
                    className="space-y-4"
                  >
                    <input type="hidden" name="form-name" value="contact" />
                    <h3 className="text-xl font-semibold mb-6" style={{ color: '#f0f0ff' }}>
                      Send a Message
                    </h3>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: 'rgba(196,181,253,0.9)' }}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="dark-input"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: 'rgba(196,181,253,0.9)' }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="dark-input"
                        placeholder="your@email.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: 'rgba(196,181,253,0.9)' }}
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        className="dark-input"
                        placeholder="Your message..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="btn-gradient w-full py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formLoading ? 'Sending...' : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </main>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="glass h-full flex flex-col group"
      style={{
        borderRadius: '1.25rem',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(139,92,246,0.15)'
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
      }}
    >
      {/* Project image */}
      {project.image ? (
        <div className="h-44 overflow-hidden" style={{ borderRadius: '1.25rem 1.25rem 0 0' }}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{ transition: 'transform 0.4s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      ) : (
        <div
          className="h-44 flex items-center justify-center"
          style={{
            borderRadius: '1.25rem 1.25rem 0 0',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span className="text-5xl">💻</span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#f0f0ff' }}>
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'rgba(156,163,175,0.85)' }}>
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.25)',
                color: '#c4b5fd',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm"
              style={{ color: 'rgba(196,181,253,0.8)', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#c4b5fd')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(196,181,253,0.8)')}
            >
              <Github size={15} />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm"
              style={{ color: 'rgba(103,232,249,0.8)', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#67e8f9')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(103,232,249,0.8)')}
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
