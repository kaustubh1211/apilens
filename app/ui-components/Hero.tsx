

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BubblingBackground from './BubblingBackground';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 min-h-[90vh] flex flex-col justify-center">
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
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 text-slate-900">
              Transform API responses into{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-b from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  beautiful visualizations
                </span>
              </span>
            </h1>
          </motion.div>
          
          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto px-4"
          >
            Test APIs and convert JSON into interactive tree views, graphs, and tables — all in your browser.
          </motion.p>
          
          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex items-center justify-center mb-12 sm:mb-20"
          >
            <Link
              href="/app"
              className="group relative inline-flex items-center px-8 py-4 bg-slate-900 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2">
                Start Testing APIs
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
            <div className=" overflow-hidden   p-2">
              <div className="rounded-xl overflow-hidden  ">
                 <img 
                  src="hero/hero-preview.png" 
                  alt="ApiLens Dashboard Preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            {/* Decorative Glow */}
            {/* <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl -z-10 rounded-full opacity-50" /> */}
          </motion.div>

        </div>
      </div>
    </section>
  );
}