'use client';

import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Wrapper: Fixed Height for vertical centering */}
        <div className="flex h-16 items-center justify-between">
          
          {/* 1. Logo Section: Proper baseline alignment */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
              <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-sm border border-slate-100">
                <Image
                  src="/logo/api-lens.png"
                  alt="ApiLens"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                ApiLens
              </span>
            </Link>
          </div>

          {/* 2. Desktop Navigation: Optical spacing */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* 3. Actions: Consistent height & padding */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/kaustubh1211/apilens"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>

            <Link
              href="/app"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              Launch app
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="inline-flex md:hidden items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu: Animated transition */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/app"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white shadow-sm"
              >
                Launch app
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}