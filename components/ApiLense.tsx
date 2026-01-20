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
  const [responseKey, setResponseKey] = useState(0);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <Image
              src="/logo/api-lens.png"
              alt="ApiLens"
              width={34}
              height={34}
              priority
              className="object-fill rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
            />
            <span className="text-lg sm:text-2xl font-bold text-neutral-300 truncate">
              ApiLens
            </span>
          </Link>

          {/* spacer to keep center alignment */}
          <div className="w-10 sm:w-16" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-6">
        {/* Request Form */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-4 sm:p-6">
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
              <div className="border-b border-neutral-900 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  {activeTab === 'tree' && !isFullscreen && (
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  )}
                </div>
                
                <ViewToolbar 
                  data={responseData.data}
                  onFullscreenToggle={setIsFullscreen}
                />
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
                  <div className={`p-3 sm:p-6 overflow-auto custom-scrollbar ${
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