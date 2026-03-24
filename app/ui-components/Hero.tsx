

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BubblingBackground from './BubblingBackground';

export default function Hero() {
  return (
    <section className="relative overflow-hidden  min-h-[90vh] flex flex-col justify-center">
      {/* Antigravity Bubbles Background */}
      <BubblingBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 text-slate-200">
  Transform API responses into{' '}
  <span className="relative inline-block">
    <span className="relative z-10 bg-gradient-to-b from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
      beautiful visualizations
    </span>
    {/* Subtle glow underneath to make it pop against the black bg */}
    <span className="absolute inset-0 blur-2xl bg-slate-400/20 z-0"></span>
  </span>
</h1>
          </motion.div>
          
          {/* Subheadline */}
     {/* Subtitle Enhancement */}
<motion.p 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
  className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto px-4 font-medium"
>
  Test APIs and convert JSON into <span className="text-slate-200">interactive tree views, graphs, and tables</span> — <span className="text-indigo-400/90">all in your browser.</span>
</motion.p>

{/* CTA Button Enhancement */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
  className="flex items-center justify-center mb-12 sm:mb-20"
>
  <Link
    href="/app"
    className="group relative inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
  >
    {/* Animated Background Shine */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
    
    <span className="relative flex items-center gap-2">
      Start Testing APIs
      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
    </span>
  </Link>
</motion.div>
{/* App Preview */}
<motion.div 
  initial={{ opacity: 0, y: 40, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
  className="relative"
>
  <div className="relative">

    {/* Card */}
    <div className="relative z-10 rounded-[14px] overflow-hidden border "
      style={{
        boxShadow: `
          0 2px 4px rgba(0,0,0,0.04),
          0 6px 12px rgba(0,0,0,0.06),
          0 16px 32px rgba(0,0,0,0.07)
        `
      }}
    >
      <img src="hero/hero-preview.png" alt="ApiLens Dashboard Preview" className="w-full h-auto block" />
    </div>

    {/* Tight contact line — the key shadow */}
    <div className="absolute z-20 rounded-full"
      style={{ bottom: '-4px', left: '4%', right: '4%', height: '8px',
        background: 'rgba(10,20,40,0.28)', filter: 'blur(5px)' }}
    />
    {/* Mid spread */}
    <div className="absolute z-10 rounded-full"
      style={{ bottom: '-10px', left: '2%', right: '2%', height: '16px',
        background: 'rgba(10,20,40,0.14)', filter: 'blur(10px)' }}
    />
    {/* Left wing */}
    <div className="absolute z-0 rounded-full"
      style={{ bottom: '-14px', left: '-3%', width: '35%', height: '20px',
        background: 'rgba(10,20,40,0.10)', filter: 'blur(14px)' }}
    />
    {/* Right wing */}
    <div className="absolute z-0 rounded-full"
      style={{ bottom: '-14px', right: '-3%', width: '35%', height: '90px',
        background: 'rgba(10,20,40,0.10)', filter: 'blur(14px)' }}
    />
    {/* Far ambient */}
    <div className="absolute z-0 rounded-full"
      style={{ bottom: '-20px', left: '-5%', right: '-5%', height: '24px',
        background: 'rgba(10,20,40,0.05)', filter: 'blur(22px)' }}
    />

  </div>
</motion.div>

        </div>
      </div>
    </section>
  );
}