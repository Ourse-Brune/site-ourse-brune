import { useEffect, useState, useRef } from 'react'
import { formatTypography } from '../utils/typography'
import { TRANSLATIONS, translatePiece } from '../data/translations'

export default function DishModal({ dish: rawDish, onClose, language = 'fr' }) {
  const [currentIndex, setCurrentIndex] = useState(rawDish?.initialIndex || 0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  const t = TRANSLATIONS[language] || TRANSLATIONS.fr
  const dish = translatePiece(rawDish, language)

  const scaleRef = useRef(1)
  const positionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (rawDish?.initialIndex !== undefined) {
      setCurrentIndex(rawDish.initialIndex)
    }
  }, [rawDish?.initialIndex])

  useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  useEffect(() => {
    positionRef.current = position
  }, [position])

  const touchStartXRef = useRef(0)
  const touchCurrentXRef = useRef(0)
  const mouseStartXRef = useRef(0)
  const isMouseDownRef = useRef(false)

  // Zoom / Pan refs
  const touchStartPosRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const lastTapRef = useRef(0)
  const pinchStartDistRef = useRef(0)
  const pinchStartScaleRef = useRef(1)
  const isPinchingRef = useRef(false)
  const isPanningRef = useRef(false)

  // Rassembler toutes les photos de détail :
  // En priorité la photo principale (image / fullImage), puis les autres vues dans l'ordre (gallery).
  const detailImages = [
    dish?.fullImage || dish?.image,
    ...(dish?.gallery || []),
  ].filter(Boolean).filter((val, idx, arr) => arr.indexOf(val) === idx)

  const images = detailImages.length > 0 ? detailImages : (dish?.image ? [dish.image] : [])

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setDragOffset(0)
    setIsDragging(false)
    isPanningRef.current = false
    isPinchingRef.current = false
    setIsInteracting(false)
  }

  // Réinitialiser le zoom lors du changement d'image
  useEffect(() => {
    resetZoom()
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (scaleRef.current > 1.05) {
          resetZoom()
        } else {
          onClose()
        }
      } else if (e.key === 'ArrowLeft' && images.length > 1 && scaleRef.current <= 1.05) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight' && images.length > 1 && scaleRef.current <= 1.05) {
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

  const getDistance = (t1, t2) => {
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.hypot(dx, dy)
  }

  // GESTION DU GLISSEMENT ET DU ZOOM TACTILE (SMARTPHONE / TABLETTE)
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // PINCEMENT POUR ZOOMER (2 DOIGTS)
      isPinchingRef.current = true
      isPanningRef.current = false
      setIsDragging(false)
      setIsInteracting(true)
      pinchStartDistRef.current = getDistance(e.touches[0], e.touches[1])
      pinchStartScaleRef.current = scaleRef.current
      return
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0]
      const now = Date.now()

      // DOUBLE-TAP : Bascule entre 1x et 2.5x
      if (now - lastTapRef.current < 320) {
        lastTapRef.current = 0
        if (scaleRef.current > 1.05) {
          resetZoom()
        } else {
          setScale(2.5)
          setPosition({ x: 0, y: 0 })
        }
        return
      }
      lastTapRef.current = now

      if (scaleRef.current > 1.05) {
        // IMAGE ZOOMÉE : DÉPLACEMENT DE L'IMAGE (PAN)
        isPanningRef.current = true
        setIsInteracting(true)
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY }
        panStartRef.current = { ...positionRef.current }
      } else if (images.length > 1) {
        // IMAGE TAILLE NORMALE : DÉFILEMENT ENTRE PHOTOS
        touchStartXRef.current = touch.clientX
        touchCurrentXRef.current = touch.clientX
        setIsDragging(true)
        setIsInteracting(true)
      }
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && isPinchingRef.current) {
      const currentDist = getDistance(e.touches[0], e.touches[1])
      if (pinchStartDistRef.current > 0) {
        const factor = currentDist / pinchStartDistRef.current
        const newScale = Math.min(4, Math.max(1, pinchStartScaleRef.current * factor))
        setScale(newScale)
        if (newScale <= 1.05) {
          setPosition({ x: 0, y: 0 })
        }
      }
      return
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0]
      if (isPanningRef.current && scaleRef.current > 1.05) {
        const deltaX = touch.clientX - touchStartPosRef.current.x
        const deltaY = touch.clientY - touchStartPosRef.current.y
        const rawX = panStartRef.current.x + deltaX
        const rawY = panStartRef.current.y + deltaY

        const maxX = Math.max(0, (window.innerWidth * (scaleRef.current - 1)) / 1.8)
        const maxY = Math.max(0, (window.innerHeight * (scaleRef.current - 1)) / 1.8)

        setPosition({
          x: Math.min(maxX, Math.max(-maxX, rawX)),
          y: Math.min(maxY, Math.max(-maxY, rawY)),
        })
      } else if (isDragging && scaleRef.current <= 1.05 && images.length > 1) {
        touchCurrentXRef.current = touch.clientX
        const diff = touchCurrentXRef.current - touchStartXRef.current
        setDragOffset(diff)
      }
    }
  }

  const handleTouchEnd = (e) => {
    if (isPinchingRef.current) {
      if (e.touches.length < 2) {
        isPinchingRef.current = false
        setIsInteracting(false)
        if (scaleRef.current < 1.1) {
          resetZoom()
        }
      }
      return
    }

    if (isPanningRef.current) {
      isPanningRef.current = false
      setIsInteracting(false)
      return
    }

    if (isDragging) {
      const diff = touchCurrentXRef.current - touchStartXRef.current
      const threshold = 45

      if (diff < -threshold) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      } else if (diff > threshold) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }
      setDragOffset(0)
      setIsDragging(false)
      setIsInteracting(false)
    }
  }

  // GESTION DU GLISSEMENT À LA SOURIS (DESKTOP)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return

    if (scaleRef.current > 1.05) {
      isPanningRef.current = true
      setIsInteracting(true)
      touchStartPosRef.current = { x: e.clientX, y: e.clientY }
      panStartRef.current = { ...positionRef.current }
    } else if (images.length > 1) {
      isMouseDownRef.current = true
      mouseStartXRef.current = e.clientX
      setIsDragging(true)
      setIsInteracting(true)
    }
  }

  const handleMouseMove = (e) => {
    if (isPanningRef.current && scaleRef.current > 1.05) {
      const deltaX = e.clientX - touchStartPosRef.current.x
      const deltaY = e.clientY - touchStartPosRef.current.y
      const rawX = panStartRef.current.x + deltaX
      const rawY = panStartRef.current.y + deltaY

      const maxX = Math.max(0, (window.innerWidth * (scaleRef.current - 1)) / 1.8)
      const maxY = Math.max(0, (window.innerHeight * (scaleRef.current - 1)) / 1.8)

      setPosition({
        x: Math.min(maxX, Math.max(-maxX, rawX)),
        y: Math.min(maxY, Math.max(-maxY, rawY)),
      })
    } else if (isMouseDownRef.current && scaleRef.current <= 1.05 && images.length > 1) {
      const diff = e.clientX - mouseStartXRef.current
      setDragOffset(diff)
    }
  }

  const handleMouseUp = () => {
    if (isPanningRef.current) {
      isPanningRef.current = false
      setIsInteracting(false)
      return
    }

    if (isMouseDownRef.current && images.length > 1) {
      const diff = mouseStartXRef.current ? (touchCurrentXRef.current || 0) : 0
      // diff handled by dragOffset
      const threshold = 45

      if (dragOffset < -threshold) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      } else if (dragOffset > threshold) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }

      isMouseDownRef.current = false
      setDragOffset(0)
      setIsDragging(false)
      setIsInteracting(false)
    }
  }

  const handleMouseLeave = () => {
    if (isPanningRef.current) {
      isPanningRef.current = false
      setIsInteracting(false)
    }
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false
      setDragOffset(0)
      setIsDragging(false)
      setIsInteracting(false)
    }
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    if (scaleRef.current > 1.05) {
      resetZoom()
    } else {
      setScale(2.5)
      setPosition({ x: 0, y: 0 })
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

      {/* Bouton Zoom In / Zoom Out */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (scale > 1.05) {
            resetZoom()
          } else {
            setScale(2.5)
            setPosition({ x: 0, y: 0 })
          }
        }}
        className="absolute top-4 right-17 sm:top-6 sm:right-22 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
        aria-label={scale > 1.05 ? t.dishModal.zoomOut : t.dishModal.zoomIn}
        title={scale > 1.05 ? t.dishModal.zoomOut : t.dishModal.zoomIn}
      >
        {scale > 1.05 ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        )}
      </button>

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

      {/* FLÈCHES BLANCHES LATÉRALES DE DÉFILEMENT (GAUCHE ET DROITE) - masquées en zoom */}
      {images.length > 1 && scale <= 1.05 && (
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

      {images.length > 1 && scale <= 1.05 && (
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
        Navigation fluide par swipe / drag et zoom
      */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-16 overflow-hidden select-none"
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          touchAction: 'none',
          cursor: scale > 1.05 ? (isInteracting ? 'grabbing' : 'grab') : (images.length > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'),
        }}
      >
        <div
          className={`relative max-w-[92vw] max-h-[82vh] flex items-center justify-center ${
            isInteracting ? 'transition-none' : 'transition-transform duration-300 ease-out'
          }`}
          style={{
            transform: scale > 1.05
              ? `translate(${position.x}px, ${position.y}px) scale(${scale})`
              : `translateX(${dragOffset}px)`,
            touchAction: 'none',
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={handleDoubleClick}
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

      {/* BADGE QUAND L'IMAGE EST ZOOMÉE : Indique le zoom et permet de réinitialiser facilement */}
      {scale > 1.05 && (
        <div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/80 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-xs text-white shadow-xl animate-in fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-mono">{Math.round(scale * 10) / 10}x</span>
          <span className="w-1 h-1 rounded-full bg-white/40"></span>
          <button
            type="button"
            onClick={resetZoom}
            className="text-stone-300 hover:text-white underline cursor-pointer"
          >
            {t.dishModal.zoomOut}
          </button>
        </div>
      )}

      {/* 
        INDICATEURS DE PAGINATION (UNIQUEMENT LES PETITS POINTS EN BAS) - masqués en zoom
      */}
      {images.length > 1 && scale <= 1.05 && (
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
              className="p-1.5 cursor-pointer focus:outline-hidden transition-all group"
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
