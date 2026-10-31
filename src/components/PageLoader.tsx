import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const PageLoader: React.FC = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When route changes, trigger loading animation
    setLoading(true);
    setProgress(25);

    const t1 = setTimeout(() => {
      setProgress(70);
    }, 100);

    const t2 = setTimeout(() => {
      setProgress(100);
    }, 250);

    const t3 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <>
      {/* 1. Sleek Top Edge Progress Bar with glow */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#173F35] via-[#E99B54] to-[#BD7027] transition-all ease-out duration-300 shadow-[0_0_10px_rgba(233,155,84,0.7)]"
          style={{
            width: `${progress}%`,
            opacity: progress === 100 ? 0 : 1,
            transitionProperty: 'width, opacity',
            transitionDuration: progress === 100 ? '200ms' : '300ms',
          }}
        />
      </div>

      {/* 2. Professional Subtle Floating Center Pulse Indicator */}
      {loading && progress < 100 && (
        <div className="fixed inset-0 z-40 bg-[#17324D]/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-stone-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#173F35] flex items-center justify-center text-[#E99B54] shadow-sm animate-spin" style={{ animationDuration: '3s' }}>
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#17324D] tracking-wide">
                Baunduilla
              </p>
              <p className="text-[10px] text-stone-500 font-medium">
                Loading trail...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const RouteTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out">
      {children}
    </div>
  );
};
