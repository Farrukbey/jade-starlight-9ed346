import { HeadContent, Scripts, Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Farrukhbey — Full-Stack Developer' },
      { name: 'description', content: 'Farrukhbey — Full-Stack Developer specializing in modern web technologies. Explore my projects, skills, and experience.' },
      { name: 'keywords', content: 'Farrukhbey, Full-Stack Developer, React, TypeScript, Portfolio, farrukhbey.uz' },
      { property: 'og:title', content: 'Farrukhbey — Full-Stack Developer' },
      { property: 'og:description', content: 'Explore my portfolio, projects, and experience as a Full-Stack Developer.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function RootLayout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/#about', label: 'About' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold gradient-text">
            Farrukhbey
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav-link text-sm font-medium">
                {l.label}
              </a>
            ))}
            <a
              href="/admin/"
              className="text-xs px-3 py-1.5 rounded-md"
              style={{
                border: '1px solid rgba(139,92,246,0.4)',
                color: 'rgba(196,181,253,0.8)',
                transition: 'all 0.2s',
              }}
            >
              Admin
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-300 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 space-y-3 border-t border-white/10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block nav-link py-2 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer
      className="mt-24 py-8 text-center text-sm"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(156,163,175,0.7)',
      }}
    >
      <p>© {new Date().getFullYear()} Farrukhbey. Built with TanStack Start.</p>
    </footer>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.netlifyIdentity) {
                window.netlifyIdentity.on("init", function(user) {
                  if (!user) {
                    window.netlifyIdentity.on("login", function() {
                      document.location.href = "/admin/";
                    });
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
