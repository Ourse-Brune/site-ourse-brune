import { useState } from 'react'

export default function SurMesureSection({
  bannerTitle = 'LE SUR-MESURE',
  bannerImage = '/images/nouveauxBandeauxClairs/BANDO_SUR-MESURE.jpg',
  onContactClick,
  isCenter = false,
}) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const collapse = () => {
    setIsOpen(false)
    const el = document.getElementById('section-sur-mesure')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="section-sur-mesure" className="w-full bg-white flex flex-col items-center scroll-mt-20">
      <div className="w-full flex flex-col">
        {/* BANDEAU LE SUR-MESURE — PLEINE LARGEUR SANS TEXTE DANS L'IMAGE */}
        <button
          type="button"
          data-banner-id="sur-mesure"
          onClick={toggle}
          className="group relative w-full aspect-[1366/318] min-h-[140px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[260px] overflow-hidden bg-stone-900 cursor-pointer text-left focus:outline-hidden block leading-none"
          aria-expanded={isOpen}
        >
          <img
            src={bannerImage}
            alt={bannerTitle}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-101 block"
          />

          {/* Overlay sombre au repos, s'efface au survol ou au centre de l'écran sur mobile */}
          <div
            className={`absolute inset-0 bg-black/70 group-hover:bg-black/0 transition-all duration-500 pointer-events-none ${
              isCenter ? 'opacity-0' : 'opacity-100'
            }`}
          ></div>

          {/* TEXTE DU BANDEAU SUPERPOSÉ (S'EFFACE AU SURVOL SOURIS OU AU CENTRE SUR MOBILE) */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none transition-all duration-500 group-hover:opacity-0 ${
              isCenter ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[0.16em] sm:tracking-[0.22em] md:tracking-[0.28em] text-white uppercase drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] font-sans">
              {bannerTitle}
            </h2>
          </div>
        </button>

        {/* CONTENU DÉPLIABLE DU SUR-MESURE */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-white pt-12 sm:pt-16 pb-0 flex flex-col items-center">
            {/* Texte noir sur blanc, sans fioritures, centré */}
            <div className="w-full max-w-3xl px-4 sm:px-8 space-y-6 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8 sm:mb-12">
              <p>
                La céramique permet de proposer des œuvres murales aux formats très divers et robustes dans le temps dedans comme dehors, quand on maîtrise le choix des terres et des émaux. Elles sont adaptées aux intempéries et ne subissent pas ou peu de dégradations évitant ainsi des rénovations futures.
              </p>
              <p>
                Ainsi, je permets à mes clients d’investir dans une décoration exceptionnellement durable.
              </p>
              <p>
                J'apprécie de sortir de mon atelier pour travailler en équipe, avec des entreprises comme des restaurants, hôtels, magasins et autres ou pour le compte d’architectes d’intérieurs. Pour ces derniers, je m'adapte aux cahiers des charges techniques et à la direction artistique des projets dans leur ensemble.
              </p>
              <p>
                Ce matériau noble permet aussi une décoration harmonieuse entre l’intérieur et l’extérieur, puisqu’elle est assurée par la même artiste.
              </p>
              <p className="pt-2 font-medium text-stone-500">
                Photo de fresque à venir.
              </p>
            </div>

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
