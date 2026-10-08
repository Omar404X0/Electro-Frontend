'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faXmark, faMagnifyingGlass, faCartShopping, faFire, faClock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react";

type Deal = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  img: string;
  tag?: string;
}

const dummyDeals: Deal[] = [
  { id: 1, name: "IPhone 18 Pro Max", price: 109800, oldPrice: 122000, img: "/apple.webp", tag: "Hot" },
  { id: 2, name: "Samsung Galaxy S26 Ultra", price: 67999, oldPrice: 79999, img: "/samsung.webp", tag: "Limited" },
  { id: 3, name: "MacBook Air M4", price: 59800, oldPrice: 68000, img: "/mac1.png" },
  { id: 4, name: "Apple Watch Series 11", price: 17200, oldPrice: 21500, img: "/Apple-Watch.webp" },
  { id: 5, name: "Samsung Galaxy Tab S11", price: 35700, oldPrice: 42000, img: "/tap1.webp", tag: "Hot" },
  { id: 6, name: "Smart TV LG 65-inch 4K", price: 28800, oldPrice: 36000, img: "/lg1.avif" },
]

export default function DealsPage() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  function sendTocart() {
    router.push('/cart')
  }

  function discountPercent(d: Deal) {
    return Math.round(((d.oldPrice - d.price) / d.oldPrice) * 100)
  }
 function rout_to_purchases(){
  const token = localStorage.getItem('token')
    router.push('/purchases')

  }

  return (
    <div className={`${dark ? "bg-neutral-950 text-white" : "bg-slate-50 text-black"} w-full min-h-screen overflow-x-hidden transition-colors duration-300`}>

      {/* Header */}
      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        dark ? "bg-black/80 backdrop-blur-md border-white/10 text-white" : "bg-white/80 backdrop-blur-md border-black/10 text-black"
      }`}>
        <div className="con w-full flex flex-row justify-between items-center px-5 h-16">

          <div className="com flex flex-row items-center gap-3">
            <BoltMark dark={dark} />
            <div className="title font-extrabold text-xl tracking-tight">Electro</div>
          </div>

          <nav className={`hidden md:flex flex-row items-center gap-8 text-sm font-medium ${dark ? "text-white/70" : "text-black/60"}`}>
            <a href="/prodacts" className={`transition-colors ${dark ? "hover:text-white" : "hover:text-black"}`}>Shop</a>
            <a href="#" className={dark ? "text-white" : "text-black"}>Deals</a>
            <a onClick={()=> rout_to_purchases()} href="#" className={`transition-colors ${dark ? "hover:text-white" : "hover:text-black"}`}>My Purchases</a>
            <a href="#" className={`transition-colors ${dark ? "hover:text-white" : "hover:text-black"}`}>Support</a>
          </nav>

          <div className="icons flex flex-row items-center gap-5">
            <button className={`hidden sm:flex transition-colors cursor-pointer ${dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"}`}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <button
              onClick={() => setDark(!dark)}
              className={`transition-colors cursor-pointer ${dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"}`}
            >
              <FontAwesomeIcon icon={dark ? faSun : faMoon} />
            </button>

            <button onClick={() => sendTocart()} className={`relative transition-colors cursor-pointer ${dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"}`}>
              <FontAwesomeIcon icon={faCartShopping} />
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden transition-colors cursor-pointer ${dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"}`}
            >
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={`md:hidden flex flex-col gap-1 px-5 pb-4 text-sm font-medium ${dark ? "text-white/70" : "text-black/60"}`}>
            <a href="/prodacts" className={`py-2 transition-colors ${dark ? "hover:text-white" : "hover:text-black"}`}>Shop</a>
            <a href="#" className="py-2">Deals</a>
            <a href="#" className={`py-2 transition-colors ${dark ? "hover:text-white" : "hover:text-black"}`}>New Arrivals</a>
            <a href="#" className={`py-2 transition-colors ${dark ? "hover:text-white" : "hover:text-black"}`}>Support</a>
          </nav>
        )}
      </header>

      
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-10 text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5 ${dark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
          <FontAwesomeIcon icon={faFire} />
          Today's Deals
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">Save big on the gear you want.</h1>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${dark ? "text-white/50" : "text-black/50"}`}>
          Limited-time prices on our most popular devices — while stock lasts.
        </p>
      </div>

      {/* Deals grid */}
      <div className="max-w-6xl mx-auto px-5 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyDeals.map((d) => (
          <div
            key={d.id}
            className={`relative flex flex-col p-5 gap-4 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${
              dark ? "bg-neutral-900" : "bg-white"
            }`}
          >
            {d.tag && (
              <span className={`absolute top-4 left-4 text-[10px] font-bold px-2 py-1 rounded-full ${
                dark ? "bg-white text-black" : "bg-black text-white"
              }`}>
                {d.tag.toUpperCase()}
              </span>
            )}

            <span className="absolute top-4 right-4 text-[11px] font-bold px-2 py-1 rounded-full bg-red-500 text-white">
              -{discountPercent(d)}%
            </span>

            <div className={`h-52 w-full rounded-2xl overflow-hidden flex items-center justify-center p-4 ${dark ? "bg-neutral-800" : "bg-slate-50"}`}>
              <img className="w-full h-full object-contain" src={d.img} alt={d.name} />
            </div>

            <div className="font-bold text-lg">{d.name}</div>

            <div className="flex items-center gap-2">
              <span className={`font-bold ${dark ? "text-blue-400" : "text-blue-600"}`}>
                {d.price.toLocaleString()} EGP
              </span>
              <span className={`text-sm line-through ${dark ? "text-white/30" : "text-black/30"}`}>
                {d.oldPrice.toLocaleString()}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 text-xs ${dark ? "text-white/40" : "text-black/40"}`}>
              <FontAwesomeIcon icon={faClock} />
              Offer ends soon
            </div>

            <button
            
              className={`mt-auto px-6 h-10 rounded-full font-medium cursor-pointer transition-all duration-300 ${
                dark ? "bg-white text-black hover:bg-slate-200" : "bg-black text-white hover:bg-slate-700"
              }`}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function BoltMark({ dark }: { dark: boolean }) {
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? "bg-white" : "bg-black"}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={dark ? "black" : "white"} />
      </svg>
    </div>
  )
}