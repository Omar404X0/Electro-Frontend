'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faXmark, faCartShopping, faEnvelope, faArrowLeft, faLockOpen, faKey, faLock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation'
import { useState, useRef } from "react";
import type { MouseEvent } from "react";

const API_BASE_URL = "https://electro-backend-2dx5.onrender.com";

export default function ForgotPasswordPage() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [emil,setemil] =useState('')
  const email_ref = useRef<HTMLInputElement>(null)
  
  const new_pass_ref = useRef<HTMLInputElement>(null)
  const re_pass_ref = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function goTo(path: string, e?: MouseEvent) {
    e?.preventDefault()
    setMenuOpen(false)
    router.push(path)
  }

async function reset() {
  if (new_pass_ref.current && re_pass_ref.current) {
    const pass = new_pass_ref.current.value.trim();
    const rePass = re_pass_ref.current.value.trim();

    if (pass && rePass) {
      // 1. التحقق من تطابق كلمتي المرور في الفرونت إند أولاً
      if (pass !== rePass) {
        alert('Passwords do not match.');
        new_pass_ref.current.value = '';
        re_pass_ref.current.value = '';
        return;
      }

      try {
        // 2. إرسال البيانات للباك إند (نفس أسماء المفاتيح في Pydantic: emil و passord)
        const result = await fetch(`${API_BASE_URL}/forget/reset`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            'emil': emil,
            'passord': pass
          })
        });

        const res = await result.json();

        if (res.success === true) {
          alert(res.message);
          router.push('/login'); 
        } else {
          alert(res.message);
        }
      } catch (error) {
        console.error("Reset Error:", error);
        alert("Connection error with backend.");
      }
    }
  }
}

async  function handleSubmit() {
    if (email_ref.current && email_ref.current.value.trim() !== '') {
     const result= await fetch(`${API_BASE_URL}/forget`,
        {
            method:'POST',
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({'emil':email_ref.current.value})
        }
     )

     const res = await result.json()
     if(res === true){
        if(email_ref.current){
            setemil(email_ref.current.value)
        }
         setSent(true)
     }
     else{
        alert('Mail Not Found')
        router.push('/login')
     }
    }
  }

  const iconBtn = dark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"
  const navLink = dark ? "hover:text-white" : "hover:text-black"
  const labelCls = `text-xs font-medium ${dark ? "text-white/50" : "text-black/50"}`
  const iconInCls = `absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none ${dark ? "text-white/30" : "text-black/30"}`
  const inputCls = `w-full rounded-xl pl-11 pr-4 py-3 text-base outline-none border transition-colors ${
    dark
      ? "bg-white/5 border-white/10 text-white placeholder-white/35 focus:border-white/60 focus:bg-white/[0.07]"
      : "bg-slate-50 border-black/10 text-black placeholder-black/35 focus:border-black"
  }`
  const primaryBtn = `w-full py-3 rounded-xl font-semibold text-sm cursor-pointer transition-colors ${
    dark ? "bg-white text-black hover:bg-slate-200" : "bg-black text-white hover:bg-slate-800"
  }`
  const textBtn = `text-sm cursor-pointer transition-colors ${dark ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"}`

  return (
    <div className={`${dark ? "bg-neutral-950 text-white" : "bg-slate-50 text-black"} w-full min-h-dvh overflow-x-hidden transition-colors duration-300 flex flex-col`}>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-card { animation: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        dark ? "bg-black/80 backdrop-blur-md border-white/10 text-white" : "bg-white/80 backdrop-blur-md border-black/10 text-black"
      }`}>
        <div className="con w-full max-w-[1920px] mx-auto flex flex-row justify-between items-center px-3 sm:px-5 h-14 sm:h-16 gap-2">

          <div className="com flex flex-row items-center gap-2 sm:gap-3 min-w-0 cursor-pointer" onClick={() => router.push('/prodacts')}>
            <BoltMark dark={dark} />
            <div className="title font-extrabold text-lg sm:text-xl tracking-tight truncate">Electro</div>
          </div>

          <nav className={`hidden md:flex flex-row items-center gap-4 lg:gap-8 text-sm font-medium ${dark ? "text-white/70" : "text-black/60"}`}>
          
          </nav>

          <div className="icons flex flex-row items-center gap-4 sm:gap-5 shrink-0">
            <button aria-label="Toggle theme" onClick={() => setDark(!dark)} className={`transition-colors cursor-pointer p-1 ${iconBtn}`}>
              <FontAwesomeIcon icon={dark ? faSun : faMoon} />
            </button>

            <button aria-label="Cart" onClick={() => router.push('/cart')} className={`relative transition-colors cursor-pointer p-1 ${iconBtn}`}>
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
          <nav className={`md:hidden flex flex-col gap-1 px-4 sm:px-5 pb-4 text-sm font-medium ${dark ? "text-white/70" : "text-black/60"}`}>
           
          </nav>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 relative">

        {/* soft glow */}
        <div className={`pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] ${dark ? "bg-white opacity-[0.05]" : "bg-black opacity-[0.04]"}`} />

        <div
          className={`anim-card relative w-full max-w-md rounded-3xl p-7 sm:p-10 shadow-xl ${dark ? "bg-neutral-900 border border-white/10" : "bg-white border border-black/5"}`}
          style={{ animation: 'cardIn 0.5s ease-out backwards' }}
        >

          {!sent ? (
            <>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
                <FontAwesomeIcon icon={faLockOpen} className="text-xl" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Forgot your password?</h1>
              <p className={`text-sm mb-7 ${dark ? "text-white/50" : "text-black/50"}`}>
                No worries. Enter the email linked to your account and we'll send you a 6-digit code to reset it.
              </p>

              <div className="flex flex-col gap-1.5 mb-5">
                <span className={labelCls}>Email</span>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className={iconInCls} />
                  <input
                    ref={email_ref}
                    type="email"
                    placeholder="you@example.com"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                    className={inputCls}
                  />
                </div>
              </div>

              <button onClick={handleSubmit} className={primaryBtn}>
                Send code
              </button>

              <button
                onClick={() => router.push('/login')}
                className={`mt-5 w-full flex items-center justify-center gap-2 ${textBtn}`}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                Back to log in
              </button>
            </>
          ) : (
            <>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
                <FontAwesomeIcon icon={faKey} className="text-xl" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Reset your password</h1>
              <p className={`text-sm mb-7 ${dark ? "text-white/50" : "text-black/50"}`}>
                Enter New Password 
              </p>

              <div className="flex flex-col gap-4 mb-5">

                {/* New password */}
                <div className="flex flex-col gap-1.5">
                  <span className={labelCls}>New password</span>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className={iconInCls} />
                    <input
                      ref={new_pass_ref}
                      type="password"
                      placeholder="••••••••"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Rewrite new password */}
                <div className="flex flex-col gap-1.5">
                  <span className={labelCls}>Confirm new password</span>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className={iconInCls} />
                    <input
                      ref={re_pass_ref}
                      type="password"
                      placeholder="••••••••"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => reset()}
                className={primaryBtn}
              >
                Reset password
              </button>

              <div className="mt-5 flex flex-col items-center gap-3">
                <button onClick={() => setSent(false)} className={textBtn}>
                  Didn't get it? Try again
                </button>

                <button
                  onClick={() => router.push('/login')}
                  className={`flex items-center justify-center gap-2 ${textBtn}`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                  Back to log in
                </button>
              </div>
            </>
          )}
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