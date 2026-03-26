import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, Send } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(139,92,246,0.2)', border: '2px solid rgba(139,92,246,0.4)' }}>
            <Mail className="w-8 h-8" style={{ color: '#c4b5fd' }} />
          </div>
          <h2 className="text-2xl font-bold text-[#f0f0ff] mb-2">
            Message Sent!
          </h2>
          <p className="text-[rgba(156,163,175,0.85)] mb-6">
            Thanks for reaching out. I'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-gradient px-6 py-2 rounded-lg font-medium"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#f0f0ff] mb-2">Contact</h1>
        <p className="text-[rgba(156,163,175,0.85)] mb-8">
          Have a question or want to work together? Drop me a message.
        </p>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const formData = new FormData(form)
            fetch('/contact.html', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams(
                formData as unknown as Record<string, string>,
              ).toString(),
            })
              .then(() => setSubmitted(true))
          }}
          className="space-y-6"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              Don't fill this out: <input name="bot-field" />
            </label>
          </p>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'rgba(196,181,253,0.9)' }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="dark-input"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'rgba(196,181,253,0.9)' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="dark-input"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'rgba(196,181,253,0.9)' }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="dark-input resize-none"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium"
          >
            <Send size={16} />
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
