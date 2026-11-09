import { useState } from 'react'

export default function NewsletterSection({ bannerTitle = 'ACTUALITÉS / NEWSLETTER' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupEmail, setPopupEmail] = useState('')
  const [popupSubscribed, setPopupSubscribed] = useState(false)

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

  const handlePopupSubscribe = (e) => {
    e.preventDefault()
    if (popupEmail) {
      setPopupSubscribed(true)
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

        {/* CONTENU DÉPLIABLE DE LA NEWSLETTER */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-white pt-12 sm:pt-16 pb-0 flex flex-col items-center text-black">
            {/* Texte noir sur blanc, sans fioritures, centré */}
            <div className="w-full max-w-3xl px-4 sm:px-8 space-y-4 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8">
              <p>
                Vous ne trouverez pas Ourse Brune sur les réseaux sociaux, incompatibles avec mes valeurs.
              </p>
              <p>
                Mais vous pouvez vous abonner à la Newsletter (maximum 2 par an).
              </p>
              <p className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(true)}
                  className="text-stone-600 hover:text-black underline underline-offset-4 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Lien vers une pop-up simple d’inscription à la Newsletter
                </button>
              </p>
            </div>

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

      {/* POP-UP SIMPLE D'INSCRIPTION À LA NEWSLETTER */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fermer la pop-up"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-black mb-2 text-center">
              Inscription à la Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-6 text-center leading-relaxed">
              Restez informé(e) des prochaines créations et expositions (maximum 2 par an).
            </p>

            {popupSubscribed ? (
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 text-sm font-medium text-center">
                Votre inscription a bien été enregistrée. Merci !
              </div>
            ) : (
              <form onSubmit={handlePopupSubscribe} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    required
                    value={popupEmail}
                    onChange={(e) => setPopupEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-sm bg-white text-black placeholder-stone-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-black hover:bg-stone-800 text-white font-bold tracking-wider text-xs sm:text-sm uppercase transition-colors cursor-pointer"
                >
                  S'inscrire
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
