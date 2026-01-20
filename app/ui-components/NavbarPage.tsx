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
    <nav className="sticky top-0 z-40 bg-white backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <Image
              src="/logo/api-lens.png"
              alt="ApiLens"
              width={36}
              height={36}
              priority
              className="object-fill rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
            />
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
              ApiLens
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-slate-900 after:rounded-full hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://github.com/kaustubh1211/apilens"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>

            <Link
              href="/app"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-md hover:shadow-lg hover:from-slate-800 hover:to-slate-700 transition-all"
            >
              <span>Launch app</span>
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex md:hidden items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden border-t border-slate-200 pb-3">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-2 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <div className="flex items-center gap-2 px-2 pt-2">
                <a
                  href="https://github.com/kaustubh1211/apilens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <Link
                  href="/app"
                  onClick={() => setOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  Launch app
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}