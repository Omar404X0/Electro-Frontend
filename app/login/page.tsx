'use client'
import React, { useState ,useEffect,useRef } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE_URL = "https://electro-backend-2dx5.onrender.com";

type user ={
    name:string,
    emil:string,
    password:string
    is_admin:Boolean
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const emailRef= useRef<HTMLInputElement>(null)
  const passwordRef= useRef<HTMLInputElement>(null)
  const nameRef= useRef<HTMLInputElement>(null)
  const router = useRouter()

 async function savedata() {
    if (mode === 'login'){
        if (emailRef.current && passwordRef.current){
            if(emailRef.current.value != '' && passwordRef.current.value !='') {
              localStorage.clear()
              const result = await fetch(`${API_BASE_URL}/login`, {
                method:'POST',
                headers:{ "Content-Type": "application/json" },
                body:JSON.stringify({
                    emil: emailRef.current.value,
                    password: passwordRef.current.value
                })
              })
              const data = await result.json() 

              if(data){
                localStorage.setItem('token' ,data.token)
                router.push('/prodacts')
              }
              else {
                passwordRef.current.value=''
                emailRef.current.value=''
                alert('Password Or Email Is Wrong')
              }
            }
        }
    }
    else if (mode === 'signup'){
        if (emailRef.current && passwordRef.current&& nameRef.current){
            if(emailRef.current.value != '' && passwordRef.current.value !='' && nameRef.current.value !=''){
              localStorage.clear()
              const result =  await fetch(`${API_BASE_URL}/signup`,{
                method:'POST',
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({
                   emil: emailRef.current.value,
                  password: passwordRef.current.value,
                  name:nameRef.current.value
                })
              })
              const data=await result.json()
              if (data){
                localStorage.setItem('token',data.token)
                router.push('/prodacts')
              }
              else{
                console.log('Error')
              }
            }
        }
    }
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white opacity-[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white opacity-[0.05] blur-[120px]" />

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-[28px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] border border-white/20 bg-[#131313] ring-1 ring-white/5">
        {/* Left: brand / pulse panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#1C1C1C] via-[#161616] to-[#0E0E0E] p-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <BoltMark />
              <span className="text-white text-xl font-semibold tracking-tight">Electro</span>
            </div>
          </div>

          <div className="my-auto">
            <PulseLine />
            <h2 className="text-white text-3xl font-semibold leading-snug mt-8 max-w-xs">
              Power your gear.<br />Track every watt.
            </h2>
            <p className="text-white/50 text-sm mt-3 max-w-xs">
              Monitor usage, manage devices, and keep your workshop running — all from one place.
            </p>
          </div>

          <p className="text-white/30 text-xs">© {new Date().getFullYear()} Electro Inc.</p>
        </div>

        <div className="bg-[#161616] p-8 sm:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <BoltMark />
            <span className="text-white text-lg font-semibold tracking-tight">Electro</span>
          </div>

          <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                mode === 'login' ? 'bg-white text-black font-medium' : 'text-white/50'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                mode === 'signup' ? 'bg-white text-black font-medium' : 'text-white/50'
              }`}
            >
              Sign up
            </button>
          </div>

          <h1 className="text-white text-2xl font-semibold mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-white/50 text-sm mb-7">
            {mode === 'login' ? 'Log in to continue to your dashboard.' : 'Start monitoring your devices in minutes.'}
          </p>

          <div className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <span className="text-white/50 text-xs font-medium">Name</span>
                <input
                ref={nameRef}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/35 text-sm outline-none focus:border-white/60 focus:bg-white/[0.07] transition-colors"
                  type="text"
                  name="name"
                  placeholder="Your name"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <span className="text-white/50 text-xs font-medium">Email</span>
              <input
              ref={emailRef}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/35 text-sm outline-none focus:border-white/60 focus:bg-white/[0.07] transition-colors"
                type="email"
                name="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-white/50 text-xs font-medium">Password</span>
              <input
              ref={passwordRef}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/35 text-sm outline-none focus:border-white/60 focus:bg-white/[0.07] transition-colors"
                type="password"
                name="password"
                placeholder="••••••••"
              />
            </div>

            {mode === 'login' && (
              <button onClick={()=> router.push('/forget')} type="button" className= "text-white/60 cursor-pointer text-xs text-right hover:text-white transition-colors -mt-2">
                Forgot password?
              </button>
            )}

            <button
            onClick={()=> savedata()}
              type="button"
              className="mt-2 bg-white text-black text-sm font-medium rounded-xl py-3 hover:bg-white/90 transition-colors shadow-[0_10px_30px_-10px_rgba(255,255,255,0.25)]"
            >
              {mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-white/15 flex-1" />
            <span className="text-white/40 text-xs">or continue with</span>
            <div className="h-px bg-white/15 flex-1" />
          </div>

          <button className="flex items-center justify-center gap-2 border border-white/10 rounded-xl py-3 text-white text-sm hover:bg-white/5 transition-colors">
            <GoogleMark />
            Google
          </button>
        </div>
      </div>
    </div>
  )
}

function BoltMark() {
  return (
    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="black" />
      </svg>
    </div>
  )
}

function PulseLine() {
  return (
    <svg width="220" height="48" viewBox="0 0 220 48" fill="none">
      <path
        d="M0 24 H60 L72 6 L86 42 L98 24 H140 L150 12 L160 24 H220"
        stroke="url(#pulse)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="pulse" x1="0" y1="0" x2="220" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.48a5.55 5.55 0 0 1-2.4 3.64v3h3.88c2.28-2.1 3.56-5.2 3.56-8.83z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.31A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.58.38-2.31v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.78 1.28 5.41l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.59l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
    </svg>
  )
}