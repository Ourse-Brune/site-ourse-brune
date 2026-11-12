export default function Hero({ onExploreClick }) {
  return (
    <section className="relative w-full pt-20 sm:pt-24 bg-stone-100 flex flex-col items-center justify-center overflow-hidden">
      {/* Container matching mobile et desktop proportion */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <div className="relative w-full aspect-3/4 max-h-[85vh] sm:max-h-[90vh] overflow-hidden shadow-sm flex items-center justify-center">
          <img
            src="/images/ACCUEIL-OURS.jpg"
            alt="Plat emblématique Ours — Ourse Brune Art Céramique"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-101"
            loading="eager"
          />
          {/* Subtle gradient overlay at bottom for smooth blending */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-900/40 to-transparent pointer-events-none"></div>

          {/* Floating cue button */}
          <button
            type="button"
            onClick={onExploreClick}
            aria-label="Découvrir les collections"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs sm:text-sm font-medium tracking-widest uppercase shadow-lg backdrop-blur-xs transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>Découvrir les séries</span>
            <svg className="w-4 h-4 animate-bounce text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
