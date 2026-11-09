import { useEffect, useState } from "react"
import logo from "../assets/Minimal_Green_Chef_Hat_Logo-.png"
import { toast } from "react-toastify";
import { fetchMenuItems } from "../services/menuServices";
import { Link } from "react-router";
import FeaturedMenuCard from "../User/FeaturedMenuCard";

function HomePage() {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4;
  useEffect(() => {
    let isCancelled = false
    const fetchMenus = async () => {
      try {
        const { data } = await fetchMenuItems();
        if (!isCancelled) {
          setMenu(data)
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error("Failed to fetch menu items");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }
    fetchMenus();
    return () => isCancelled = true
  }, [])

  const totalPages = Math.ceil(menu.length / itemsPerPage)
  const visibleMenuItems = menu.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)


  return (
    <main className="min-h-screen overflow-hidden bg-background text-text">
      <section id="home" className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 md:pb-28 lg:grid-cols-2 lg:px-12 lg:pt-14">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm">
            <span className="size-2 rounded-full bg-success" /> Fresh from our kitchen
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
            Good food.<br />
            <span className="text-primary">Good for you.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Thoughtful, seasonal cooking made with ingredients grown close to home. Come hungry, leave feeling good.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#menu" className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-bold text-on-primary shadow-xl shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover">
              Explore our menu <span aria-hidden="true">→</span>
            </a>
            <a href="#story" className="inline-flex items-center gap-2 rounded-full px-5 py-4 text-sm font-bold text-text transition hover:bg-card">
              <span className="grid size-8 place-items-center rounded-full border border-border text-primary">▶</span> Our story
            </a>
          </div>
          <div className="mt-12 flex items-center gap-4 border-t border-border pt-7">
            <div className="flex -space-x-3" aria-hidden="true">
              {['photo-1534528741775-53994a69daeb', 'photo-1500648767791-00dcc994a43e', 'photo-1531123897727-8f129e1688ce'].map((photo) => (
                <img key={photo} src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=80&h=80&q=80`} alt="" className="size-10 rounded-full border-[3px] border-background object-cover" />
              ))}
            </div>
            <div>
              <div className="text-sm font-bold">Loved by our community</div>
              <div className="mt-0.5 text-xs text-muted"><span className="text-warning">★★★★★</span> <span className="font-semibold text-text">4.9</span> from 320+ happy guests</div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute -right-10 -top-8 size-52 rounded-full bg-card blur-3xl" />
          <div className="absolute -bottom-8 -left-8 size-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative h-107.5 overflow-hidden rounded-4xl shadow-2xl shadow-text/10 sm:h-130">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=90"
              alt="A colorful, freshly prepared seasonal meal"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-text/45 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">From field to fork</div>
                <div className="mt-2 text-2xl font-bold">A little more goodness.</div>
              </div>
              <span className="grid size-12 place-items-center rounded-full border border-white/40 bg-white/15 text-xl backdrop-blur-md" aria-hidden="true">↗</span>
            </div>
          </div>
          <div className="absolute -left-5 top-10 hidden rounded-2xl border border-border bg-surface p-4 shadow-xl sm:block lg:-left-12">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-card text-xl" aria-hidden="true">✳</span>
              <div><div className="text-sm font-extrabold">100% seasonal</div><div className="mt-1 text-xs text-muted">Always fresh, always local</div></div>
            </div>
          </div>
          <div className="absolute -bottom-7 right-5 rounded-2xl border border-border bg-surface px-5 py-4 shadow-xl sm:right-8">
            <div className="text-xs font-semibold text-muted">Open today</div>
            <div className="mt-1 text-sm font-extrabold">11:30 am – 10:00 pm</div>
          </div>
        </div>
      </section>

      <section id="experience" className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            ['01', 'Locally sourced', 'Good ingredients, from people we know.'],
            ['02', 'Made from scratch', 'A little patience makes everything better.'],
            ['03', 'A place to gather', 'Pull up a chair. There is always room.'],
          ].map(([number, title, copy]) => (
            <div key={number} className="flex items-start gap-4 px-2 py-2">
              <span className="mt-0.5 text-xs font-extrabold tracking-widest text-primary">{number}</span>
              <div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm text-muted">{copy}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">A taste of Villet</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Made with the season.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">A few favorites from a menu that changes with what is growing.</p>
          </div>
          <Link to={"/menu"} className="text-sm font-bold text-primary transition hover:text-primary-hover">View full menu <span aria-hidden="true">→</span></Link>
        </div>
        <div className="menu_container">
          {isLoading ? (
            <p className="py-10 text-center text-muted" role="status">Loading menu...</p>
          ) : menu.length === 0 ? (
            <p className="py-10 text-center text-muted">No menu items are available right now.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {visibleMenuItems.map((item, index) => {
                return (
                  <FeaturedMenuCard key={item.id} menu={item} />
                )
              })}
            </div>
          )}
          {totalPages > 0 && (
            <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Menu pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted" aria-live="polite">Page {currentPage} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </section>

      <section id="story" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="grid overflow-hidden rounded-4xl bg-card lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Gather around</div>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">A neighborhood table, with a little extra heart.</h2>
            <p className="mt-5 max-w-lg leading-7 text-muted">We believe the best meals begin with good ingredients and end with good company. Our kitchen brings both together, every day.</p>
            <a href="#reserve" className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-on-primary transition hover:bg-primary-hover">Come on in <span aria-hidden="true">→</span></a>
          </div>
          <div className="min-h-72 lg:min-h-105">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85" alt="A warmly set restaurant table ready for guests" className="h-full min-h-72 w-full object-cover" />
          </div>
        </div>
      </section>

      <footer id="reserve" className="bg-text text-background">
        <div className="max-w-7xl px-4 md:px-8 lg:px-12 mx-auto">
        <div className="logo -ml-4 flex items-center gap-0">
           <img src={logo} alt="restaurant logo" className="w-14 md:w-18" />
           <h2 className="font-semibold">Villet Chef</h2>
        </div>
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-background/70">Come by for lunch, stay a little longer for dinner.</p>
          <a href="tel:+15550142800" className="w-fit rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary transition hover:bg-primary-hover">Book your table <span aria-hidden="true">↗</span></a>
        </div>
        </div>
      </footer>
    </main>
  )
}

export default HomePage