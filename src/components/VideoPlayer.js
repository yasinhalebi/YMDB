import React from 'react';
import { IoMdClose } from 'react-icons/io';

export default function VideoPlayer({ videoId, onClose }) {
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-5xl mx-4 bg-black rounded-lg overflow-hidden z-50">
        <div className="absolute top-0 right-0 p-2 z-50">
          <button
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 p-2 rounded-full text-white hover:text-red-500 transition-all duration-300 transform hover:scale-110"
            aria-label="Close video"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="relative pb-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}