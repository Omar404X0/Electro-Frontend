'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faXmark, faX, faMagnifyingGlass, faCartShopping, faRocket, faShieldHalved, faCode, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faPaypal, faCcVisa, faApplePay } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import GenerateButton from '@/app/components/GenerateButton'
import Form from '@/app/components/Form'

const API_BASE_URL = "https://electro-backend-2dx5.onrender.com";

type Prodacts = {
  id: number;
  name: string;
  price: number;
  con: number;
  stat: boolean;
  imgs: string[];
}

export default function Home() {
  const [pro, setpro] = useState<Prodacts[]>([])
  const [selected, setsel] = useState<Prodacts | null>(null)
  const [active, setactive] = useState(false)
  const [method, setMethod] = useState<"paypal" | "visa" | "applepay">("visa")
  const [secc, setsecc] = useState(Boolean)
  const [dark, setDark] = useState(false)
  const bay_ref = useRef<HTMLInputElement>(null)
  const name_visa = useRef<HTMLInputElement>(null)
  const number_visa = useRef<HTMLInputElement>(null)
  const visa_pass = useRef<HTMLInputElement>(null)
  const end_visa = useRef<HTMLInputElement>(null)

  const apple_ref = useRef<HTMLInputElement>(null)
  const pay_pal = useRef<HTMLInputElement>(null)
  const shop_ref = useRef<HTMLDivElement>(null)
  const search_input = useRef<HTMLInputElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const [chat, setchat] = useState(false)

  // Search
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  /* ---------------- Search ---------------- */
  const q = query.trim().toLowerCase()
  const tokens = q.split(/\s+/).filter(Boolean)

  const filtered = tokens.length
    ? pro.filter((p) => tokens.every((t) => p.name.toLowerCase().includes(t)))
    : pro

  function scrollToShop() {
    shop_ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSearchChange(value: string) {
    const wasEmpty = query.trim() === ""
    setQuery(value)
    if (wasEmpty && value.trim() !== "") scrollToShop()
  }

  function closeSearch() {
    setSearchOpen(false)
    setQuery("")
  }

  function toggleSearch() {
    if (searchOpen) {
      closeSearch()
    } else {
      setMenuOpen(false)
      setSearchOpen(true)
    }
  }

  function highlight(text: string) {
    if (!tokens.length) return text
    const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <mark key={i} className={`rounded px-0.5 text-inherit ${dark ? "bg-yellow-400/30" : "bg-yellow-300/70"}`}>{part}</mark>
      ) : (
        part
      )
    )
  }

  /* ---------------- Navigation ---------------- */
  function goTo(path: string, e?: MouseEvent) {
    e?.preventDefault()
    setMenuOpen(false)
    router.push(path)
  }

  function rout_to_purchases(e?: MouseEvent) {
    goTo("/purchases", e)
  }

  function rout_to_support(e?: MouseEvent) {
    goTo("/support", e)
  }

  function rout(e?: MouseEvent) {
    goTo('/deels', e)
  }

  function sendTocart() {
    router.push('/cart')
  }

  function rout_to_shop(e?: MouseEvent) {
    e?.preventDefault()
    setMenuOpen(false)
    scrollToShop()
  }

  async function sendData(pro: Prodacts | null) {
    if (pro === null) return
    const token = localStorage.getItem('token')

    const result = await fetch(`${API_BASE_URL}/prodacts/cart`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pro_id: pro.id,
        token: token,
        quantity: 1
      })
    })

    const data = await result.json()
    console.log(data)
  }

  function buy_fun(p: Prodacts) {
    setactive(true)
    setsel(p)
  }

  function activefun() {
    setactive(false)
  }

  async function sendInfo(pro: Prodacts | null) {
    if (pro === null) return

    const token = localStorage.getItem('token')
    if (method == 'visa') {
      if (visa_pass.current && name_visa.current && number_visa.current && end_visa.current) {
        if (name_visa.current.value === 'Omar Elmallah' && visa_pass.current.value === '123' && end_visa.current.value === '12/12' && number_visa.current.value === '123456789') {
          const response = await fetch(`${API_BASE_URL}/prodacts/order`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "pro_id": pro.id, 'token': token })
          })
          const data = await response.json()
          if (data) {
            alert('Prodact Owend')
            name_visa.current.value = ''
            visa_pass.current.value = ''
            end_visa.current.value = ''
            number_visa.current.value = ''
            setsecc(true)
          } else {
            setsecc(false)
          }
        } else {
          alert('Error in Visa')
        }
      }
    }
    if (method === 'paypal') {
      if (pay_pal.current) {
        if (pay_pal.current.value === 'Omar.Elmallah.business@gamil.com') {
          const response = await fetch(`${API_BASE_URL}/prodacts/order`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "pro_id": pro.id, 'token': token })
          })
          const data = await response.json()
          if (data) {
            alert('Prodact Owend')
            pay_pal.current.value = ''
            setsecc(true)
          } else {
            setsecc(false)
          }
        } else {
          alert('Error In PaYPal Acount')
        }
      }
    }
    if (method === 'applepay') {
      if (apple_ref.current) {
        if (apple_ref.current.value === '01012345678') {
          const response = await fetch(`${API_BASE_URL}/prodacts/order`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "pro_id": pro.id, 'token': token })
          })
          const data = await response.json()
          if (data) {
            alert('Prodact Owend')
            apple_ref.current.value = ''
            setsecc(true)
          } else {
            setsecc(false)
          }
        } else {
          alert('Error In Apple Pay Acount')
        }
      }
    }
  }

  useEffect(() => {
    fetch(`${API_BASE_URL}/prodacts`)
      .then((res) => res.json())
      .then((data) => setpro(data))
      .catch((err) => console.log('error'))
  }, [])

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [active])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    const t = setTimeout(() => search_input.current?.focus(), 200)
    return () => clearTimeout(t)
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMenuOpen(false)
        setSearchOpen(true)
        search_input.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const iconBtn = dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"
  const navLink = dark ? "hover:text-white" : "hover:text-black"
  const inputCls = `rounded-xl p-3 w-full min-w-0 text-base outline-none border ${dark ? "bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-white" : "border-slate-300 focus:border-black"}`
  const actionBtn = `flex-1 sm:flex-none sm:w-30 h-11 sm:h-10 rounded-3xl transition-all duration-300 cursor-pointer ${
    dark ? "bg-white text-black hover:bg-slate-200 hover:drop-shadow-xl hover:drop-shadow-black" : "bg-black text-white hover:bg-gray-800 hover:drop-shadow-xl hover:drop-shadow-black"
  }`
  const shadowImg = dark ? "drop-shadow-xl drop-shadow-black" : "drop-shadow-xl drop-shadow-gray-950"

  return (
    <div className={`${dark ? "bg-neutral-950 text-white" : "bg-slate-50 text-black"} w-full min-h-dvh overflow-x-hidden transition-colors duration-300`}>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-card, .anim-bar, .anim-float { animation: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        dark ? "bg-black/80 backdrop-blur-md border-white/10 text-white" : "bg-white/80 backdrop-blur-md border-black/10 text-black"
      }`}>
        <div className="con w-full max-w-[1920px] mx-auto flex flex-row justify-between items-center px-3 sm:px-5 h-14 sm:h-16 gap-2">

          <div className="com flex flex-row items-center gap-2 sm:gap-3 min-w-0">
            <BoltMark dark={dark} />
            <div className="title font-extrabold text-lg sm:text-xl tracking-tight truncate">Electro</div>
          </div>

          <nav className={`hidden md:flex flex-row items-center gap-4 lg:gap-8 text-sm font-medium ${dark ? "text-white/70" : "text-black/60"}`}>
            <a onClick={rout_to_shop} href="#" className={`transition-colors ${navLink}`}>Shop</a>
            <a onClick={rout_to_purchases} href="#" className={`transition-colors whitespace-nowrap ${navLink}`}>My Purchases</a>
            <a onClick={rout_to_support} href="/support" className={`transition-colors ${navLink}`}>Support</a>
            <GenerateButton onClick={() => setchat(true)}></GenerateButton>
          </nav>

          <div className="icons flex flex-row items-center gap-4 sm:gap-5 shrink-0">
            <button
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
              onClick={toggleSearch}
              className={`flex transition-all duration-300 cursor-pointer p-1 hover:scale-110 ${
                searchOpen ? (dark ? "text-white" : "text-black") : iconBtn
              }`}
            >
              <span className="relative block w-4 h-4">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className={`absolute inset-0 transition-all duration-300 ${searchOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}
                />
                <FontAwesomeIcon
                  icon={faXmark}
                  className={`absolute inset-0 transition-all duration-300 ${searchOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
                />
              </span>
            </button>

            <button
              aria-label="Toggle theme"
              onClick={() => setDark(!dark)}
              className={`transition-colors cursor-pointer p-1 ${iconBtn}`}
            >
              <FontAwesomeIcon icon={dark ? faSun : faMoon} />
            </button>

            <button aria-label="Cart" onClick={() => sendTocart()} className={`relative transition-colors cursor-pointer p-1 ${iconBtn}`}>
              <FontAwesomeIcon icon={faCartShopping} />
              <span className={`absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                dark ? "bg-white text-black" : "bg-black text-white"
              }`}>
                2
              </span>
            </button>

            <button
              aria-label="Menu"
              onClick={() => {
                if (!menuOpen) closeSearch()
                setMenuOpen(!menuOpen)
              }}
              className={`md:hidden transition-colors cursor-pointer p-1 w-5 ${iconBtn}`}
            >
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {/* Search Panel */}
        <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${searchOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className={`max-w-[1920px] mx-auto px-3 sm:px-5 pb-3 sm:pb-4 transition-all duration-300 ${searchOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
              <div
                className={`relative flex items-center ml-auto rounded-full border transition-all duration-500 ease-out focus-within:shadow-lg ${
                  searchOpen ? "w-full" : "w-24"
                } ${dark
                  ? "bg-neutral-900 border-white/10 focus-within:border-white/40 focus-within:shadow-black"
                  : "bg-slate-100 border-black/10 focus-within:border-black/40 focus-within:shadow-black/10"}`}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className={`absolute left-4 text-sm pointer-events-none ${dark ? "text-white/50" : "text-black/40"}`} />
                <input
                  ref={search_input}
                  value={query}
                  tabIndex={searchOpen ? 0 : -1}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') scrollToShop()
                    if (e.key === 'Escape') closeSearch()
                  }}
                  type="text"
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  placeholder="Search products..."
                  className={`w-full min-w-0 bg-transparent outline-none text-base h-11 pl-11 pr-20 sm:pr-24 rounded-full ${dark ? "text-white placeholder-neutral-500" : "text-black placeholder-black/40"}`}
                />
                <div className="absolute right-2 flex items-center gap-2">
                  {query && (
                    <button
                      aria-label="Clear search"
                      tabIndex={searchOpen ? 0 : -1}
                      onClick={() => { setQuery(""); search_input.current?.focus() }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors ${dark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"}`}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )}
                  <kbd className={`hidden sm:inline text-[10px] font-semibold px-1.5 py-0.5 rounded border ${dark ? "border-white/15 text-white/40" : "border-black/15 text-black/40"}`}>Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {menuOpen && (
          <nav className={`md:hidden flex flex-col gap-1 px-4 sm:px-5 pb-4 text-sm font-medium max-h-[70dvh] overflow-y-auto ${dark ? "text-white/70" : "text-black/60"}`}>
            <a href="#" onClick={rout_to_shop} className={`py-3 transition-colors ${navLink}`}>Shop</a>
            <a href="#" onClick={rout} className={`py-3 transition-colors ${navLink}`}>Deals</a>
            <a onClick={rout_to_purchases} href="#" className={`transition-colors whitespace-nowrap ${navLink}`}>My Purchases</a>
            
            <a href="/support" onClick={rout_to_support} className={`py-3 transition-colors ${navLink}`}>Support</a>
            <div className="pt-2">
              <GenerateButton onClick={() => { setMenuOpen(false); setchat(true) }}></GenerateButton>
            </div>
          </nav>
        )}
      </header>

      <div className="body mt-5 sm:mt-8 lg:mt-10 max-w-[1920px] mx-auto">

        {chat && <Form setChat={setchat} />}

        {/* Hero */}
        {!searchOpen && (
          <div className="con w-full p-4 sm:p-6 lg:p-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 lg:gap-10">
            <div className="text flex flex-col items-start w-full md:w-1/2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-start p-2 sm:p-4 font-bold leading-tight">
                Two Ways to Experience the Future.
              </h2>
              <p className={`text-sm sm:text-base break-words p-2 sm:p-4 font-bold text-start ${dark ? "text-white/70" : "text-black/70"}`}>
                Two icons. One era-defining lineup. Unmatched power, breathtaking cameras, and a screen that unfolds into limitless possibility. This isn't just a phone — it's tomorrow, today.
                <span className={`text-lg sm:text-xl lg:text-2xl font-bold my-2 block mt-4 ${dark ? "text-white" : "text-black"}`}>Now available, starting at 122000 EGP</span>
              </p>
            </div>

            <div className="img w-full md:w-1/2 md:hover:mt-2 transition-all duration-600 cursor-pointer">
              <img className={`rounded-2xl sm:rounded-4xl w-full h-auto ${shadowImg}`} src="/iphone.webp" alt="IPhone" />
            </div>
          </div>
        )}

        {/* Your Vision, Built for Success Section */}
      

        {/* Samsung */}
        {!searchOpen && (
          <div className="samsung w-full overflow-hidden scrollbar-none">
            <div className="con p-4 sm:p-5 w-full scrollbar-none flex flex-col items-center">
              <div className="text font-bold text-lg sm:text-xl lg:text-2xl text-center">Galaxy S26 Ultra Galaxy AI ✨</div>

              <div className="vids p-2 sm:p-5 w-full scrollbar-none flex flex-col md:flex-row items-center gap-4 md:gap-0 cursor-pointer">
                <div className="img w-full md:w-1/2 p-2 sm:p-5 md:hover:mt-5 transition-all duration-700">
                  <img className={`rounded-2xl sm:rounded-4xl w-full h-auto ${shadowImg}`} src="/samsung.webp" alt="Samsung Galaxy S26 Ultra" />
                </div>

                <div className="vid w-full md:w-1/2 p-2 sm:p-5">
                  <video
                    className={`w-full h-auto rounded-2xl sm:rounded-4xl transition-all duration-700 md:hover:mt-5 ${shadowImg}`}
                    src="/galaxy-s26-ultra.webm"
                    autoPlay
                    muted
                    loop
                    playsInline
                  ></video>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <div ref={shop_ref} id="shop" className="prodacts mt-10 sm:mt-14 lg:mt-20 scroll-mt-36 w-full px-4 py-6 sm:px-8 lg:p-15">

          {/* Results bar */}
          {q && (
            <div key={q} className="anim-bar mb-5 sm:mb-6 flex flex-row flex-wrap items-center justify-between gap-3" style={{ animation: 'fadeSlide 0.35s ease-out' }}>
              <div className={`text-sm sm:text-base ${dark ? "text-white/70" : "text-black/60"}`}>
                <span className={`font-bold ${dark ? "text-white" : "text-black"}`}>{filtered.length}</span>{" "}
                {filtered.length === 1 ? "result" : "results"} for “<span className="font-semibold break-all">{query.trim()}</span>”
              </div>
              <button
                onClick={() => setQuery("")}
                className={`text-sm font-medium px-4 h-9 rounded-full cursor-pointer transition-colors ${dark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"}`}
              >
                Clear search
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">

            {filtered.map((p, i) => (
              <div
                key={`${p.id}-${q}`}
                className={`anim-card pro min-w-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-3xl flex flex-col p-4 sm:p-5 gap-4 transition-all duration-500 ${
                  dark ? "bg-neutral-900" : "bg-white"
                }`}
                style={{ animation: `cardIn 0.5s ease-out ${Math.min(i, 8) * 60}ms backwards` }}
              >

                <div className={`h-44 sm:h-52 w-full rounded-3xl overflow-hidden flex items-center justify-center p-4 ${dark ? "bg-neutral-800" : "bg-slate-50"}`}>
                  <img
                    className="w-full h-full object-contain rounded-4xl"
                    src={p.imgs[0]}
                    alt={p.name}
                  />
                </div>

                <div className="txt font-bold text-base sm:text-lg text-start break-words">{highlight(p.name)}</div>

                <div className="dis flex flex-row flex-wrap justify-between items-center gap-3 mt-auto">
                  <div className={`price font-bold ${dark ? "text-blue-400" : "text-blue-600"}`}>
                    {p.price.toLocaleString()} EGP
                  </div>
                  <button
                    onClick={() => buy_fun(p)}
                    className={`px-6 h-10 rounded-full cursor-pointer transition-all duration-300 ${
                      dark ? "bg-white text-black hover:bg-slate-200" : "bg-black text-white hover:bg-slate-700"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}

          </div>

          {/* No results */}
          {q && filtered.length === 0 && (
            <div
              className={`anim-bar flex flex-col items-center justify-center text-center px-4 py-14 sm:py-20 rounded-3xl ${dark ? "bg-neutral-900" : "bg-white"}`}
              style={{ animation: 'cardIn 0.5s ease-out backwards' }}
            >
              <div className="anim-float" style={{ animation: 'floatIcon 2.4s ease-in-out infinite' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={`text-4xl sm:text-5xl mb-4 ${dark ? "text-white/20" : "text-black/15"}`} />
              </div>
              <p className={`text-base sm:text-lg font-semibold break-all ${dark ? "text-white/70" : "text-black/60"}`}>No results for “{query.trim()}”</p>
              <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-black/40"}`}>Try a different name or check the spelling.</p>
              <button
                onClick={() => { setQuery(""); search_input.current?.focus() }}
                className={`mt-5 px-6 h-10 rounded-full cursor-pointer transition-all duration-300 ${
                  dark ? "bg-white text-black hover:bg-slate-200" : "bg-black text-white hover:bg-slate-700"
                }`}
              >
                Clear search
              </button>
            </div>
          )}

        </div>

        {/* Buy Modal */}
        <div className={`${active
          ? `buy fixed z-[60] inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full h-dvh sm:h-auto sm:w-[92%] md:w-[85%] lg:w-[75%] xl:w-[60%] sm:max-h-[92dvh] lg:h-[80%] lg:min-h-[560px] overflow-y-auto drop-shadow-xl sm:rounded-2xl ${dark ? "bg-neutral-900 text-white drop-shadow-black" : "bg-white text-black drop-shadow-gray-950"}`
          : 'hidden'}`}>

          <div className="sticky top-0 z-10 h-0 w-full flex justify-end">
            <div onClick={activefun} aria-label="Close" className={`icon text-xl sm:text-2xl font-bold p-4 sm:p-5 cursor-pointer ${dark ? "text-white" : "text-black"}`}>
              <FontAwesomeIcon icon={faX} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between w-full lg:h-full">

            <div className="dis p-5 pt-14 sm:p-8 sm:pt-14 lg:p-15 flex flex-col w-full lg:w-[60%] lg:h-full items-start gap-6 lg:gap-20">
              <div className="img w-full lg:h-[50%] flex justify-center lg:justify-start">
                <img className="rounded-2xl w-full max-w-sm lg:max-w-none h-auto max-h-56 sm:max-h-64 lg:h-70 lg:w-auto object-contain" src={selected?.imgs[0]} alt={selected?.name} />
              </div>
              <div className="text flex flex-col gap-4 sm:gap-6 lg:gap-10 w-full">

                <div className="name font-extrabold text-xl sm:text-2xl break-words">{selected?.name}</div>
                <div className="price font-bold">Started With: <span className={dark ? "text-blue-400" : "text-blue-600"}>{selected?.price} EGP</span></div>
                <div className="quni">
                  <div className="quni font-semibold">
                    {selected?.con === 0
                      ? "Currently out of stock"
                      : selected && selected.con < 10
                      ? `Only ${selected.con} left in stock. Order soon.`
                      : `${selected?.con} units in stock, ready to ship`}
                  </div>
                </div>

              </div>
            </div>

            <div className="inputs w-full lg:w-[40%] lg:h-full flex flex-col gap-6 lg:gap-10 justify-between items-center">
              <div className="icons flex flex-col items-center gap-4 lg:gap-10 p-5 sm:p-8 lg:p-15 w-full">

                <div className="icons flex flex-row gap-5 p-2 sm:p-4">
                  <button aria-label="Visa" onClick={() => { setMethod("visa") }}
                    className={`text-4xl transition cursor-pointer ${method === "visa" ? "text-yellow-400" : dark ? "text-neutral-600" : "text-slate-300"}`}>
                    <FontAwesomeIcon icon={faCcVisa} />
                  </button>

                  <button aria-label="PayPal" onClick={() => setMethod("paypal")}
                    className={`text-4xl transition cursor-pointer ${method === "paypal" ? "text-blue-500" : dark ? "text-neutral-600" : "text-slate-300"}`}>
                    <FontAwesomeIcon icon={faPaypal} />
                  </button>

                  <button aria-label="Apple Pay" onClick={() => setMethod("applepay")}
                    className={`text-4xl transition cursor-pointer ${method === "applepay" ? (dark ? "text-white" : "text-black") : dark ? "text-neutral-600" : "text-slate-300"}`}>
                    <FontAwesomeIcon icon={faApplePay} />
                  </button>
                </div>

                <div className="fields w-full flex flex-col gap-3 px-0 sm:px-6">

                  {method === "visa" && (
                    <>
                      <input ref={name_visa} type="text" placeholder="Name on card" className={inputCls} />
                      <input ref={number_visa} type="text" inputMode="numeric" maxLength={19} placeholder="Card number" className={inputCls} />
                      <div className="flex gap-3">
                        <input ref={end_visa} type="text" placeholder="MM / YY" className={inputCls} />
                        <input ref={visa_pass} type="password" inputMode="numeric" maxLength={3} placeholder="CVV" className={inputCls} />
                      </div>
                    </>
                  )}

                  {method === "paypal" && (
                    <input ref={pay_pal} type="email" placeholder="PayPal email" className={inputCls} />
                  )}

                  {method === "applepay" && (
                    <input ref={apple_ref} type="tel" placeholder="Phone number linked to Apple Pay" className={inputCls} />
                  )}

                </div>

              </div>

              <div className="botts flex flex-row gap-3 sm:gap-10 font-semibold px-5 sm:px-8 lg:px-0 pb-8 lg:pb-15 w-full lg:w-auto justify-center">
                <button onClick={() => sendInfo(selected)} className={actionBtn}>
                  Buy Now
                </button>
                <button onClick={() => sendData(selected)} className={actionBtn}>
                  Save In Cart
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

function BoltMark({ dark }: { dark: boolean }) {
  return (
    <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${dark ? "bg-white" : "bg-black"}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={dark ? "black" : "white"} />
      </svg>
    </div>
  )
}