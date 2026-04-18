/**
 * Contact page
 * Uses Formspree — free, no backend needed
 * Submissions go directly to Gmail privately
 * Zero email exposed publicly
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('https://formspree.io/f/myklwqyd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="font-body text-sm text-text-muted
                   hover:text-primary mb-8 inline-block
                   transition-colors"
      >
        ← Back to home
      </Link>

      <h1 className="font-display text-4xl font-bold
                     text-primary mb-2">
        Contact Us
      </h1>
      <p className="font-body text-text-muted mb-10">
        Have a question, feedback or issue? We read every
        message and respond within 48 hours.
      </p>

      {/* Success state */}
      {status === 'success' ? (
        <div className="card text-center py-12 animate-in">
          <p className="text-5xl mb-4">✉️</p>
          <h2 className="font-display text-2xl font-bold
                         text-primary mb-2">
            Message sent!
          </h2>
          <p className="font-body text-text-muted mb-6">
            We'll get back to you within 48 hours.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="btn-ghost"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error banner */}
          {status === 'error' && (
            <div className="bg-error/10 border border-error/20
                            text-error text-sm font-body
                            rounded-xl px-4 py-3">
              Something went wrong. Please try again or email
              us directly.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium
                                font-body text-text-primary mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ada Okonkwo"
                className="input-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium
                                font-body text-text-primary mb-1.5">
                Your email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                className="input-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium
                              font-body text-text-primary mb-1.5">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="input-base"
              required
            >
              <option value="">Select a subject</option>
              <option value="General Question">General Question</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Question Quality">Question Quality</option>
              <option value="Billing">Billing</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Partnership">Partnership</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium
                              font-body text-text-primary mb-1.5">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Tell us what's on your mind..."
              rows={5}
              className="input-base resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary w-full disabled:opacity-50"
          >
            {status === 'sending' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40
                                 border-t-white rounded-full
                                 animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>

          <p className="font-body text-xs text-text-muted
                        text-center">
            We typically respond within 48 hours.
          </p>
        </form>
      )}

      {/* Louis IV Studio watermark */}
      <p className="font-body text-xs text-text-muted/30
                    tracking-widest uppercase mt-16 text-center">
        Louis IV Studio
      </p>
    </div>
  )
}
