function Footer() {
  return (
    <footer className="footer border-t border-border bg-surface text-text">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-1">
          <a href="/" className="inline-block text-2xl font-bold tracking-tight text-primary">
            Villet Chef
          </a>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            Thoughtfully prepared dishes, fresh ingredients, and warm hospitality. We look forward to welcoming you.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><a href="/menu" className="transition-colors hover:text-primary">Our menu</a></li>
            <li><a href="/about" className="transition-colors hover:text-primary">About us</a></li>
            <li><a href="/reservations" className="transition-colors hover:text-primary">Reservations</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text">Visit us</h2>
          <address className="mt-4 space-y-3 text-sm not-italic leading-6 text-muted">
            <p>123 Garden Street<br />Your City, ST 00000</p>
            <a href="tel:+10000000000" className="block transition-colors hover:text-primary">(000) 000-0000</a>
            <a href="mailto:hello@villetchef.com" className="block transition-colors hover:text-primary">hello@villetchef.com</a>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text">Hours</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex justify-between gap-4"><span>Mon–Fri</span><span>11:00 AM–9:00 PM</span></li>
            <li className="flex justify-between gap-4"><span>Sat–Sun</span><span>10:00 AM–10:00 PM</span></li>
          </ul>
          <a href="/reservations" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover">
            Book a table
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-muted sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Villet Chef Restaurant. All rights reserved.</p>
          <p>Made with care, served with flavor.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer