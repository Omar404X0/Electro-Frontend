'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faXmark, faMagnifyingGlass, faCartShopping, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

const API_BASE_URL = "https://electro-backend-2dx5.onrender.com";

type PurchaseItem = {
  id: number;
  img: string;
  name: string;
  price: number;
  pro_id: number;
  quantity: number;
  user_id: number;
}

export default function PurchasesPage() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const [item, setitem] = useState<PurchaseItem[] | null>(null)

  /* ---------------- Navigation ---------------- */
  // e.preventDefault() بيمنع الـ href="#" من إنه يرجّع الصفحة لفوق أو يضيف # في الرابط
  function goTo(path: string, e?: MouseEvent) {
    e?.preventDefault()
    setMenuOpen(false)
    router.push(path)
  }

  function sendTocart() {
    router.push('/cart')
  }

  // لو المستخدم ضغط على My Purchases وهو أصلاً فيها: منعمل حاجة غير إننا نقفل المنيو
  function stay(e: MouseEvent) {
    e.preventDefault()
    setMenuOpen(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API_BASE_URL}/purchases?token=${token}`).
      then((result) => result.json()).
      then((data) => setitem(data)).
      catch((err) => console.log('Error'))
  }, [])

  // Close the mobile menu automatically when moving up to desktop width
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const iconBtn = dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"
  const navLink = dark ? "hover:text-white" : "hover:text-black"
  const activeLink = dark ? "text-white font-bold" : "text-black font-bold"

  return (
    <div className={`${dark ? "bg-neutral-950 text-white" : "bg-slate-50 text-black"} w-full min-h-dvh overflow-x-hidden transition-colors duration-300`}>

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
            <a href="/prodacts" onClick={(e) => goTo('/prodacts', e)} className={`transition-colors ${navLink}`}>Shop</a>
            
            <a href="/purchases" onClick={stay} className={`whitespace-nowrap ${activeLink}`}>My Purchases</a>
            <a href="/support" onClick={(e) => goTo('/support', e)} className={`transition-colors ${navLink}`}>Support</a>
          </nav>

          <div className="icons flex flex-row items-center gap-4 sm:gap-5 shrink-0">
            <button aria-label="Search" className={`hidden sm:flex transition-colors cursor-pointer ${iconBtn}`}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
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
            </button>

            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden transition-colors cursor-pointer p-1 w-5 ${iconBtn}`}
            >
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={`md:hidden flex flex-col gap-1 px-4 sm:px-5 pb-4 text-sm font-medium max-h-[70dvh] overflow-y-auto ${dark ? "text-white/70" : "text-black/60"}`}>
            <a href="/prodacts" onClick={(e) => goTo('/prodacts', e)} className={`py-3 transition-colors ${navLink}`}>Shop</a>
            
            <a href="/purchases" onClick={stay} className={`py-3 ${activeLink}`}>My Purchases</a>
            <a href="/support" onClick={(e) => goTo('/support', e)} className={`py-3 transition-colors ${navLink}`}>Support</a>
          </nav>
        )}
      </header>

      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-5 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Purchases</h1>
        <p className={`text-sm mb-6 sm:mb-8 ${dark ? "text-white/50" : "text-black/50"}`}>
          A history of everything you've bought from Electro.
        </p>

        {item === null ? (
          <div className="text-center text-lg sm:text-xl font-semibold py-16 sm:py-20 px-4">Loading your purchases... ⏳</div>
        ) : item.length === 0 ? (
          <div className={`flex flex-col items-center justify-center text-center px-4 py-14 sm:py-24 rounded-3xl ${dark ? "bg-neutral-900" : "bg-white"}`}>
            <FontAwesomeIcon icon={faReceipt} className={`text-4xl sm:text-5xl mb-4 ${dark ? "text-white/20" : "text-black/15"}`} />
            <p className={`text-base sm:text-lg font-semibold ${dark ? "text-white/70" : "text-black/60"}`}>No purchases yet</p>
            <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-black/40"}`}>Items you buy will show up here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {item.map((p) => (
              <div
                key={p.id}
                className={`flex flex-row flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 p-3 sm:p-5 rounded-2xl shadow-sm transition-colors duration-300 ${
                  dark ? "bg-neutral-900" : "bg-white"
                }`}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${dark ? "bg-neutral-800" : "bg-slate-50"}`}>
                  <img src={p.img} alt={p.name} className="w-full h-full object-contain p-2" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base break-words">{p.name}</div>
                  <div className={`text-xs mt-1 ${dark ? "text-white/40" : "text-black/40"}`}>
                    Quantity: {p.quantity}
                  </div>
                </div>

                <div className={`font-bold text-sm w-full sm:w-auto text-end ${dark ? "text-blue-400" : "text-blue-600"}`}>
                  {p.price.toLocaleString()} EGP
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
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