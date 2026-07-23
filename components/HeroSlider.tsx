'use client';

import { useState, useEffect } from 'react';

export default function HeroSlider({ slides, fullBg }: { slides: any[]; fullBg?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeSlides = slides && slides.length > 0
    ? slides
    : [
        { image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800' },
        { image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800' }
      ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (fullBg) {
    return (
      <>
        {activeSlides.map((slide, index) => (
          <div key={index} className="absolute inset-0 transition-all duration-[1500ms] ease-in-out"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transform: `scale(${index === currentIndex ? 1 : 1.05})`,
            }}
          >
            <img
              src={slide.image_url}
              alt={`School Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activeSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] max-w-lg mx-auto md:ml-auto">
      <div className="absolute -bottom-6 -left-6 w-32 h-32 z-0" style={{
         backgroundImage: `repeating-linear-gradient(45deg, #c9a227 0, #c9a227 2px, transparent 2px, transparent 12px)`,
         opacity: 0.4
      }} />
      
      <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black/20" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        {activeSlides.map((slide, index) => (
          <div key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide.image_url} alt={`School Photo ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {activeSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#c9a227] scale-125' : 'bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
