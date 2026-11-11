import { useState } from 'react'

export default function SeriesSection({ seriesList, onSelectDish }) {
  // MEXICO ! est ouvert par défaut comme sur la maquette
  const [openSeries, setOpenSeries] = useState({ mexico: true })

  const toggleSeries = (id) => {
    setOpenSeries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const collapseSeries = (id) => {
    setOpenSeries((prev) => ({
      ...prev,
      [id]: false,
    }))
    const banner = document.getElementById(`series-${id}`)
    if (banner) {
      banner.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }


  return (
    <section id="series-section" className="w-full bg-white flex flex-col items-center">
      {/* Conteneur pleine largeur */}
      <div className="w-full flex flex-col divide-y-0">
        {seriesList.map((serie) => {
          const hasItems = Boolean(serie.items && serie.items.length > 0)
          const isOpen = hasItems && !!openSeries[serie.id]

          return (
            <div key={serie.id} id={`series-${serie.id}`} className="w-full flex flex-col scroll-mt-20">
              {/* BANDEAU DE SÉRIE — PLEINE LARGEUR D'ÉCRAN SANS TEXTE INCRUSTÉ */}
              <button
                type="button"
                onClick={() => hasItems && toggleSeries(serie.id)}
                className={`group relative w-full aspect-[1366/318] min-h-[140px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[260px] overflow-hidden bg-stone-900 text-left focus:outline-hidden block leading-none ${
                  hasItems ? 'cursor-pointer' : 'cursor-default'
                }`}
                aria-expanded={isOpen}
                aria-controls={hasItems ? `content-${serie.id}` : undefined}
                disabled={!hasItems}
              >
                <img
                  src={serie.bannerImg}
                  alt={serie.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-500 block ${
                    hasItems ? 'group-hover:scale-101' : ''
                  }`}
                />

                {/* Image 100% pure et lumineuse au repos, très léger voile de 5% au survol */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors duration-200"></div>

                {/* TEXTE DU BANDEAU SUPERPOSÉ (ÉDITABLE DANS SANITY) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-white uppercase drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] font-sans">
                    {serie.bannerText || serie.title}
                  </h2>
                  {serie.bannerSubtitle && (
                    <p className="mt-2 text-xs sm:text-sm md:text-base font-normal tracking-[0.15em] text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] uppercase">
                      {serie.bannerSubtitle}
                    </p>
                  )}
                </div>
              </button>

              {/* CONTENU DÉPLIABLE DE LA SÉRIE — AFFICHÉ UNIQUEMENT SI LA SÉRIE CONTIENT DES PIÈCES */}
              {hasItems && (
                <div
                  id={`content-${serie.id}`}
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[7000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="w-full bg-white pt-10 sm:pt-14 pb-0 flex flex-col items-center">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center">
                      {/* Texte d'introduction de la collection */}
                      {serie.description ? (
                        <p className="text-center text-sm sm:text-base md:text-lg text-stone-700 font-medium max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed">
                          {serie.description}
                        </p>
                      ) : null}

                      {/* Grille des pièces céramiques */}
                      <div className="w-full flex flex-col items-center">
                        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10 justify-items-center mb-8">
                          {serie.items.map((dish) => (
                            <div
                              key={dish.id}
                              onClick={() => onSelectDish(dish)}
                              className="group flex flex-col items-center text-center cursor-pointer max-w-[260px] w-full transition-all duration-300 hover:-translate-y-1.5"
                            >
                              {/* Photo principale de la céramique telle quelle avec bords arrondis */}
                              <div className="relative w-48 sm:w-52 md:w-56 aspect-square mb-4 rounded-xl overflow-hidden bg-stone-100 shadow-sm transition-all duration-300 group-hover:shadow-lg">
                                <img
                                  src={dish.image}
                                  alt={dish.name}
                                  className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                              </div>

                              {/* Détails de la pièce (texte distinct sous l'image) */}
                              <h3 className="text-sm sm:text-base font-extrabold tracking-wider text-stone-900 uppercase mb-1">
                                {dish.name}
                              </h3>
                              {dish.type && (
                                <p className="text-xs text-stone-600 font-medium mb-0.5">
                                  {dish.type}
                                </p>
                              )}
                              {dish.material && (
                                <p className="text-xs text-stone-600 font-medium mb-0.5">
                                  {dish.material}
                                </p>
                              )}
                              {dish.edition && (
                                <p className="text-xs text-stone-500 mb-1.5">
                                  {dish.edition}
                                </p>
                              )}

                              {/* État du produit (texte en gras sans bouton ni couleur) */}
                              <p className="text-xs sm:text-[13px] font-bold tracking-wider text-stone-900 uppercase">
                                {dish.status}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* FLÈCHE NOIRE — PLEINE LARGEUR BORD À BORD, COLLÉE DIRECTEMENT AU BANDEAU SUIVANT SANS AUCUN VIDE */}
                    <button
                      type="button"
                      onClick={() => collapseSeries(serie.id)}
                      className="w-full block border-0 p-0 m-0 mt-2 sm:mt-4 bg-transparent cursor-pointer transition-opacity duration-200 hover:opacity-85 focus:outline-hidden leading-none select-none"
                      title="Replier la série"
                      aria-label="Replier la série"
                    >
                      <img
                        src="/images/FLECHE-NOIRE.png"
                        alt="Replier la série"
                        className="w-full h-auto block select-none pointer-events-none"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
