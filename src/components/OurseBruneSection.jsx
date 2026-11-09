import { useState, useRef } from 'react'
import { OURSE_BRUNE_STORY } from '../data/siteData'

function AtelierVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)

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
            aria-label="Lancer la vidéo de l'atelier"
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
              title="Cliquer pour mettre en pause"
            />

            {/* Bouton plein écran en haut à droite */}
            <button
              type="button"
              onClick={handleFullscreen}
              aria-label="Plein écran"
              title="Afficher en plein écran"
              className="relative z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer pointer-events-auto shadow-lg backdrop-blur-xs hover:scale-105 active:scale-95 border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs sm:text-sm text-stone-500 italic text-center">
        Immersion au cœur de l'atelier Ourse Brune
      </p>
    </div>
  )
}

export default function OurseBruneSection({ bannerTitle = 'OURSE BRUNE ?' }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const collapse = () => {
    setIsOpen(false)
    const el = document.getElementById('ourse-brune')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[0.16em] sm:tracking-[0.22em] text-white uppercase font-sans">
            {bannerTitle}
          </h2>
        </button>

        {/* CONTENU DÉPLIABLE DE L'HISTOIRE DE L'ATELIER */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[6000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-white pt-12 sm:pt-16 pb-0 flex flex-col items-center text-black">
            {/* Texte de l'histoire Ourse Brune */}
            <div className="w-full max-w-3xl px-4 sm:px-8 space-y-6 text-sm sm:text-base md:text-lg leading-relaxed text-center font-sans">
              <p>{OURSE_BRUNE_STORY.p1}</p>
              <p>{OURSE_BRUNE_STORY.p2}</p>
              <p>{OURSE_BRUNE_STORY.p3}</p>
              <p>{OURSE_BRUNE_STORY.p4}</p>
              <p>{OURSE_BRUNE_STORY.p5}</p>
              <p>{OURSE_BRUNE_STORY.p6}</p>
              <p>{OURSE_BRUNE_STORY.p7}</p>
              <p>{OURSE_BRUNE_STORY.p8}</p>
            </div>

            {/* PHOTO HISTORIQUE : Jean Cocteau & Marie-Madeleine Jolly */}
            <div className="my-10 sm:my-12 flex flex-col items-center px-4 w-full">
              <div className="overflow-hidden rounded-2xl shadow-xl border border-stone-200 max-w-lg w-full bg-stone-100">
                <img
                  src="/images/COCTEAU-MALEINE.JPG"
                  alt="Jean Cocteau et Marie-Madeleine Jolly à l'atelier"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="p-3.5 bg-stone-900 text-stone-200 text-center text-xs sm:text-sm italic">
                  Jean Cocteau &amp; Marie-Madeleine Jolly à l'atelier — fin des années 1950.
                </div>
              </div>
            </div>

            {/* VIDÉO DE L'ATELIER OURSE BRUNE AVEC GROS BOUTON PLAY ET PLEIN ÉCRAN */}
            <AtelierVideoPlayer />

            {/* FLÈCHE NOIRE PLEINE LARGEUR COLLÉE AU BANDEAU SUIVANT SANS AUCUN VIDE */}
            <button
              type="button"
              onClick={collapse}
              className="w-full block border-0 p-0 m-0 bg-transparent cursor-pointer transition-opacity duration-200 hover:opacity-85 focus:outline-hidden leading-none select-none"
              title="Replier la section"
              aria-label="Replier la section"
            >
              <img
                src="/images/FLECHE-NOIRE.png"
                alt="Replier"
                className="w-full h-auto block select-none pointer-events-none"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
