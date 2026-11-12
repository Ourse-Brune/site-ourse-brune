import { useState, useRef } from 'react'
import { OURSE_BRUNE_STORY } from '../data/siteData'
import { formatTypography } from '../utils/typography'
import { TRANSLATIONS } from '../data/translations'

function AtelierVideoPlayer({ language = 'fr' }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleFullscreen = (e) => {
    e.stopPropagation()
    const vid = videoRef.current
    if (!vid) return
    if (vid.requestFullscreen) {
      vid.requestFullscreen()
    } else if (vid.webkitRequestFullscreen) {
      vid.webkitRequestFullscreen()
    } else if (vid.msRequestFullscreen) {
      vid.msRequestFullscreen()
    }
  }

  return (
    <div className="my-10 sm:my-14 flex flex-col items-center px-4 w-full">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-stone-200 max-w-3xl w-full bg-stone-900 group aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          src="/images/Video_OURSE_BRUNE/Ourse-Brune-Atelier-LEGER.MOV"
          poster="/images/Video_OURSE_BRUNE/VIGNETTE-VIDEO.JPG"
          playsInline
          preload="metadata"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false)
            if (videoRef.current) {
              videoRef.current.currentTime = 0
              videoRef.current.load()
            }
          }}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* GROS BOUTON PLAY AU CENTRE (VISIBLE LORSQUE LA VIDÉO N'EST PAS LANCÉE) */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={t.ourseBrune.playVideo}
            className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/45 transition-colors cursor-pointer group/btn"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/90 hover:bg-white text-stone-900 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 transform group-hover/btn:scale-110 active:scale-95 pl-1.5">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}

        {/* BOUTON PLEIN ÉCRAN (AFFICHÉ QUAND LA VIDÉO EST LANCÉE) */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none p-4 sm:p-5 flex justify-end items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Zone cliquable pour mettre en pause */}
            <div
              className="absolute inset-0 pointer-events-auto cursor-pointer"
              onClick={togglePlay}
              title={t.ourseBrune.pauseVideo}
            />

            {/* Bouton plein écran en haut à droite */}
            <button
              type="button"
              onClick={handleFullscreen}
              aria-label={t.ourseBrune.fullscreen}
              title={t.ourseBrune.fullscreen}
              className="relative z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer pointer-events-auto shadow-lg backdrop-blur-xs hover:scale-105 active:scale-95 border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OurseBruneSection({
  bannerTitle = 'OURSE BRUNE ?',
  storyText = '',
  storyTextEn = '',
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  language = 'fr',
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = externalIsOpen !== undefined
  const isOpen = isControlled ? externalIsOpen : internalIsOpen
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr
  const isDefaultTitle = !bannerTitle || bannerTitle.replace(/[\s\u00A0]+/g, ' ').trim().toUpperCase().startsWith('OURSE BRUNE')
  const displayTitle = isDefaultTitle ? t.banners.ourseBrune : bannerTitle

  const toggle = () => {
    if (isControlled) {
      externalOnToggle && externalOnToggle(!isOpen)
    } else {
      setInternalIsOpen(!isOpen)
    }
  }

  const collapse = () => {
    if (isControlled) {
      externalOnToggle && externalOnToggle(false)
    } else {
      setInternalIsOpen(false)
    }
    const el = document.getElementById('ourse-brune')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Découpage dynamique des paragraphes
  const defaultParagraphs = [
    t.ourseBrune.p1,
    t.ourseBrune.p2,
    t.ourseBrune.p3,
    t.ourseBrune.p4,
    t.ourseBrune.p5,
    t.ourseBrune.p6,
    t.ourseBrune.p7,
    t.ourseBrune.p8,
  ]

  const customText = language === 'en' ? storyTextEn : storyText
  const paragraphs = customText
    ? customText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : defaultParagraphs

  return (
    <section id="ourse-brune" className="w-full bg-white flex flex-col items-center scroll-mt-20">
      <div className="w-full flex flex-col">
        {/* BANDEAU OURSE BRUNE ? (Bordeaux) — PLEINE LARGEUR SANS FLÈCHE */}
        <button
          type="button"
          onClick={toggle}
          className="group relative w-full py-10 sm:py-14 bg-[#800e18] hover:bg-[#6e0c14] transition-colors duration-200 cursor-pointer flex items-center justify-center text-center px-6 block leading-none"
          aria-expanded={isOpen}
        >
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-[0.14em] sm:tracking-[0.2em] text-white uppercase font-sans">
            {formatTypography(displayTitle, language)}
          </h2>
        </button>

        {/* CONTENU DÉPLIABLE DE L'HISTOIRE DE L'ATELIER */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[6000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
        >
          <div className="w-full bg-white pt-10 sm:pt-14 pb-0 flex flex-col items-center text-black">
            {/* BLOC HISTOIRE : IMAGE À GAUCHE ET TEXTE À DROITE (AU MÊME NIVEAU) */}
            <div className="w-full max-w-6xl px-4 sm:px-8 flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-10 lg:gap-14">
              {/* PHOTO HISTORIQUE ALIGNÉE À GAUCHE */}
              <div className="w-full md:w-5/12 lg:w-4/12 shrink-0 flex flex-col items-center">
                <div className="overflow-hidden rounded-2xl shadow-xl border border-stone-200 w-full max-w-[360px] lg:max-w-[400px] bg-stone-100">
                  <img
                    src="/images/COCTEAU-MALEINE.JPG"
                    alt={t.ourseBrune.caption1}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  <div className="p-3 bg-stone-900 text-stone-200 text-center text-xs italic leading-relaxed">
                    {formatTypography(t.ourseBrune.caption1, language)}
                    <br />
                    {formatTypography(t.ourseBrune.caption2, language)}
                  </div>
                </div>
              </div>

              {/* TEXTE DE L'HISTOIRE À SA DROITE — ALIGNÉ À GAUCHE */}
              <div className="w-full md:w-7/12 lg:w-8/12 space-y-4 sm:space-y-5 text-sm sm:text-base md:text-lg leading-relaxed text-left hyphens-none font-sans text-black">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{formatTypography(p, language)}</p>
                ))}
              </div>
            </div>

            {/* VIDÉO DE L'ATELIER OURSE BRUNE AVEC GROS BOUTON PLAY ET PLEIN ÉCRAN */}
            <AtelierVideoPlayer language={language} />

            {/* FLÈCHE NOIRE PLEINE LARGEUR COLLÉE AU BANDEAU SUIVANT SANS AUCUN VIDE */}
            <button
              type="button"
              onClick={collapse}
              className="w-full block border-0 p-0 m-0 bg-transparent cursor-pointer transition-opacity duration-200 hover:opacity-85 focus:outline-hidden leading-none select-none"
              title={t.ourseBrune.collapse}
              aria-label={t.ourseBrune.collapse}
            >
              <img
                src="/images/FLECHE-NOIRE.png"
                alt={t.ourseBrune.collapse}
                className="w-full h-auto block select-none pointer-events-none"
              />
            </button>
          </div>
        </div>
      </div>
    </section >
  )
}
