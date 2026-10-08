'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon, faSun, faBars, faXmark, faMagnifyingGlass, faCartShopping,
  faPhone, faEnvelope, faComments, faChevronDown, faClock, faCircleCheck, faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react";
import GenerateButton from '@/app/components/GenerateButton'
import Form from '@/app/components/Form'

/* ------------------------------------------------------------------ */
/*  ✏️  CONTENT — غيّر القيم دي بس وباقي الصفحة هتتحدث لوحدها          */
/* ------------------------------------------------------------------ */
const SUPPORT = {
  phone: "01280403995",
  phoneLink: "+201280403995",             // الصيغة الدولية للاتصال
  whatsapp: "201280403995",               // مصر 20 + الرقم بدون الصفر
  email: "elamllahomar24@gmail.com",
  hours: "Daily, 10:00 AM – 10:00 PM",
  responseTime: "We reply within 24 hours",
}

const FAQS: { q: string; a: string }[] = [
  {
    q: "How long does shipping take?",
    a: "Orders inside Cairo and Giza usually arrive within 1–3 business days. Other governorates take 3–5 business days. You will get a call from the courier before delivery.",
  },
  {
    q: "What is your return policy?",
    a: "You can return a product within 14 days of receiving it, as long as it is unused, in its original box, and with all accessories. Contact us with your order number and we will arrange the pickup.",
  },
  {
    q: "Do the products come with a warranty?",
    a: "Yes. Every product comes with an official warranty from the manufacturer or the authorized agent in Egypt. The warranty duration is shown on the product page and covers manufacturing defects.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept Visa cards, PayPal, and Apple Pay. Choose your method in the Buy Now window when you place the order.",
  },
  {
    q: "How can I track my order?",
    a: "Open My Purchases from the top menu to see every order you placed and its current status. If something looks wrong, send us the order number.",
  },
  {
    q: "Can I cancel or change my order?",
    a: "You can cancel or change an order before it is shipped. Contact us as soon as possible by phone or WhatsApp with your order number.",
  },
  {
    q: "What if my product arrives damaged or faulty?",
    a: "Please contact us within 48 hours of delivery with photos of the product and the box. We will replace it or refund you after checking the issue.",
  },
]

const SUBJECTS = ["Order issue", "Payment problem", "Return or refund", "Warranty", "Other"]

const API = "https://electro-backend-2dx5.onrender.com"

type Status = "idle" | "sending" | "success" | "error"

