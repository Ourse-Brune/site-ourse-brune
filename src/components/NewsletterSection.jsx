import { useState } from 'react'
import { formatTypography } from '../utils/typography'
import { TRANSLATIONS } from '../data/translations'

export default function NewsletterSection({
  bannerTitle = 'NEWSLETTER / ACTUALITÉS',
  events = [],
  actualiteText = '',
  actualiteTextEn = '',
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  language = 'fr',
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = externalIsOpen !== undefined
  const isOpen = isControlled ? externalIsOpen : internalIsOpen
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr
  const isDefaultTitle = !bannerTitle || bannerTitle.replace(/[\s\u00A0]+/g, ' ').trim().toUpperCase().includes('NEWSLETTER') || bannerTitle.replace(/[\s\u00A0]+/g, ' ').trim().toUpperCase().includes('ACTUALIT')
  const displayTitle = isDefaultTitle ? t.banners.newsletter : bannerTitle

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
    const el = document.getElementById('actualites')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          _gotcha: honeypot,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSubscribed(true)
        setEmail('')
        setErrorMessage('')
      } else {
        setErrorMessage(data.error || t.newsletter.errorText)
      }
    } catch (err) {
      console.error('Erreur newsletter :', err)
      setErrorMessage(t.newsletter.errorText)
    } finally {
      setIsLoading(false)
    }
  }

  const defaultParagraphs = [
    t.newsletter.p1,
    t.newsletter.p2,
  ]

  const customActualite = language === 'en' ? actualiteTextEn : actualiteText
  const paragraphs = customActualite
    ? customActualite.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : defaultParagraphs

  return (
    <section id="actualites" className="w-full bg-black flex flex-col items-center scroll-mt-20">
      <div className="w-full flex flex-col">
        {/* BANDEAU NEWSLETTER / ACTUALITÉS (Noir) — PLEINE LARGEUR */}
        <button
          type="button"
          onClick={toggle}
          className="group relative w-full py-10 sm:py-14 bg-black hover:bg-stone-950 transition-colors duration-200 cursor-pointer flex items-center justify-center text-center px-6 block leading-none"
          aria-expanded={isOpen}
        >
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-[0.14em] sm:tracking-[0.2em] text-white uppercase font-sans">
            {formatTypography(displayTitle, language)}
          </h2>
        </button>

        {/* CONTENU DÉPLIABLE DE LA SECTION NEWSLETTER ET ACTUALITÉS */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-white pt-10 sm:pt-14 pb-0 flex flex-col items-center text-black">
            
            {/* 1. SECTION NEWSLETTER (Texte administrable dans Sanity + Formulaire d'inscription) */}
            <div className="w-full max-w-3xl px-4 sm:px-8 space-y-4 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{formatTypography(p, language)}</p>
              ))}
            </div>

            {/* Champ de saisie simple sans logo */}
            <div className="w-full max-w-md px-4 mb-12 sm:mb-16">
              {errorMessage && (
                <div className="mb-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium text-center">
                  {errorMessage}
                </div>
              )}

              {subscribed ? (
                <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 text-sm font-medium text-center">
                  {t.newsletter.subscribedSuccess}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  {/* Honeypot anti-spam caché */}
                  <input
                    type="text"
                    name="_gotcha"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex="-1"
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.newsletter.emailPlaceholder}
                    className="flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm bg-white text-black placeholder-stone-400 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-lg bg-black hover:bg-stone-800 text-white font-bold tracking-wider text-xs sm:text-sm uppercase transition-colors cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading && (
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{isLoading ? t.newsletter.submittingBtn : t.newsletter.subscribeBtn}</span>
                  </button>
                </form>
              )}
            </div>

            {/* 2. ACTUALITÉS ET ÉVÉNEMENTS (VISUEL À GAUCHE, INFORMATIONS À DROITE SANS ENCADREMENT DE TABLEAU) */}
            {events && events.length > 0 && (
              <div className="w-full max-w-5xl px-4 sm:px-8 mb-12 sm:mb-16">
                <div className="space-y-10 sm:space-y-12">
                  {events.map((evt) => {
                    const isDefaultEvt = evt.id === 'event-demo-atelier'
                    const eventTitle =
                      language === 'en'
                        ? evt.titleEn || (isDefaultEvt ? 'Exhibition and Open Studio' : evt.title)
                        : evt.title
                    const eventDate =
                      language === 'en'
                        ? evt.dateEn || (isDefaultEvt ? 'Autumn 2026' : evt.date)
                        : evt.date
                    const eventDesc =
                      language === 'en'
                        ? evt.descriptionEn ||
                          (isDefaultEvt
                            ? 'Exhibition and open studio days to discover new pieces and meet the artist.'
                            : evt.description)
                        : evt.description
                    const eventLinkText =
                      language === 'en'
                        ? evt.linkTextEn || t.newsletter.learnMore
                        : evt.linkText || 'En savoir plus'

                    return (
                      <div
                        key={evt.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-start"
                      >
                        {/* Colonne Gauche : Visuel de l'événement */}
                        <div className="sm:col-span-5 flex justify-center sm:justify-start">
                          <div className="relative overflow-hidden rounded-xl border border-stone-200 shadow-md bg-stone-100 w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center">
                            <img
                              src={evt.image || '/images/COCTEAU-MALEINE.JPG'}
                              alt={eventTitle || 'Visuel de l’événement'}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        {/* Colonne Droite : Titre, date, description et liens utiles (alignés en haut avec l'image) */}
                        <div className="sm:col-span-7 flex flex-col justify-start text-left pt-0">
                          {eventDate && (
                            <span className="inline-block px-3 py-1 mb-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300 w-fit">
                              {formatTypography(eventDate, language)}
                            </span>
                          )}

                          {eventTitle && (
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider text-black font-sans mb-3">
                              {formatTypography(eventTitle, language)}
                            </h3>
                          )}

                          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans mb-6">
                            {formatTypography(eventDesc, language)}
                          </p>

                          {evt.link && (
                            <div>
                              <a
                                href={evt.link}
                                target={evt.link.startsWith('http') ? '_blank' : '_self'}
                                rel={evt.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black hover:bg-stone-800 text-white font-bold tracking-wider text-xs sm:text-sm uppercase transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                              >
                                <span>{formatTypography(eventLinkText, language)}</span>
                                <svg
                                  className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                  />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* FLÈCHE NOIRE PLEINE LARGEUR COLLÉE AU PIED DE PAGE SANS AUCUN VIDE */}
            <button
              type="button"
              onClick={collapse}
              className="w-full block border-0 p-0 m-0 bg-transparent cursor-pointer transition-opacity duration-200 hover:opacity-85 focus:outline-hidden leading-none select-none"
              title={t.newsletter.collapse}
              aria-label={t.newsletter.collapse}
            >
              <img
                src="/images/FLECHE-NOIRE.png"
                alt={t.newsletter.collapse}
                className="w-full h-auto block select-none pointer-events-none"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
