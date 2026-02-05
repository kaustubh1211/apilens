'use client';

import { Send, Sparkles, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32  bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 mb-5 leading-tight tracking-tight">
            Three steps to{' '}
            <span className="relative inline-block">
              <span className="relative z-10">visual</span>
              {/* Smooth organic wave underline */}
              <svg 
                className="absolute -bottom-1 left-0 w-full h-3 text-slate-900" 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M2,8 Q25,2 50,6 T98,4" />
              </svg>
            </span>{' '}
            clarity
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            From raw API JSON to beautiful visualization in seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <Step
              number="01"
              icon={<Send className="w-5 h-5" strokeWidth={1.5} />}
              title="Send Request"
              description="Enter your API endpoint or paste JSON. Supports all HTTP methods with custom headers."
            />
            
            <Step
              number="02"
              icon={<Sparkles className="w-5 h-5" strokeWidth={1.5} />}
              title="Auto Process"
              description="The engine parses your JSON and determines the best visualization method."
            />
            
            <Step
              number="03"
              icon={<Eye className="w-5 h-5" strokeWidth={1.5} />}
              title="Explore Data"
              description="Switch between tree, graph, and table views. Filter, sort, and export with ease."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Try it now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Step({ number, icon, title, description }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="flex items-start justify-between mb-8">
        <div className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600">
          {icon}
        </div>
        <span className="text-sm font-mono text-slate-300">
          {number}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}