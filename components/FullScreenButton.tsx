'use client';

import { Maximize2, Minimize2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FullscreenButtonProps {
  onToggle: (isFullscreen: boolean) => void;
}

export default function FullscreenButton({ onToggle }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        onToggle(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen, onToggle]);

  const toggle = () => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    onToggle(newState);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-lg transition-colors border border-gray-300"
      title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="w-4 h-4" />
          <span>Exit</span>
        </>
      ) : (
        <>
          <Maximize2 className="w-4 h-4" />
          <span>Fullscreen</span>
        </>
      )}
    </button>
  );
}