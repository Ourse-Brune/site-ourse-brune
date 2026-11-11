export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full bg-black text-stone-400 py-14 px-6 border-0">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
        <button
          type="button"
          onClick={scrollToTop}
          className="group flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center group-hover:border-stone-600 transition-colors">
            <svg className="w-4 h-4 text-stone-300 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <span>Haut de page</span>
        </button>

        <div className="w-16 h-px bg-stone-800"></div>

        <div className="space-y-1.5">
          <p className="text-sm sm:text-base font-semibold tracking-wider text-stone-200 uppercase">
            OURSE BRUNE — ART CÉRAMIQUE
          </p>
          <p className="text-xs sm:text-sm text-stone-500">
            Atelier d'art céramique contemporain • Drôme, France
          </p>
        </div>

        <p className="text-[11px] text-stone-600">
          © {new Date().getFullYear()} Ourse Brune. Tous droits réservés. Reproduction interdite sans autorisation.
        </p>
      </div>
    </footer>
  )
}
