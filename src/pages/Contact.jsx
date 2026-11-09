import React, { useState } from 'react'

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-primary">We’d love to hear from you</p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">Let’s make your next meal <span className="text-primary">memorable.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Questions, special requests, or planning a gathering? Get in touch with the Villet Chef team—we’re always happy to help.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Contact details</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Come say hello</h2>
          <p className="mt-4 leading-7 text-muted">We’re here to make every visit—and every conversation—feel welcoming.</p>

          <div className="mt-10 space-y-7">
            <a href="tel:+15550142800" className="group flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary transition group-hover:bg-primary group-hover:text-on-primary" aria-hidden="true">☎</span>
              <span><span className="block text-sm font-semibold text-muted">Call us</span><span className="mt-1 block font-bold group-hover:text-primary">+1 (555) 014-2800</span></span>
            </a>
            <a href="mailto:hello@villetchef.com" className="group flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary transition group-hover:bg-primary group-hover:text-on-primary" aria-hidden="true">✉</span>
              <span><span className="block text-sm font-semibold text-muted">Email us</span><span className="mt-1 block font-bold group-hover:text-primary">hello@villetchef.com</span></span>
            </a>
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary" aria-hidden="true">⌖</span>
              <span><span className="block text-sm font-semibold text-muted">Visit us</span><span className="mt-1 block font-bold">24 Garden Lane<br />Brookfield, NY 10001</span></span>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-bold">Opening hours</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted">Monday – Friday</dt><dd className="font-semibold">11:30 am – 10 pm</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Saturday – Sunday</dt><dd className="font-semibold">10 am – 11 pm</dd></div>
            </dl>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(var(--shadow-color),0.08)] sm:p-9">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Fill in the form and our team will be in touch shortly.</p>
          {submitted && <p role="status" className="mt-5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success">Thanks for reaching out! Your message is ready for our team.</p>}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Your name<input required name="name" autoComplete="name" placeholder="Alex Morgan" className="mt-2 w-full rounded-xl border border-border bg-input px-4 py-3 font-normal text-text outline-none transition placeholder:text-muted/70 focus:border-focus focus:ring-2 focus:ring-focus/20" /></label>
              <label className="block text-sm font-semibold">Email address<input required type="email" name="email" autoComplete="email" placeholder="alex@example.com" className="mt-2 w-full rounded-xl border border-border bg-input px-4 py-3 font-normal text-text outline-none transition placeholder:text-muted/70 focus:border-focus focus:ring-2 focus:ring-focus/20" /></label>
            </div>
            <label className="block text-sm font-semibold">What can we help with?
              <select name="subject" className="mt-2 w-full rounded-xl border border-border bg-input px-4 py-3 font-normal text-text outline-none transition focus:border-focus focus:ring-2 focus:ring-focus/20">
                <option>General inquiry</option><option>Reservation</option><option>Private dining & events</option><option>Feedback</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">Your message<textarea required name="message" rows="5" placeholder="Tell us a little more..." className="mt-2 w-full resize-y rounded-xl border border-border bg-input px-4 py-3 font-normal text-text outline-none transition placeholder:text-muted/70 focus:border-focus focus:ring-2 focus:ring-focus/20" /></label>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-on-primary transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-focus/30 sm:w-auto">Send message <span aria-hidden="true">→</span></button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">
        <div className="flex min-h-56 flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 text-center">
          <span className="text-3xl text-primary" aria-hidden="true">⌖</span>
          <h2 className="mt-3 text-xl font-bold">Find us in Brookfield</h2>
          <p className="mt-2 text-muted">24 Garden Lane, Brookfield, NY 10001</p>
          <a href="https://maps.google.com/?q=24+Garden+Lane+Brookfield+NY+10001" target="_blank" rel="noreferrer" className="mt-5 font-bold text-primary hover:underline">Get directions <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
  )
}

export default Contact