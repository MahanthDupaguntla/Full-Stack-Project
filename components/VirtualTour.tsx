
import React, { useState } from 'react';
import { Artwork } from '../types';

interface Props {
  artworks: Artwork[];
  onClose: () => void;
}

const VirtualTour: React.FC<Props> = ({ artworks, onClose }) => {
  const [index, setIndex] = useState(0);
  const current = artworks[index];

  const next = () => setIndex((prev) => (prev + 1) % artworks.length);
  const prev = () => setIndex((prev) => (prev - 1 + artworks.length) % artworks.length);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
      <button onClick={onClose} className="fixed top-8 right-8 z-10 text-white/50 hover:text-white flex items-center gap-2 uppercase text-xs tracking-widest font-bold">
        <span>Exit Tour</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none"></div>
        
        <img 
          src={current.imageUrl} 
          alt={current.title} 
          className="max-w-full max-h-full shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
        />

        <div className="absolute bottom-10 left-10 z-20 max-w-md">
          <span className="text-amber-500 text-xs font-bold tracking-[0.2em] mb-2 block">VIRTUAL EXHIBITION</span>
          <h2 className="text-5xl font-serif text-white mb-2">{current.title}</h2>
          <p className="text-white/60 text-lg mb-4">{current.artist}, {current.year}</p>
          <p className="text-white/40 text-sm italic">{current.description}</p>
        </div>

        <button 
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all group-hover:translate-x-4"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button 
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all group-hover:-translate-x-4"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      <div className="mt-12 flex items-center gap-4">
        {artworks.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-300 ${i === index ? 'w-12 bg-amber-500' : 'w-4 bg-white/20'}`}
          />
        ))}
      </div>
      <p className="mt-4 text-xs tracking-widest text-white/30 uppercase">Navigate to experience the gallery collection</p>
    </div>
  );
};

export default VirtualTour;
