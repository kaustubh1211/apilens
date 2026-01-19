'use client';

import { Eye, Network, Table, Zap, Shield, Code } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            Everything you need to test APIs
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Built for developers who want to understand their API responses at a glance
          </p>
        </div>
        
        {/* Professional Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
          
          {/* Tree View - Featured Large Card */}
          <div className="group lg:row-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-slate-300 hover:shadow-xl transition-all duration-500 ease-out overflow-hidden relative">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform duration-500 shadow-lg">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">Tree View</h3>
            <p className="text-slate-600 mb-4 text-sm sm:text-base">
              Navigate nested JSON structures with an intuitive collapsible tree interface.
            </p>
            
            {/* Enhanced Tree View Visual */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 font-mono text-xs group-hover:bg-white group-hover:shadow-md transition-all duration-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-500">▼</span>
                <span className="text-slate-800 font-semibold">data</span>
              </div>
              <div className="pl-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">▼</span>
                  <span className="text-slate-800 font-semibold">user</span>
                </div>
                <div className="pl-4 space-y-1">
                  <div className="text-slate-600">name: <span className="text-slate-900 font-medium">"John"</span></div>
                  <div className="text-slate-600">id: <span className="text-slate-900 font-medium">123</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">▶</span>
                    <span className="text-slate-800 font-semibold">address</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Visualization - Wide Featured Card */}
          <div className="group md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-slate-600 hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:20px_20px]"></div>
            
            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 mb-4 shadow-lg group-hover:scale-105 transition-transform duration-500">
                <Network className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">Graph Visualization</h3>
              <p className="text-slate-300 mb-4 text-sm sm:text-base">
                See relationships between data points with interactive network graphs.
              </p>
              
              {/* Enhanced Graph Visual */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-700 rounded-xl flex items-center justify-center text-white text-xs font-semibold group-hover:bg-slate-600 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    User
                  </div>
                  <div className="h-8 w-0.5 bg-slate-700 group-hover:bg-slate-500 transition-colors duration-500"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 rounded-xl flex items-center justify-center text-white text-xs font-semibold group-hover:bg-slate-600 group-hover:scale-110 transition-all duration-500 delay-75 shadow-lg">
                    Posts
                  </div>
                  <div className="h-8 w-0.5 bg-slate-700 group-hover:bg-slate-500 transition-colors duration-500 delay-75"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 rounded-xl flex items-center justify-center text-white text-xs font-semibold group-hover:bg-slate-600 group-hover:scale-110 transition-all duration-500 delay-150 shadow-lg">
                    Tags
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="group bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-lg transition-all duration-500 flex flex-col">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform duration-500 shadow-md">
              <Table className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-tight">Table View</h3>
            <p className="text-slate-600 text-sm flex-grow">
              Convert arrays into sortable, filterable tables.
            </p>
            <div className="h-0.5 bg-gradient-to-r from-slate-900 to-transparent mt-3 w-0 group-hover:w-full transition-all duration-500"></div>
          </div>

          {/* Lightning Fast */}
          <div className="group bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-lg transition-all duration-500 flex flex-col relative overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform duration-500 shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-tight">Lightning Fast</h3>
            <p className="text-slate-600 text-sm flex-grow">
              Instant parsing and rendering in your browser.
            </p>
            {/* Subtle speed indicator */}
            <div className="mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
            </div>
          </div>

          {/* 100% Private */}
          <div className="group bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-lg transition-all duration-500 flex flex-col">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform duration-500 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-tight">100% Private</h3>
            <p className="text-slate-600 text-sm flex-grow">
              Your data never leaves your device. Zero tracking.
            </p>
            <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-500 font-medium">Client-side only</span>
            </div>
          </div>

          {/* Custom JSON - Wide Card */}
          <div className="group md:col-span-2 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 lg:p-6 hover:border-slate-300 hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform duration-500 shadow-lg">
              <Code className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">Custom JSON</h3>
            <p className="text-slate-600 mb-4 text-sm sm:text-base">
              Test with your own JSON or paste API responses directly. Supports any valid JSON structure.
            </p>
            
            {/* Enhanced JSON Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 sm:p-4 font-mono text-xs relative group-hover:border-slate-700 transition-colors duration-500">
              <div className="text-slate-500">{'{'}</div>
              <div className="pl-4 text-slate-400">"name": <span className="text-slate-200">"ApiLens"</span>,</div>
              <div className="pl-4 text-slate-400">"status": <span className="text-slate-200">"active"</span></div>
              <div className="text-slate-500 inline">{'}'}</div>
              <span className="inline-block w-1.5 h-4 bg-slate-400 ml-1 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}