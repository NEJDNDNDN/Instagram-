
import React, { useState, useEffect, useCallback } from 'react';
import { SLIDES } from './constants';
import GravityVisualization from './GravityVisualization';
import GeminiQandA from './GeminiQandA';

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection('next');
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection('prev');
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-900/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 blur-[120px] rounded-full"></div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        ></div>
      </div>

      {/* Content Area */}
      <main className="w-full max-w-4xl z-10">
        <div className={`transition-all duration-700 transform ${
          direction === 'next' ? 'translate-x-0' : 'translate-x-0'
        }`}>
          {slide.type === 'intro' ? (
            <div className="text-center space-y-8 animate-fadeIn">
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-400 leading-tight">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 font-light">
                {slide.subtitle}
              </p>
              <button 
                onClick={nextSlide}
                className="mt-10 px-8 py-4 bg-white text-black hover:bg-cyan-400 hover:text-white transition-all rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                ابدأ العرض الاستكشافي
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative min-h-[500px] flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                {slide.icon && <span className="text-4xl">{slide.icon}</span>}
                <h2 className="text-3xl md:text-4xl font-bold text-white border-r-4 border-cyan-500 pr-4">
                  {slide.title}
                </h2>
              </div>

              <div className="flex-1">
                {slide.type === 'content' || slide.type === 'summary' ? (
                  <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light">
                    {slide.content}
                  </p>
                ) : slide.type === 'visual' ? (
                  <div className="space-y-6">
                    <p className="text-lg text-slate-300">{slide.content}</p>
                    <GravityVisualization />
                  </div>
                ) : slide.type === 'qa' ? (
                  <div className="space-y-4">
                    <p className="text-lg text-slate-300 mb-4">{slide.content}</p>
                    <GeminiQandA />
                  </div>
                ) : null}
              </div>

              {/* Navigation Controls inside card */}
              <div className="mt-12 flex justify-between items-center">
                <button 
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="px-6 py-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-0 transition-all flex items-center gap-2"
                >
                  السابق
                </button>
                <span className="text-slate-500 font-mono">
                  {currentSlide + 1} / {SLIDES.length}
                </span>
                <button 
                  onClick={nextSlide}
                  disabled={currentSlide === SLIDES.length - 1}
                  className="px-8 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-0 transition-all font-bold shadow-lg flex items-center gap-2"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="fixed bottom-4 text-slate-500 text-sm font-light">
        استخدم الأسهم أو المسافة للتنقل بين الشرائح
      </footer>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
