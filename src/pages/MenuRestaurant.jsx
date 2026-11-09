import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { fetchMenuItems } from "../services/menuServices"
import FeaturedMenuCard from "../User/FeaturedMenuCard"
import { Search } from "lucide-react"

function Menu() {
  const [menu, setMenu] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    let isCancelled = false

    const loadMenu = async () => {
      try {
        const { data } = await fetchMenuItems()
        if (!isCancelled) {
          setMenu(Array.isArray(data) ? data : data?.items ?? [])
        }
      } catch {
        if (!isCancelled) toast.error("Failed to fetch menu items")
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    loadMenu()
    return () => { isCancelled = true }
  }, [])

  const categories = useMemo(() => {
    const values = menu
      .map((item) => item.category)
      .filter(Boolean)
    return ["All", ...new Set(values)]
  }, [menu])

  const filteredMenu = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menu.filter((item) => {
      const category = typeof item.category === "string" ? item.category : item.category?.name
      const matchesCategory = activeCategory === "All" || category === activeCategory
      const matchesSearch = !query || [item.name, item.title, item.description, category]
        .some((value) => String(value ?? "").toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [menu, search, activeCategory]);


  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage)
  const visibleMenu = filteredMenu.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const updateSearch = (value) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const updateCategory = (category) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Fresh from our kitchen</p>
          <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our menu</h1>
              <p className="mt-4 max-w-xl leading-7 text-muted">Seasonal favorites, thoughtfully prepared with fresh ingredients and a little extra heart.</p>
            </div>
            <label className="relative block w-full sm:max-w-sm">
              <span className="sr-only">Search menu</span>
              <Search className="w-4 absolute top-1/2 -translate-y-1/2 left-4"/>
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search dishes..."
                className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-5 text-sm outline-none transition placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus/20"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => updateCategory(category)}
              aria-pressed={activeCategory === category}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${activeCategory === category ? "bg-primary text-on-primary" : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"}`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="py-16 text-center text-muted" role="status">Loading menu...</p>
        ) : filteredMenu.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface px-6 py-16 text-center">
            <h2 className="text-xl font-bold">No dishes found</h2>
            <p className="mt-2 text-sm text-muted">Try another search or category.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 text-sm text-muted" aria-live="polite">
              Showing {visibleMenu.length} of {filteredMenu.length} dishes
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleMenu.map((item, index) => (
                <FeaturedMenuCard key={item.id ?? item._id ?? index} menu={item} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Menu pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >Previous</button>
                <span className="text-sm text-muted" aria-live="polite">Page {currentPage} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >Next</button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default Menu