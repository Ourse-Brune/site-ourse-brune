import { useEffect, useState, useRef } from 'react'
import { formatTypography } from '../utils/typography'
import { TRANSLATIONS, translatePiece } from '../data/translations'

export default function DishModal({ dish: rawDish, onClose, language = 'fr' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr
  const dish = translatePiece(rawDish, language)

  const touchStartXRef = useRef(0)
  const touchCurrentXRef = useRef(0)
  const mouseStartXRef = useRef(0)
  const isMouseDownRef = useRef(false)

  // Rassembler toutes les photos de détail :
  // En priorité la photo principale (image / fullImage), puis les autres vues dans l'ordre (gallery).
  const detailImages = [
    dish?.fullImage || dish?.image,
    ...(dish?.gallery || []),
  ].filter(Boolean).filter((val, idx, arr) => arr.indexOf(val) === idx)

  const images = detailImages.length > 0 ? detailImages : (dish?.image ? [dish.image] : [])


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, images.length])

  if (!dish || images.length === 0) return null

  // GESTION DU GLISSEMENT TACTILE (DOIGT / SMARTPHONE / TABLETTE)
  const handleTouchStart = (e) => {
    if (images.length <= 1) return
    touchStartXRef.current = e.touches[0].clientX
    touchCurrentXRef.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (images.length <= 1 || !isDragging) return
    touchCurrentXRef.current = e.touches[0].clientX
    const diff = touchCurrentXRef.current - touchStartXRef.current
    setDragOffset(diff)
  }

  const handleTouchEnd = () => {
    if (images.length <= 1 || !isDragging) return
    const diff = touchCurrentXRef.current - touchStartXRef.current
    const threshold = 45 // distance minimale de glissement en pixels

    if (diff < -threshold) {
      // Glissement vers la gauche -> image suivante
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    } else if (diff > threshold) {
      // Glissement vers la droite -> image précédente
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
    setDragOffset(0)
    setIsDragging(false)
  }

  // GESTION DU GLISSEMENT À LA SOURIS (DESKTOP)
  const handleMouseDown = (e) => {
    if (images.length <= 1) return
    isMouseDownRef.current = true
    mouseStartXRef.current = e.clientX
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || images.length <= 1) return
    const diff = e.clientX - mouseStartXRef.current
    setDragOffset(diff)
  }

  const handleMouseUp = (e) => {
    if (!isMouseDownRef.current || images.length <= 1) return
    const diff = e.clientX - mouseStartXRef.current
    const threshold = 45

    if (diff < -threshold) {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    } else if (diff > threshold) {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    isMouseDownRef.current = false
    setDragOffset(0)
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false
      setDragOffset(0)
      setIsDragging(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* En-tête discret avec nom de la pièce */}
      <div className="absolute top-5 sm:top-6 left-6 sm:left-10 z-20 flex flex-col pointer-events-none">
        <span className="text-sm sm:text-base font-bold tracking-widest text-white uppercase font-sans drop-shadow-md">
          {formatTypography(dish.name)}
        </span>
      </div>

      {/* Bouton Fermer */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
        aria-label={t.dishModal.close}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* FLÈCHES BLANCHES LATÉRALES DE DÉFILEMENT (GAUCHE ET DROITE) */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
          }}
          className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-110 active:scale-95 shadow-xl backdrop-blur-xs"
          aria-label={t.dishModal.prevPhoto}
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
          }}
          className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-110 active:scale-95 shadow-xl backdrop-blur-xs"
          aria-label={t.dishModal.nextPhoto}
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* 
        ZONE D'AFFICHAGE ET DE GLISSEMENT (TOUCH ET SOURIS)
        Navigation fluide par swipe / drag et flèches
      */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-16 overflow-hidden touch-pan-y"
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: images.length > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div
          className={`relative max-w-[92vw] max-h-[82vh] flex items-center justify-center transition-transform ${
            isDragging ? 'duration-0' : 'duration-300 ease-out'
          }`}
          style={{
            transform: `translateX(${dragOffset}px)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            key={images[currentIndex]}
            src={images[currentIndex]}
            alt={`${dish.name} - détail ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[80vh] object-contain drop-shadow-2xl select-none pointer-events-none rounded-lg"
            draggable={false}
          />
        </div>
      </div>

      {/* 
        INDICATEURS DE PAGINATION (UNIQUEMENT LES PETITS POINTS EN BAS)
        Permettent de choisir directement l'image
      */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/60 px-4 py-2.5 rounded-full backdrop-blur-md border border-white/15 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx)
                setDragOffset(0)
              }}
              className={`p-1.5 cursor-pointer focus:outline-hidden transition-all group`}
              aria-label={`${t.dishModal.goToPhoto} ${idx + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 group-hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
