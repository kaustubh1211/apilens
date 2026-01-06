'use client';

import { useState } from 'react';
import Link from 'next/link';
import ApiForm from '@/components/ApiForm';
import TreeView from '@/components/TreeView';
import TableView from '@/components/TableView';
import RawView from '@/components/RawView';
import GraphView from '@/components/GraphView';
import ViewTabs from '@/components/ViewTabs';
import SearchBar from '@/components/SearchBar';
import StatsPanel from './StatsPanner';
import ViewToolbar from './ViewToolBar';
import { analyzeData } from '@/libs/Analyzer';
import { toast } from 'sonner';
import { Code2, ArrowLeft, X } from 'lucide-react';
import Image from 'next/image';

export default function ApiLensApp() {
  const [responseData, setResponseData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'tree' | 'table' | 'raw' | 'graph'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [responseKey, setResponseKey] = useState(0); // Add this for forcing re-render

  const handleResponse = (response: any) => {
    setResponseData(response);
    setSearchQuery('');
    setResponseKey(prev => prev + 1); // Increment to force graph re-render
    toast.success('Response received');
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  const analysis = responseData ? analyzeData(responseData.data) : null;
  const showTableTab = analysis?.suggestedView === 'table';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
     <Link href="/" className="flex items-center gap-3 group">
    <Image
      src="/logo/api-lens.png"
      alt="ApiLens"
      width={40}
      height={40}
      priority
      className=" object-fill rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
    />
 
  <span className="text-2xl font-bold  text-neutral-300">
    ApiLens
  </span>
</Link>
          
          <div className="w-16"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Request Form */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6">
          <ApiForm onResponse={handleResponse} onError={handleError} />
        </div>

        {/* Response */}
        {responseData && (
          <>
            {/* Stats */}
            {!isFullscreen && (
              <StatsPanel
                data={responseData.data}
                status={responseData.status}
                time={responseData.time}
                size={responseData.size}
              />
            )}

            {/* Viewer */}
            <div className={`bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
            }`}>
              {/* Toolbar */}
              <div className="border-b border-neutral-900 p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  {activeTab === 'tree' && !isFullscreen && (
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  )}
                </div>
                
                <ViewToolbar 
                  data={responseData.data}
                  onFullscreenToggle={setIsFullscreen}
                />

                {isFullscreen && (
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 hover:bg-neutral-900 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                )}
              </div>

              {/* Tabs */}
              {!isFullscreen && (
                <ViewTabs 
                  activeTab={activeTab} 
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    setSearchQuery('');
                  }}
                  showTable={showTableTab}
                />
              )}

              {/* Content */}
              <div className={isFullscreen ? 'h-[calc(100vh-80px)]' : ''}>
                {activeTab === 'tree' && (
                  <div className={`p-6 overflow-auto custom-scrollbar ${
                    isFullscreen ? 'h-full' : 'max-h-[70vh]'
                  }`}>
                    <TreeView key={responseKey} data={responseData.data} searchQuery={searchQuery} />
                  </div>
                )}

                {activeTab === 'table' && showTableTab && (
                  <div className={`overflow-auto custom-scrollbar ${
                    isFullscreen ? 'h-full' : 'max-h-[70vh]'
                  }`}>
                    <TableView key={responseKey} data={responseData.data} />
                  </div>
                )}

                {activeTab === 'graph' && (
                  <div className={isFullscreen ? 'h-full' : 'h-[70vh]'}>
                    <GraphView key={responseKey} data={responseData.data} />
                  </div>
                )}

                {activeTab === 'raw' && (
                  <div className={isFullscreen ? 'h-full' : ''}>
                    <RawView key={responseKey} data={responseData.data} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}