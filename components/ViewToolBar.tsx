'use client';

import { Copy, Check, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import FullscreenButton from './FullScreenButton';

interface ViewToolbarProps {
  data: any;
  onFullscreenToggle: (isFullscreen: boolean) => void;
  showCopy?: boolean;
  showDownload?: boolean;
}

export default function ViewToolbar({ 
  data, 
  onFullscreenToggle,
  showCopy = true,
  showDownload = true 
}: ViewToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded');
  };

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
      <div className="flex items-center gap-2 flex-wrap">
        {showCopy && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-gray-800"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy JSON</span>
              </>
            )}
          </button>
        )}

        {showDownload && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-gray-800"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        )}
      </div>

      <FullscreenButton onToggle={onFullscreenToggle} />
    </div>
  );
}