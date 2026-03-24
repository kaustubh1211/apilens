'use client';

import Link from 'next/link';
import { Github, Menu, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#demo', label: 'Demo' },
  ];

  return (
    // GLASS EFFECT: sticky, backdrop-blur, and a subtle border
    <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Section */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/logo/api-lens.png"
                  alt="ApiLens"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                ApiLens
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Better Spacing & Colors */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* GitHub - Subtle Icon hover */}
            <a
              href="https://github.com/kaustubh1211/apilens"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <Github className="w-5 h-5" />
            </a>

            {/* Launch App - High Contrast Primary Button */}
            <Link
              href="/app"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-slate-200 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Launch app
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Darker & Smoother */}
      {open && (
        <div className="md:hidden absolute w-full bg-black/95 border-b border-white/10 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-lg font-medium text-slate-400 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/app"
              className="flex w-full items-center justify-center bg-white text-black py-4 rounded-xl font-bold"
            >
              Launch app
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}