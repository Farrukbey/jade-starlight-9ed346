import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  LogOut, LayoutDashboard, User, Zap, FolderOpen, Mail, FileText,
  Plus, Trash2, Edit2, Save, X, Eye, EyeOff,
} from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminPanel,
})

type PortfolioData = {
  about: {
    name: string
    title: string
    subtitle: string
    bio: string
    imageUrl: string
  }
  skills: string[]
  contact: {
    email: string
    telegram: string
    cvUrl: string
  }
  projects: Array<{
    id: string
    title: string
    description: string
    image: string
    tags: string[]
    github: string
    liveUrl: string
  }>
}

const DEFAULT_DATA: PortfolioData = {
  about: {
    name: 'Farrukhbey',
    title: 'Full-Stack Developer',
    subtitle: 'Building modern web experiences with passion and precision',
    bio: "I'm a passionate full-stack developer with expertise in modern web technologies. I love crafting elegant solutions to complex problems and turning ideas into impactful digital products.\n\nWith a strong foundation in React, TypeScript, and Node.js, I build scalable applications that deliver exceptional user experiences. Always learning, always improving.",
    imageUrl: '/headshot-on-white.jpg',
  },
  skills: [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'TanStack', 'Tailwind CSS',
    'Firebase', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs', 'Git',
    'Docker', 'AWS', 'Vite', 'JavaScript', 'Python', 'Figma',
  ],
  contact: {
    email: 'hello@farrukhbey.uz',
    telegram: '@farrukhbey',
    cvUrl: '',
  },
  projects: [],
}

const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME ?? 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD ?? 'portfolio2024',
}

const STORAGE_KEY = 'portfolio_data'
const SESSION_KEY = 'admin_session'

function loadData(): PortfolioData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_DATA, ...JSON.parse(stored) }
  } catch {
    // ignore
  }
  return DEFAULT_DATA
}

function saveData(data: PortfolioData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

type Tab = 'overview' | 'about' | 'skills' | 'projects' | 'contact'

function AdminPanel() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session === 'true') {
      setIsLoggedIn(true)
      setData(loadData())
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setIsLoggedIn(true)
      setData(loadData())
      setLoginError('')
    } else {
      setLoginError('Invalid username or password')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsLoggedIn(false)
    navigate({ to: '/' })
  }

  const handleSave = (newData: PortfolioData) => {
    setData(newData)
    setSaveStatus('saving')
    saveData(newData)
    setTimeout(() => setSaveStatus('saved'), 500)
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  if (!isLoggedIn) {
    return <LoginPage
      form={loginForm}
      error={loginError}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onChange={(field, val) => setLoginForm((f) => ({ ...f, [field]: val }))}
      onSubmit={handleLogin}
    />
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'about', label: 'About', icon: <User size={16} /> },
    { id: 'skills', label: 'Skills', icon: <Zap size={16} /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={16} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={16} /> },
  ]

  return (
    <div className="min-h-screen" style={{ paddingTop: '4rem' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
            <p style={{ color: 'rgba(156,163,175,0.7)', fontSize: '0.875rem' }}>
              Manage your portfolio content
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saved' && (
              <span
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#4ade80',
                }}
              >
                ✓ Saved
              </span>
            )}
            <a
              href="/"
              className="text-sm px-4 py-2 rounded-lg"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(209,213,219,0.8)',
                transition: 'all 0.2s',
              }}
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg"
              style={{
                border: '1px solid rgba(239,68,68,0.3)',
                color: 'rgba(252,165,165,0.9)',
                background: 'rgba(239,68,68,0.08)',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div
          className="flex gap-1 p-1 mb-8 rounded-xl overflow-x-auto"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
              style={
                activeTab === tab.id
                  ? {
                      background: 'rgba(139,92,246,0.2)',
                      border: '1px solid rgba(139,92,246,0.4)',
                      color: '#c4b5fd',
                    }
                  : {
                      color: 'rgba(156,163,175,0.8)',
                      border: '1px solid transparent',
                    }
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'overview' && <OverviewTab data={data} />}
          {activeTab === 'about' && <AboutTab data={data} onSave={handleSave} />}
          {activeTab === 'skills' && <SkillsTab data={data} onSave={handleSave} />}
          {activeTab === 'projects' && <ProjectsTab data={data} onSave={handleSave} />}
          {activeTab === 'contact' && <ContactTab data={data} onSave={handleSave} />}
        </div>
      </div>
    </div>
  )
}

