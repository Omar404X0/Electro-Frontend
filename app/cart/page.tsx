'use client'
import { useEffect, useState } from "react"
import type { MouseEvent } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faXmark, faMagnifyingGlass, faHome, faTrash, faMinus, faPlus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation'


const API_BASE_URL = "https://electro-backend-2dx5.onrender.com";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
}

export default function CartPage() {

  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [items, setItems] = useState<CartItem[] | null>(null)
  const router = useRouter()

  /* ---------------- Navigation ---------------- */
  function goTo(path: string, e?: MouseEvent) {
    e?.preventDefault()
    setMenuOpen(false)
    router.push(path)
  }

  function sendtoHome() {
    router.push('/prodacts')
  }

  // getpro
  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch(`${API_BASE_URL}/cart?token=${token}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log('Error', err))
  }, [])

  // Close the mobile menu automatically when moving up to desktop width
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (items === null) {
    return <div className="text-center items-center text-xl sm:text-2xl lg:text-3xl font-semibold py-20 px-4">Loading your cart... ⏳</div>;
  }

  function increase(id: number) {
    if (items === null) return;
    setItems(items.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
  }

  function decrease(id: number) {
    if (items === null) return;
    setItems(items.map(i => i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i))
  }

  async function checkout() {
    if (items === null || items.length === 0) return
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_BASE_URL}/cart/checkout`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          items: items.map(i => ({ id: i.id, quantity: i.quantity }))
        })
      })
      const data = await res.json()

      if (data === true) {
        setItems([])
        router.push('/purchases')
      } else {
        alert(data?.error ?? 'Checkout failed')
      }
    } catch {
      alert('Server error, try again')
    }
  }

  async function remove(id: number) {
    if (items === null) return;
    const token = localStorage.getItem('token')

    setItems(items.filter(i => i.id !== id))

    const res = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 'token': token, 'id': id })
    })

    const data = await res.json()
    console.log(data)
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const iconBtn = dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"
  const navLink = dark ? "hover:text-white" : "hover:text-black"

  return (
    <div className={`${dark ? "bg-neutral-950 text-white" : "bg-slate-50 text-black"} w-full min-h-dvh overflow-x-hidden transition-colors duration-300`}>

      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        dark ? "bg-black/80 items-center justify-center backdrop-blur-md border-white/10 text-white" : "bg-white/80 backdrop-blur-md  border-black/10 text-black"
      }`}>
        <div className="con w-full max-w-[1920px] mx-auto flex flex-row justify-between items-center px-3 sm:px-5 h-14 sm:h-16 gap-2">

          <div className="com flex flex-row items-center gap-2 sm:gap-3 min-w-0">
            <BoltMark dark={dark} />
            <div className="title font-extrabold text-lg sm:text-xl tracking-tight truncate">Electro</div>
          </div>

          <nav className={`hidden md:flex flex-row items-center gap-4 lg:gap-8 text-sm font-medium ${dark ? "text-white/70" : "text-black/60"}`}>
            <a href="/prodacts" onClick={(e) => goTo('/prodacts', e)} className={`transition-colors ${navLink}`}>Shop</a>
            <a href="/purchases" onClick={(e) => goTo('/purchases', e)} className={`transition-colors whitespace-nowrap ${navLink}`}>My Purchases</a>
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

            <button aria-label="Home" onClick={() => sendtoHome()} className={`transition-colors cursor-pointer p-1 ${iconBtn}`}>
              <FontAwesomeIcon icon={faHome} />
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
            <a href="/purchases" onClick={(e) => goTo('/purchases', e)} className={`py-3 transition-colors ${navLink}`}>My Purchases</a>
            <a href="/support" onClick={(e) => goTo('/support', e)} className={`py-3 transition-colors ${navLink}`}>Support</a>
          </nav>
        )}
      </header>

      <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-5 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-8">Your Cart</h1>

        {items?.length === 0 ? (
          <div className={`flex flex-col items-center justify-center text-center px-4 py-14 sm:py-24 rounded-3xl ${dark ? "bg-neutral-900" : "bg-white"}`}>
            <FontAwesomeIcon icon={faCartShopping} className={`text-4xl sm:text-5xl mb-4 ${dark ? "text-white/20" : "text-black/15"}`} />
            <p className={`text-base sm:text-lg font-semibold ${dark ? "text-white/70" : "text-black/60"}`}>Your cart is empty</p>
            <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-black/40"}`}>Items you add will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

            {/* Items list */}
            <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 min-w-0">
              {items?.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-row flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 p-3 sm:p-4 rounded-2xl shadow-sm transition-colors duration-300 ${
                    dark ? "bg-neutral-900" : "bg-white"
                  }`}
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${dark ? "bg-neutral-800" : "bg-slate-50"}`}>
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base break-words">{item.name}</div>
                    <div className={`text-sm mt-1 ${dark ? "text-blue-400" : "text-blue-600"}`}>
                      {item.price.toLocaleString()} EGP
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between sm:justify-start gap-3 sm:gap-5 w-full sm:w-auto">
                    <div className={`flex flex-row items-center gap-3 rounded-full px-3 py-2 ${dark ? "bg-neutral-800" : "bg-slate-100"}`}>
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => decrease(item.id)}
                        className={`w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors cursor-pointer ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                      >
                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                      </button>
                      <span className="text-sm font-medium min-w-4 text-center">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => increase(item.id)}
                        className={`w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors cursor-pointer ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                      </button>
                    </div>

                    <button
                      aria-label="Remove item"
                      onClick={() => remove(item.id)}
                      className={`p-2 transition-colors cursor-pointer ${dark ? "text-white/40 hover:text-red-400" : "text-black/30 hover:text-red-500"}`}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className={`h-fit lg:sticky lg:top-24 p-4 sm:p-6 rounded-2xl flex flex-col gap-4 ${dark ? "bg-neutral-900" : "bg-white"}`}>
              <h2 className="font-bold text-lg">Order Summary</h2>

              <div className="flex flex-col gap-2 text-sm">
                <div className={`flex justify-between gap-3 ${dark ? "text-white/60" : "text-black/60"}`}>
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} EGP</span>
                </div>
                <div className={`flex justify-between gap-3 ${dark ? "text-white/60" : "text-black/60"}`}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className={`h-px my-1 ${dark ? "bg-white/10" : "bg-black/10"}`} />

              <div className="flex justify-between gap-3 font-bold text-base">
                <span>Total</span>
                <span>{subtotal.toLocaleString()} EGP</span>
              </div>

              <button
                onClick={checkout}
                className={`mt-2 py-3 rounded-xl font-semibold transition-colors cursor-pointer ${
                  dark ? "bg-white text-black hover:bg-slate-200" : "bg-black text-white hover:bg-slate-800"
                }`}
              >
                Checkout
              </button>
            </div>
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