export default function SupportPage() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chat, setchat] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [status, setStatus] = useState<Status>("idle")
  const [fields, setFields] = useState({ name: "", email: "", order: "", subject: SUBJECTS[0], message: "" })
  const router = useRouter()

  function go(path: string) {
    setMenuOpen(false)
    router.push(path)
  }

  function setField(key: keyof typeof fields, value: string) {
    setFields(f => ({ ...f, [key]: value }))
    if (status !== "idle" && status !== "sending") setStatus("idle")
  }

  async function submitTicket() {
    if (status === "sending") return
    if (!fields.name.trim() || !fields.email.trim() || !fields.message.trim()) {
      setStatus("error")
      return
    }
    setStatus("sending")
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/support/ticket`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...fields })
      })
      if (!res.ok) throw new Error("failed")
      setStatus("success")
      setFields({ name: "", email: "", order: "", subject: SUBJECTS[0], message: "" })
    } catch {
      setStatus("error")
    }
  }

  // Close the mobile menu automatically when moving up to desktop width
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const iconBtn = dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"
  const navLink = dark ? "hover:text-white" : "hover:text-black"
  const card = dark ? "bg-neutral-900" : "bg-white"
  const muted = dark ? "text-white/60" : "text-black/60"
  const inputCls = `rounded-xl p-3 w-full min-w-0 text-base outline-none border ${dark ? "bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-white" : "border-slate-300 focus:border-black"}`

  const contacts = [
    { icon: faPhone, title: "Call us", value: SUPPORT.phone, href: `tel:${SUPPORT.phoneLink}` },
    { icon: faWhatsapp, title: "WhatsApp", value: "Chat on WhatsApp", href: `https://wa.me/${SUPPORT.whatsapp}` },
    { icon: faEnvelope, title: "Email", value: SUPPORT.email, href: `mailto:${SUPPORT.email}` },
    { icon: faComments, title: "Electro AI", value: "Ask our assistant", onClick: () => setchat(true) },
  ]

  return (
    <div className={`${dark ? "bg-neutral-950 text-white" : "bg-slate-50 text-black"} w-full min-h-dvh overflow-x-hidden transition-colors duration-300`}>

      {/* Header (same as Home) */}
      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        dark ? "bg-black/80 backdrop-blur-md border-white/10 text-white" : "bg-white/80 backdrop-blur-md border-black/10 text-black"
      }`}>
        <div className="con w-full max-w-[1920px] mx-auto flex flex-row justify-between items-center px-3 sm:px-5 h-14 sm:h-16 gap-2">

          <div className="com flex flex-row items-center gap-2 sm:gap-3 min-w-0">
            <BoltMark dark={dark} />
            <div className="title font-extrabold text-lg sm:text-xl tracking-tight truncate">Electro</div>
          </div>

          <nav className={`hidden md:flex flex-row items-center gap-4 lg:gap-8 text-sm font-medium ${dark ? "text-white/70" : "text-black/60"}`}>
            <a onClick={() => go('/prodacts')} href="#" className={`transition-colors ${navLink}`}>Shop</a>
            
            <a onClick={() => go('/purchases')} href="#" className={`transition-colors whitespace-nowrap ${navLink}`}>My Purchases</a>
            <a href="#" className={`transition-colors font-bold ${dark ? "text-white" : "text-black"}`}>Support</a>
            <GenerateButton onClick={() => setchat(true)}></GenerateButton>
          </nav>

          <div className="icons flex flex-row items-center gap-4 sm:gap-5 shrink-0">
            <button aria-label="Search" className={`hidden sm:flex transition-colors cursor-pointer ${iconBtn}`}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <button aria-label="Toggle theme" onClick={() => setDark(!dark)} className={`transition-colors cursor-pointer p-1 ${iconBtn}`}>
              <FontAwesomeIcon icon={dark ? faSun : faMoon} />
            </button>

            <button aria-label="Cart" onClick={() => go('/cart')} className={`relative transition-colors cursor-pointer p-1 ${iconBtn}`}>
              <FontAwesomeIcon icon={faCartShopping} />
              <span className={`absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                dark ? "bg-white text-black" : "bg-black text-white"
              }`}>
                2
              </span>
            </button>

            <button aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden transition-colors cursor-pointer p-1 w-5 ${iconBtn}`}>
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={`md:hidden flex flex-col gap-1 px-4 sm:px-5 pb-4 text-sm font-medium max-h-[70dvh] overflow-y-auto ${dark ? "text-white/70" : "text-black/60"}`}>
            <a href="#" onClick={() => go('/prodacts')} className={`py-3 transition-colors ${navLink}`}>Shop</a>
            
            <a href="#" onClick={() => go('/purchases')} className={`py-3 transition-colors ${navLink}`}>My Purchases</a>
            <a href="#" onClick={() => setMenuOpen(false)} className={`py-3 transition-colors font-bold ${dark ? "text-white" : "text-black"}`}>Support</a>
            <div className="pt-2">
              <GenerateButton onClick={() => { setMenuOpen(false); setchat(true) }}></GenerateButton>
            </div>
          </nav>
        )}
      </header>

      {chat && <Form setChat={setchat} />}

      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-12 lg:py-16">

        {/* Title */}
        <div className="flex flex-col items-start gap-2 sm:gap-3 mb-8 sm:mb-12 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">How can we help?</h1>
          <p className={`text-sm sm:text-base ${muted}`}>
            Find a quick answer below, or reach our team directly. {SUPPORT.responseTime}.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {contacts.map((c) => {
            const inner = (
              <>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
                  <FontAwesomeIcon icon={c.icon} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold">{c.title}</div>
                  <div className={`text-sm mt-0.5 break-words ${dark ? "text-blue-400" : "text-blue-600"}`}>{c.value}</div>
                </div>
              </>
            )
            const cls = `flex flex-row items-center gap-4 p-4 sm:p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-start cursor-pointer ${card}`
            return c.href ? (
              <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>{inner}</a>
            ) : (
              <button key={c.title} onClick={c.onClick} className={cls}>{inner}</button>
            )
          })}
        </div>

        <div className={`flex flex-row items-center gap-3 mt-4 sm:mt-6 text-sm ${muted}`}>
          <FontAwesomeIcon icon={faClock} />
          <span>{SUPPORT.hours}</span>
        </div>

        {/* FAQ + Ticket form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 mt-10 sm:mt-14">

          {/* FAQ */}
          <section className="lg:col-span-3 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Frequently asked questions</h2>
            <div className="flex flex-col gap-3">
              {FAQS.map((f, i) => {
                const open = openFaq === i
                return (
                  <div key={f.q} className={`rounded-2xl shadow-sm overflow-hidden transition-colors duration-300 ${card}`}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="w-full flex flex-row items-center justify-between gap-4 p-4 sm:p-5 text-start font-semibold text-sm sm:text-base cursor-pointer"
                    >
                      <span className="min-w-0 break-words">{f.q}</span>
                      <FontAwesomeIcon icon={faChevronDown} className={`shrink-0 text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <p className={`px-4 sm:px-5 pb-4 sm:pb-5 text-sm leading-relaxed ${muted}`}>{f.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Ticket form */}
          <section className={`lg:col-span-2 h-fit lg:sticky lg:top-24 p-4 sm:p-6 rounded-3xl shadow-xl flex flex-col gap-3 ${card}`}>
            <h2 className="text-xl sm:text-2xl font-bold">Send us a message</h2>

            <input value={fields.name} onChange={(e) => setField("name", e.target.value)} type="text" placeholder="Your name" className={inputCls} />
            <input value={fields.email} onChange={(e) => setField("email", e.target.value)} type="email" placeholder="Email" className={inputCls} />
            <input value={fields.order} onChange={(e) => setField("order", e.target.value)} type="text" placeholder="Order number (optional)" className={inputCls} />
            <select value={fields.subject} onChange={(e) => setField("subject", e.target.value)} className={`${inputCls} cursor-pointer`}>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <textarea value={fields.message} onChange={(e) => setField("message", e.target.value)} rows={5} placeholder="How can we help?" className={`${inputCls} resize-none`} />

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>Please fill in your name, email and message, then try again.</span>
              </div>
            )}
            {status === "success" && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <FontAwesomeIcon icon={faCircleCheck} />
                <span>Message sent. {SUPPORT.responseTime}.</span>
              </div>
            )}

            <button
              onClick={submitTicket}
              disabled={status === "sending"}
              className={`mt-1 py-3 rounded-xl font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                dark ? "bg-white text-black hover:bg-slate-200" : "bg-black text-white hover:bg-slate-800"
              }`}
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
          </section>
        </div>
      </main>
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