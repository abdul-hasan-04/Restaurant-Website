function About() {
  return (
    <main className="overflow-hidden bg-background text-text">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-28 lg:pt-24">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 rounded-full bg-success" /> Our story
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Good food.<br />
            <span className="text-primary">Good company.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-muted">
            At Villet Chef, we believe the best meals bring people closer. We make thoughtful, seasonal food with the warmth and generosity of a table shared with friends.
          </p>
          <a href="#our-values" className="mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover">
            Get to know us <span aria-hidden="true">↗</span>
          </a>
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-border pt-7">
            <div><p className="text-2xl font-extrabold text-primary">Since 2016</p><p className="mt-1 text-sm text-muted">Cooking with care</p></div>
            <div><p className="text-2xl font-extrabold text-primary">Made fresh</p><p className="mt-1 text-sm text-muted">Every single day</p></div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-card sm:-right-8 sm:-top-8 sm:h-44 sm:w-44" />
          <div className="relative grid grid-cols-[1.15fr_0.85fr] items-end gap-4">
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85"
              alt="A welcoming restaurant dining room"
              className="h-85 w-full rounded-4xl object-cover shadow-xl sm:h-110"
            />
            <div className="space-y-4 pb-8">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85"
                alt="Fresh ingredients prepared for the table"
                className="h-44 w-full rounded-3xl object-cover shadow-lg sm:h-56"
              />
              <div className="rounded-3xl bg-card p-5 sm:p-6">
                <p className="text-3xl font-extrabold text-primary">The Villet way</p>
                <p className="mt-2 text-sm leading-6 text-muted">Fresh ingredients, familiar comforts, and a little something unexpected.</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 left-4 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold shadow-lg sm:left-8">
            <span className="mr-2 text-warning" aria-hidden="true">✦</span> Made to be shared
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">More than a meal</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">A place to feel at home.</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-muted sm:text-lg">
            <p>Villet Chef started with a simple idea: a neighborhood restaurant should feel like an extension of your own table. A place for weeknight dinners, long conversations, and the occasions you want to remember.</p>
            <p>Our kitchen follows the seasons and lets good ingredients speak for themselves. Every dish is prepared with care, served with a generous spirit, and made to bring people together.</p>
          </div>
        </div>
      </section>

      <section id="our-values" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24 lg:px-12">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">What matters to us</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">The little things make it special.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { number: '01', title: 'Seasonal by nature', text: 'We take our cues from the seasons, choosing fresh ingredients and letting them shine.' },
            { number: '02', title: 'Made with intention', text: 'From the first prep to the final plate, we put care into every detail.' },
            { number: '03', title: 'Always welcoming', text: 'Come as you are. There is always room at our table for one more.' },
          ].map((value) => (
            <article key={value.number} className="rounded-3xl border border-border bg-card p-7 sm:p-8">
              <span className="text-sm font-extrabold tracking-widest text-primary">{value.number}</span>
              <h3 className="mt-8 text-xl font-bold">{value.title}</h3>
              <p className="mt-3 leading-7 text-muted">{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 sm:pb-24 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-4xl bg-primary px-8 py-10 text-on-primary sm:px-12 sm:py-14 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-on-primary/75">Pull up a chair</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Your table is waiting.</h2>
            <p className="mt-3 max-w-xl leading-7 text-on-primary/80">We would love to welcome you to Villet Chef for something delicious and a little time well spent.</p>
          </div>
          <a href="/reservations" className="shrink-0 rounded-full bg-surface px-6 py-3.5 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:bg-background">Make a reservation <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
}

export default About