import { useState } from 'react'
import { formatTypography } from '../utils/typography'
import { TRANSLATIONS } from '../data/translations'

export default function SurMesureSection({
  bannerTitle = 'LE SUR-MESURE',
  bannerImage = '/images/nouveauxBandeauxClairs/BANDO_SUR-MESURE.jpg',
  projects = [],
  onContactClick,
  isCenter = false,
  language = 'fr',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr
  const isDefaultTitle = !bannerTitle || bannerTitle.replace(/[\s\u00A0]+/g, ' ').trim().toUpperCase().includes('SUR-MESURE') || bannerTitle.replace(/[\s\u00A0]+/g, ' ').trim().toUpperCase().includes('SUR MESURE') || bannerTitle.replace(/[\s\u00A0]+/g, ' ').trim().toUpperCase().includes('BESPOKE')
  const displayTitle = isDefaultTitle ? t.banners.surMesure : bannerTitle

  const toggle = () => setIsOpen(!isOpen)

  const collapse = () => {
    setIsOpen(false)
    const el = document.getElementById('section-sur-mesure')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const paragraphs = [t.surMesure.p1, t.surMesure.p2, t.surMesure.p3, t.surMesure.p4]

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
            alt={displayTitle}
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
              {formatTypography(displayTitle, language)}
            </h2>
          </div>
        </button>

        {/* CONTENU DÉPLIABLE DU SUR-MESURE */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[6000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-white pt-12 sm:pt-16 pb-0 flex flex-col items-center">
            {/* Texte noir sur blanc, sans fioritures, centré */}
            <div className="w-full max-w-3xl px-4 sm:px-8 space-y-6 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-10 sm:mb-14">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{formatTypography(p, language)}</p>
              ))}
            </div>

            {/* RÉALISATIONS SUR-MESURE (VISUEL À GAUCHE, DATE / TITRE / DESCRIPTION À DROITE ALIGNÉS EN HAUT) */}
            {projects && projects.length > 0 && (
              <div className="w-full max-w-5xl px-4 sm:px-8 mb-12 sm:mb-16">
                <div className="space-y-10 sm:space-y-12">
                  {projects.map((proj) => {
                    const isDefault = proj.id === 'projet-fresque-restaurant'
                    const projectTitle =
                      language === 'en'
                        ? proj.titleEn || (isDefault ? t.surMesure?.defaultProject?.title : proj.title)
                        : proj.title
                    const projectDate =
                      language === 'en'
                        ? proj.dateEn || (isDefault ? t.surMesure?.defaultProject?.date : proj.date)
                        : proj.date
                    const projectDesc =
                      language === 'en'
                        ? proj.descriptionEn || (isDefault ? t.surMesure?.defaultProject?.description : proj.description)
                        : proj.description

                    return (
                      <div
                        key={proj.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-start"
                      >
                        {/* Colonne Gauche : Visuel du projet sur-mesure */}
                        <div className="sm:col-span-5 flex justify-center sm:justify-start">
                          <div className="relative overflow-hidden rounded-xl border border-stone-200 shadow-md bg-stone-100 w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center">
                            <img
                              src={proj.image || '/images/nouveauxBandeauxClairs/BANDO_SUR-MESURE.jpg'}
                              alt={projectTitle || 'Projet sur-mesure'}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        {/* Colonne Droite : Date en haut, Titre en dessous, Description encore en dessous (alignés en haut avec l'image) */}
                        <div className="sm:col-span-7 flex flex-col justify-start text-left pt-0">
                          {projectDate && (
                            <span className="inline-block px-3 py-1 mb-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300 w-fit">
                              {formatTypography(projectDate, language)}
                            </span>
                          )}

                          {projectTitle && (
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider text-black font-sans mb-3">
                              {formatTypography(projectTitle, language)}
                            </h3>
                          )}

                          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
                            {formatTypography(projectDesc, language)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* FLÈCHE NOIRE PLEINE LARGEUR COLLÉE AU BANDEAU SUIVANT SANS AUCUN VIDE */}
            <button
              type="button"
              onClick={collapse}
              className="w-full block border-0 p-0 m-0 bg-transparent cursor-pointer transition-opacity duration-200 hover:opacity-85 focus:outline-hidden leading-none select-none"
              title={t.surMesure.collapse}
              aria-label={t.surMesure.collapse}
            >
              <img
                src="/images/FLECHE-NOIRE.png"
                alt={t.surMesure.collapse}
                className="w-full h-auto block select-none pointer-events-none"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
