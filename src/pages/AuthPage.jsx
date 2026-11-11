import useTheme from "../hooks/useTheme";
import foodImageForAuth from "../assets/food for auth page.jpg";
import SignUp from "../components/SignUp";
import Login from '../components/Login';
import logo from "../assets/Minimal_Green_Chef_Hat_Logo-.png";
import { useNavigate } from 'react-router';
function AuthPage({isLoggin}) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const isDark = theme === "dark";
    return (
        <section className="signUp min-h-screen bg-background text-text lg:h-screen lg:overflow-hidden">
            <div className="h-full lg:flex lg:h-full">
                <aside className={`left_side relative hidden lg:flex-col justify-between overflow-hidden p-10 text-white md:p-14 lg:flex lg:p-16 ${isDark ? "bg-[#101812]" : "bg-[#243b2b]"}`}>
                    <img
                        src={foodImageForAuth}
                        alt="A freshly prepared restaurant meal"
                        className={`absolute inset-0 h-full w-full object-cover ${isDark ? "opacity-35" : "opacity-45"}`}
                    />
                    <div className={`absolute inset-0 ${isDark ? "bg-linear-to-br from-black/70 via-[#142219]/65 to-black/90" : "bg-linear-to-br from-[#142219]/55 via-[#1d3324]/35 to-black/75"}`} />

                    <div className="relative z-10 flex items-center justify-between">
                        <button type="button" onClick={() => navigate("/")} aria-label="Go to home" className="rounded-xl bg-background p-2 backdrop-blur transition">
                            <img src={logo} alt="Villette Chef" className="w-14" />
                        </button>
                        <span className="rounded-full border border-white/30 px-4 py-2 text-xs font-medium tracking-[0.18em] text-white/90">FRESH · LOCAL · DELICIOUS</span>
                    </div>

                    <div className="relative z-10 max-w-xl pb-4">
                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">Welcome to Villet Chef</p>
                        <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight xl:text-6xl">
                            Good food brings us <span className="text-emerald-200">together.</span>
                        </h1>
                        <p className="max-w-lg text-base leading-7 text-white/80 xl:text-lg">
                            Discover thoughtful dishes made with fresh ingredients, order your favorites with ease, and make every meal worth looking forward to.
                        </p>
                        <div className="mt-8 flex items-center gap-3 text-sm text-white/80">
                            <span className="h-px w-10 bg-emerald-200" /> Made for sharing, served with care
                        </div>
                    </div>
                </aside>

                <main className="right-side flex flex-1 h-dvh flex-col justify-center p-6 sm:p-10 md:p-14 lg:min-h-0 lg:p-16">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-10 lg:hidden">
                            <button type="button" onClick={() => navigate("/")} aria-label="Go to home" className="rounded-xl bg-text/5 p-2">
                                <img src={logo} alt="Villet Chef" className="w-12" />
                            </button>
                        </div>
                    {isLoggin ? (
                       <Login/>
                    ) : (
                        <SignUp/>
                    )}
                    </div>
                </main>

            </div>
        </section>
    )
}

export default AuthPage