// ----- Login Page -----
function LoginPage({
  form,
  error,
  showPassword,
  onTogglePassword,
  onChange,
  onSubmit,
}: {
  form: { username: string; password: string }
  error: string
  showPassword: boolean
  onTogglePassword: () => void
  onChange: (field: string, val: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))',
              border: '2px solid rgba(139,92,246,0.4)',
            }}
          >
            <LayoutDashboard size={28} style={{ color: '#c4b5fd' }} />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Admin Login</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(156,163,175,0.7)' }}>
            Access your portfolio dashboard
          </p>
        </div>

        <form onSubmit={onSubmit} className="glass-strong p-8 space-y-5" style={{ borderRadius: '1.5rem' }}>
          {error && (
            <div
              className="text-sm px-4 py-3 rounded-lg"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.9)' }}>
              Username
            </label>
            <input
              type="text"
              className="dark-input"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => onChange('username', e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.9)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="dark-input pr-10"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => onChange('password', e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'rgba(156,163,175,0.6)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-gradient w-full py-3 rounded-xl font-semibold"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

// ----- Overview Tab -----
function OverviewTab({ data }: { data: PortfolioData }) {
  const stats = [
    { label: 'Projects', value: data.projects.length, icon: <FolderOpen size={20} />, color: 'rgba(139,92,246,0.2)', border: 'rgba(139,92,246,0.4)', text: '#c4b5fd' },
    { label: 'Skills', value: data.skills.length, icon: <Zap size={20} />, color: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.35)', text: '#67e8f9' },
    { label: 'Contact', value: data.contact.email ? 1 : 0, icon: <Mail size={20} />, color: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', text: '#fcd34d' },
    { label: 'CV', value: data.contact.cvUrl ? '✓' : '✗', icon: <FileText size={20} />, color: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', text: '#4ade80' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-strong p-6 text-center"
            style={{ borderRadius: '1rem' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: stat.color, border: `1px solid ${stat.border}`, color: stat.text }}
            >
              {stat.icon}
            </div>
            <div className="text-3xl font-bold" style={{ color: stat.text }}>
              {stat.value}
            </div>
            <div className="text-sm mt-1" style={{ color: 'rgba(156,163,175,0.7)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-strong p-6" style={{ borderRadius: '1rem' }}>
        <h3 className="font-semibold mb-2" style={{ color: '#f0f0ff' }}>Quick Note</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(156,163,175,0.8)' }}>
          Changes made here are saved to your browser's local storage. To connect with Firebase Firestore
          for persistent cloud storage, set the <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd' }}>VITE_FIREBASE_*</code> environment
          variables in your Netlify project settings.
        </p>
      </div>
    </div>
  )
}

// ----- About Tab -----
function AboutTab({ data, onSave }: { data: PortfolioData; onSave: (d: PortfolioData) => void }) {
  const [form, setForm] = useState(data.about)

  const handleSave = () => {
    onSave({ ...data, about: form })
  }

  return (
    <div className="glass-strong p-8" style={{ borderRadius: '1.5rem' }}>
      <h2 className="text-xl font-semibold mb-6" style={{ color: '#f0f0ff' }}>Edit About</h2>
      <div className="space-y-5 max-w-2xl">
        {[
          { label: 'Full Name', field: 'name' as const, type: 'text', placeholder: 'Your name' },
          { label: 'Title', field: 'title' as const, type: 'text', placeholder: 'e.g. Full-Stack Developer' },
          { label: 'Subtitle', field: 'subtitle' as const, type: 'text', placeholder: 'Short tagline' },
          { label: 'Profile Image URL', field: 'imageUrl' as const, type: 'text', placeholder: 'https://...' },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.9)' }}>
              {label}
            </label>
            <input
              type={type}
              className="dark-input"
              placeholder={placeholder}
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.9)' }}>
            Bio (use double newline for paragraphs)
          </label>
          <textarea
            rows={6}
            className="dark-input"
            placeholder="Tell visitors about yourself..."
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          />
        </div>
        <button onClick={handleSave} className="btn-gradient px-6 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  )
}

// ----- Skills Tab -----
function SkillsTab({ data, onSave }: { data: PortfolioData; onSave: (d: PortfolioData) => void }) {
  const [skills, setSkills] = useState(data.skills)
  const [newSkill, setNewSkill] = useState('')

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skills.includes(s)) {
      const updated = [...skills, s]
      setSkills(updated)
      onSave({ ...data, skills: updated })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill)
    setSkills(updated)
    onSave({ ...data, skills: updated })
  }

  return (
    <div className="glass-strong p-8" style={{ borderRadius: '1.5rem' }}>
      <h2 className="text-xl font-semibold mb-6" style={{ color: '#f0f0ff' }}>Manage Skills</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="dark-input flex-1"
          placeholder="Add a skill (e.g. React)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
        />
        <button
          onClick={addSkill}
          className="btn-gradient px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#c4b5fd',
            }}
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="hover:opacity-70 transition-opacity"
              aria-label={`Remove ${skill}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

// ----- Projects Tab -----
function ProjectsTab({ data, onSave }: { data: PortfolioData; onSave: (d: PortfolioData) => void }) {
  type ProjectForm = (typeof data.projects)[0]
  const [projects, setProjects] = useState(data.projects)
  const [editing, setEditing] = useState<ProjectForm | null>(null)
  const [isNew, setIsNew] = useState(false)

  const emptyProject: ProjectForm = {
    id: Date.now().toString(),
    title: '',
    description: '',
    image: '',
    tags: [],
    github: '',
    liveUrl: '',
  }

  const saveProjects = (updated: ProjectForm[]) => {
    setProjects(updated)
    onSave({ ...data, projects: updated })
  }

  const handleDelete = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id))
  }

  const handleEdit = (project: ProjectForm) => {
    setEditing({ ...project })
    setIsNew(false)
  }

  const handleNew = () => {
    setEditing({ ...emptyProject, id: Date.now().toString() })
    setIsNew(true)
  }

  const handleSaveProject = () => {
    if (!editing) return
    let updated: ProjectForm[]
    if (isNew) {
      updated = [...projects, editing]
    } else {
      updated = projects.map((p) => (p.id === editing.id ? editing : p))
    }
    saveProjects(updated)
    setEditing(null)
  }

  if (editing) {
    return (
      <div className="glass-strong p-8" style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: '#f0f0ff' }}>
            {isNew ? 'Add Project' : 'Edit Project'}
          </h2>
          <button onClick={() => setEditing(null)} style={{ color: 'rgba(156,163,175,0.7)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 max-w-2xl">
          {[
            { label: 'Title', field: 'title' as const, placeholder: 'Project title' },
            { label: 'Image URL', field: 'image' as const, placeholder: 'https://...' },
            { label: 'GitHub URL', field: 'github' as const, placeholder: 'https://github.com/...' },
            { label: 'Live URL', field: 'liveUrl' as const, placeholder: 'https://...' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.9)' }}>
                {label}
              </label>
              <input
                type="text"
                className="dark-input"
                placeholder={placeholder}
                value={editing[field] as string}
                onChange={(e) => setEditing((f) => f ? { ...f, [field]: e.target.value } : f)}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.9)' }}>
              Description
            </label>
            <textarea
              rows={3}
              className="dark-input"
              placeholder="Project description..."
              value={editing.description}
              onChange={(e) => setEditing((f) => f ? { ...f, description: e.target.value } : f)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.9)' }}>
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              className="dark-input"
              placeholder="React, TypeScript, Firebase"
              value={editing.tags.join(', ')}
              onChange={(e) =>
                setEditing((f) =>
                  f ? { ...f, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) } : f
                )
              }
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSaveProject} className="btn-gradient px-6 py-2.5 rounded-xl font-medium flex items-center gap-2">
              <Save size={16} />
              Save Project
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-6 py-2.5 rounded-xl font-medium"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(209,213,219,0.8)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold" style={{ color: '#f0f0ff' }}>Projects</h2>
        <button onClick={handleNew} className="btn-gradient px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 text-sm">
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div
          className="glass text-center py-16"
          style={{ borderRadius: '1.25rem', color: 'rgba(156,163,175,0.6)' }}
        >
          <FolderOpen size={40} className="mx-auto mb-3 opacity-40" />
          <p>No custom projects added yet.</p>
          <p className="text-sm mt-1 opacity-70">
            Projects from content/projects/ are shown automatically on the portfolio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-strong p-5 flex items-start gap-4"
              style={{ borderRadius: '1rem' }}
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate" style={{ color: '#f0f0ff' }}>
                  {project.title}
                </h3>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(156,163,175,0.7)' }}>
                  {project.description}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' }}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ----- Contact Tab -----
function ContactTab({ data, onSave }: { data: PortfolioData; onSave: (d: PortfolioData) => void }) {
  const [form, setForm] = useState(data.contact)

  const handleSave = () => {
    onSave({ ...data, contact: form })
  }

  return (
    <div className="glass-strong p-8" style={{ borderRadius: '1.5rem' }}>
      <h2 className="text-xl font-semibold mb-6" style={{ color: '#f0f0ff' }}>Edit Contact Info</h2>
      <div className="space-y-5 max-w-xl">
        {[
          { label: 'Email', field: 'email' as const, type: 'email', placeholder: 'hello@example.com' },
          { label: 'Telegram Handle', field: 'telegram' as const, type: 'text', placeholder: '@username' },
          { label: 'CV / Resume URL', field: 'cvUrl' as const, type: 'url', placeholder: 'https://drive.google.com/...' },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.9)' }}>
              {label}
            </label>
            <input
              type={type}
              className="dark-input"
              placeholder={placeholder}
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
            />
          </div>
        ))}

        <button onClick={handleSave} className="btn-gradient px-6 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  )
}
