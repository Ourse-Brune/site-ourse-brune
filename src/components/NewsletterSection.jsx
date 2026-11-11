import { useState } from 'react'

export default function NewsletterSection({
  bannerTitle = 'ACTUALITÉS / NEWSLETTER',
  events = [],
  actualiteText = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const collapse = () => {
    setIsOpen(false)
    const el = document.getElementById('actualites')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
    }
  }

  return (
    <section id="actualites" className="w-full bg-white flex flex-col items-center scroll-mt-20">
      <div className="w-full flex flex-col">
        {/* BANDEAU ACTUALITÉS / NEWSLETTER (Noir) — PLEINE LARGEUR */}
        <button
          type="button"
          onClick={toggle}
          className="group relative w-full py-10 sm:py-14 bg-black hover:bg-stone-950 transition-colors duration-200 cursor-pointer flex items-center justify-center text-center px-6 block leading-none"
          aria-expanded={isOpen}
        >
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-[0.14em] sm:tracking-[0.2em] text-white uppercase font-sans">
            {bannerTitle}
          </h2>
        </button>

        {/* CONTENU DÉPLIABLE DE LA SECTION ACTUALITÉS & NEWSLETTER */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-white pt-10 sm:pt-14 pb-0 flex flex-col items-center text-black">
            
            {/* 1. ACTUALITÉS & ÉVÉNEMENTS (VISUEL À GAUCHE, INFORMATIONS À DROITE SANS ENCADREMENT DE TABLEAU) */}
            {events && events.length > 0 && (
              <div className="w-full max-w-5xl px-4 sm:px-8 mb-12 sm:mb-16">
                <div className="space-y-10 sm:space-y-12">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-center"
                    >
                      {/* Colonne Gauche : Visuel de l'événement */}
                      <div className="sm:col-span-5 flex justify-center sm:justify-start">
                        <div className="relative overflow-hidden rounded-xl border border-stone-200 shadow-md bg-stone-100 w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center">
                          <img
                            src={evt.image || '/images/COCTEAU-MALEINE.JPG'}
                            alt={evt.title || 'Visuel de l’événement'}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Colonne Droite : Titre, date, description et liens utiles */}
                      <div className="sm:col-span-7 flex flex-col justify-center text-left">
                        {evt.date && (
                          <span className="inline-block px-3 py-1 mb-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300 w-fit">
                            {evt.date}
                          </span>
                        )}

                        {evt.title && (
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider text-black font-sans mb-3">
                            {evt.title}
                          </h3>
                        )}

                        <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans mb-6">
                          {evt.description}
                        </p>

                        {evt.link && (
                          <div>
                            <a
                              href={evt.link}
                              target={evt.link.startsWith('http') ? '_blank' : '_self'}
                              rel={evt.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black hover:bg-stone-800 text-white font-bold tracking-wider text-xs sm:text-sm uppercase transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                            >
                              <span>{evt.linkText || 'En savoir plus'}</span>
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
                  ))}
                </div>
              </div>
            )}


            {/* 2. SECTION NEWSLETTER (Texte administrable dans Sanity + Formulaire) */}
            {(() => {
              const paragraphs = actualiteText
                ? actualiteText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
                : [
                    'Vous ne trouverez pas Ourse Brune sur les réseaux sociaux, incompatibles avec mes valeurs.',
                    'Mais vous pouvez vous abonner à la Newsletter (maximum 2 par an).',
                  ]

              return (
                <div className="w-full max-w-3xl px-4 sm:px-8 space-y-4 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8">
                  {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )
            })()}

            {/* Champ de saisie simple sans logo */}
            <div className="w-full max-w-md px-4 mb-12">
              {subscribed ? (
                <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 text-sm font-medium text-center">
                  Votre inscription a bien été enregistrée. Merci !
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm bg-white text-black placeholder-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-black hover:bg-stone-800 text-white font-bold tracking-wider text-xs sm:text-sm uppercase transition-colors cursor-pointer shrink-0"
                  >
                    S'inscrire
                  </button>
                </form>
              )}
            </div>

            {/* FLÈCHE NOIRE PLEINE LARGEUR COLLÉE AU PIED DE PAGE SANS AUCUN VIDE */}
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

