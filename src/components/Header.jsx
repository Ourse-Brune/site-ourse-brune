import { useState, useEffect } from 'react'

export default function Header({
  onNavigate,
  headerImage = '/images/ACCUEIL-OURS 3.jpg',
  language = 'fr',
  onLanguageChange,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Détecte quand l'utilisateur a défilé au-delà de la bannière
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Empêche le défilement du corps de page quand le menu plein écran est ouvert
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  const handleLinkClick = (id) => {
    setMenuOpen(false)
    setTimeout(() => {
      if (onNavigate) {
        onNavigate(id)
      } else {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 120)
  }

  return (
    <>
      {/* 
        HEADER BANNER FULL-WIDTH (STICKY SOUS-JACENT)
        - Couvre 100% de la hauteur de l'écran (100dvh) sur mobile comme sur desktop pour un rendu héroïque pleine page
        - ACCUEIL-OURS 3.jpg intègre directement le logo Ourse Brune Art Céramique
      */}
      <header className="sticky top-0 z-0 w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-stone-900 select-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={headerImage || '/images/ACCUEIL-OURS 3.jpg'}
            alt="Ourse Brune — Art Céramique — Plat en céramique emblématique Ours"
            className="w-full h-full object-cover object-top"
            loading="eager"
            fetchPriority="high"
          />

          {/* FLÈCHE QUI SAUTILLE EN BAS DU HEADER SUR MOBILE (Indicateur invitant au défilement) */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('series-section')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 p-2 text-white/90 hover:text-white transition-opacity animate-bounce cursor-pointer portrait:flex landscape:hidden md:hidden flex-col items-center select-none"
            title={language === 'en' ? 'Scroll down' : 'Défiler vers le bas'}
            aria-label={language === 'en' ? 'Scroll down' : 'Défiler vers le bas'}
          >
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </header>

      {/* 
        MENU HAMBURGER (2 BARRES BLANCHES DANS LE COIN ROUGE)
        - À l'état initial (haut de page) : sans fond rouge, deux barres blanches posées directement sur le coin rouge de l'ours
        - Au défilement (scrolled) : prend un léger fond bordeaux pour rester bien lisible sur le contenu blanc
      */}
      <div className="fixed top-3 right-3 sm:top-5 sm:right-6 md:top-6 md:right-8 z-50 flex items-center gap-2.5 sm:gap-3.5">
        {/* SÉLECTEUR DE LANGUE FR / EN (AFFICHÉ À GAUCHE DE LA CROIX QUAND LE MENU EST OUVERT) */}
        {menuOpen && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-sans tracking-widest uppercase select-none bg-black/80 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-lg transition-all">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onLanguageChange && onLanguageChange('fr')
              }}
              className={`transition-colors duration-200 cursor-pointer px-1 py-0.5 rounded ${
                language === 'fr'
                  ? 'text-white font-extrabold underline underline-offset-4 decoration-2 decoration-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
              aria-label="Passer en Français"
            >
              FR
            </button>
            <span className="text-white/30 text-xs">/</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onLanguageChange && onLanguageChange('en')
              }}
              className={`transition-colors duration-200 cursor-pointer px-1 py-0.5 rounded ${
                language === 'en'
                  ? 'text-white font-extrabold underline underline-offset-4 decoration-2 decoration-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>
        )}

        <button
          id="main-menu-btn"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? (language === 'en' ? 'Close menu' : 'Fermer le menu') : (language === 'en' ? 'Open menu' : 'Ouvrir le menu')}
          aria-expanded={menuOpen}
          className={`group flex flex-col justify-center items-end p-2 sm:p-2.5 transition-all duration-300 cursor-pointer focus:outline-hidden ${
            scrolled
              ? 'bg-black/90 hover:bg-black text-white shadow-lg backdrop-blur-md rounded-xl border border-white/15'
              : 'bg-transparent hover:opacity-85'
          }`}
        >
          <div className="flex flex-col gap-1.5 sm:gap-2 items-end">
            <span
              className={`block h-[3px] sm:h-[3.5px] bg-white rounded-full transition-all duration-300 ${
                menuOpen
                  ? 'w-7 sm:w-8 rotate-45 translate-y-[4.5px] sm:translate-y-[5.5px]'
                  : 'w-7 sm:w-9 md:w-10 group-hover:w-9 sm:group-hover:w-10'
              }`}
            ></span>
            <span
              className={`block h-[3px] sm:h-[3.5px] bg-white rounded-full transition-all duration-300 ${
                menuOpen
                  ? 'w-7 sm:w-8 -rotate-45 -translate-y-[4.5px] sm:-translate-y-[5.5px]'
                  : 'w-7 sm:w-9 md:w-10'
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* 
        TIROIR / OVERLAY DU MENU NAVIGATION — DIRECTION ARTISTIQUE NOIR ET BLANC
      */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          menuOpen
            ? 'opacity-100 pointer-events-auto backdrop-blur-md bg-black/80'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-black border-l border-white/15 text-white shadow-2xl px-8 sm:px-12 pt-24 sm:pt-28 pb-12 flex flex-col justify-start transition-transform duration-500 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 3 Liens de navigation demandés */}
          <nav className="flex flex-col gap-6 sm:gap-8">
              <button
                type="button"
                onClick={() => handleLinkClick('ourse-brune')}
                className="group text-left text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white hover:text-white/60 transition-all duration-300 cursor-pointer flex items-center justify-between py-3 border-b border-white/10 hover:border-white/40"
              >
                <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                  {language === 'en' ? 'Ourse Brune?' : 'Ourse Brune ?'}
                </span>
                <span className="text-sm text-white/30 group-hover:text-white transition-colors">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => handleLinkClick('contact')}
                className="group text-left text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white hover:text-white/60 transition-all duration-300 cursor-pointer flex items-center justify-between py-3 border-b border-white/10 hover:border-white/40"
              >
                <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                  {language === 'en' ? 'Contact / Order' : 'Contact / Commande'}
                </span>
                <span className="text-sm text-white/30 group-hover:text-white transition-colors">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => handleLinkClick('actualites')}
                className="group text-left text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white hover:text-white/60 transition-all duration-300 cursor-pointer flex items-center justify-between py-3 border-b border-white/10 hover:border-white/40"
              >
                <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                  {language === 'en' ? 'Newsletter / News' : 'Newsletter / Actualités'}
                </span>
                <span className="text-sm text-white/30 group-hover:text-white transition-colors">&rarr;</span>
              </button>
            </nav>
        </div>
      </div>
    </>
  )
}
