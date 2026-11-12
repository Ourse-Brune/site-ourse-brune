import { useState, useEffect } from 'react'
import Header from './components/Header'
import SeriesSection from './components/SeriesSection'
import SurMesureSection from './components/SurMesureSection'
import OurseBruneSection from './components/OurseBruneSection'
import ContactSection from './components/ContactSection'
import NewsletterSection from './components/NewsletterSection'
import DishModal from './components/DishModal'
import Footer from './components/Footer'
import { SERIES_LIST, SITE_BANNERS_DEFAULT, DEFAULT_EVENTS, DEFAULT_SUR_MESURE_PROJECTS } from './data/siteData'
import { sanityClient, urlFor } from './lib/sanity'
import { formatTypography } from './utils/typography'

function formatSanityDish(p) {
  let statusColor = 'orange'
  let statusText = 'SUR COMMANDE'
  if (p.status === 'disponible') {
    statusColor = 'green'
    statusText = 'DISPONIBLE'
  } else if (p.status === 'epuise') {
    statusColor = 'red'
    statusText = 'ÉPUISÉ'
  }

  const mainImageUrl = p.mainImage ? urlFor(p.mainImage).width(1000).url() : ''
  const fullImageUrl = p.fullImage ? urlFor(p.fullImage).width(1600).url() : mainImageUrl
  const galleryUrls = p.gallery && Array.isArray(p.gallery)
    ? p.gallery.map((img) => urlFor(img).width(1600).url())
    : []

  return {
    id: p._id,
    name: formatTypography(p.title),
    titleEn: p.titleEn ? formatTypography(p.titleEn, 'en') : '',
    type: formatTypography(p.dimensions || ''),
    dimensionsEn: p.dimensionsEn ? formatTypography(p.dimensionsEn, 'en') : '',
    material: formatTypography(p.material || ''),
    materialEn: p.materialEn ? formatTypography(p.materialEn, 'en') : '',
    edition: formatTypography(p.exemplaires || ''),
    exemplairesEn: p.exemplairesEn ? formatTypography(p.exemplairesEn, 'en') : '',
    description: formatTypography(p.description || ''),
    descriptionEn: p.descriptionEn ? formatTypography(p.descriptionEn, 'en') : '',
    status: formatTypography(statusText),
    statusColor,
    image: mainImageUrl,
    fullImage: fullImageUrl,
    gallery: galleryUrls,
    serie: p.serieSlug || p.serie,
    order: p.order ?? 99,
  }
}

function App() {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('site_lang') || 'fr'
    }
    return 'fr'
  })

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    try {
      localStorage.setItem('site_lang', lang)
    } catch (_) {}
  }

  const [seriesList, setSeriesList] = useState(SERIES_LIST)
  const [siteBanners, setSiteBanners] = useState(SITE_BANNERS_DEFAULT)
  const [events, setEvents] = useState(DEFAULT_EVENTS)
  const [surMesureProjects, setSurMesureProjects] = useState(DEFAULT_SUR_MESURE_PROJECTS)
  const [ourseBruneText, setOurseBruneText] = useState('')
  const [ourseBruneTextEn, setOurseBruneTextEn] = useState('')
  const [contactText, setContactText] = useState('')
  const [contactTextEn, setContactTextEn] = useState('')
  const [actualiteText, setActualiteText] = useState('')
  const [actualiteTextEn, setActualiteTextEn] = useState('')
  const [selectedDish, setSelectedDish] = useState(null)
  const [contactSubject, setContactSubject] = useState('')
  const [isOurseBruneOpen, setIsOurseBruneOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)
  const [activeCenterId, setActiveCenterId] = useState(null)

  // Détecte le bandeau situé au milieu de l'écran sur mobile/tactile
  useEffect(() => {
    const isTouchOrMobile = () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (max-width: 1024px)').matches

    const handleScroll = () => {
      if (!isTouchOrMobile()) {
        setActiveCenterId(null)
        return
      }

      const centerY = window.innerHeight / 2
      const banners = document.querySelectorAll('[data-banner-id]')
      let foundId = null

      for (const b of banners) {
        const rect = b.getBoundingClientRect()
        if (rect.top <= centerY && rect.bottom >= centerY) {
          foundId = b.getAttribute('data-banner-id')
          break
        }
      }

      setActiveCenterId(foundId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    async function loadData() {
      try {
        const [
          sanitySeries,
          sanityPieces,
          sanityBanners,
          sanityEvents,
          sanityOurseBrune,
          sanityContact,
          sanityActualite,
          sanitySurMesure,
        ] = await Promise.all([
          sanityClient.fetch(`*[_type == "serie" && !(_id in path("drafts.**"))] | order(order asc, _createdAt asc)`),
          sanityClient.fetch(
            `*[_type == "piece" && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
              ...,
              "serieSlug": coalesce(serie->slug.current, serie),
              "serieRef": serie._ref
            }`
          ),
          sanityClient.fetch(`*[_type == "siteBanners"][0]`),
          sanityClient.fetch(`*[_type == "event" && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc)`),
          sanityClient.fetch(`*[_type == "texteOurseBrune"][0]`),
          sanityClient.fetch(`*[_type == "texteContact"][0]`),
          sanityClient.fetch(`*[_type == "texteActualite"][0]`),
          sanityClient.fetch(`*[_type == "projetSurMesure" && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc)`),
        ])

        if (sanityOurseBrune?.storyText) {
          setOurseBruneText(formatTypography(sanityOurseBrune.storyText))
        }
        if (sanityOurseBrune?.storyTextEn) {
          setOurseBruneTextEn(formatTypography(sanityOurseBrune.storyTextEn, 'en'))
        }

        if (sanityContact?.text) {
          setContactText(formatTypography(sanityContact.text))
        }
        if (sanityContact?.textEn) {
          setContactTextEn(formatTypography(sanityContact.textEn, 'en'))
        }

        if (sanityActualite?.text) {
          setActualiteText(formatTypography(sanityActualite.text))
        }
        if (sanityActualite?.textEn) {
          setActualiteTextEn(formatTypography(sanityActualite.textEn, 'en'))
        }

        if (sanityEvents && sanityEvents.length > 0) {
          const formatted = sanityEvents.map((ev) => ({
            id: ev._id,
            title: formatTypography(ev.title),
            titleEn: ev.titleEn ? formatTypography(ev.titleEn, 'en') : '',
            date: formatTypography(ev.date || ''),
            dateEn: ev.dateEn ? formatTypography(ev.dateEn, 'en') : '',
            image: ev.image ? urlFor(ev.image).width(900).url() : '/images/COCTEAU-MALEINE.JPG',
            description: formatTypography(ev.description || ''),
            descriptionEn: ev.descriptionEn ? formatTypography(ev.descriptionEn, 'en') : '',
            link: ev.link || '',
            linkText: formatTypography(ev.linkText || 'En savoir plus'),
            linkTextEn: ev.linkTextEn ? formatTypography(ev.linkTextEn, 'en') : '',
            order: ev.order ?? 1,
          }))
          setEvents(formatted)
        }

        if (sanitySurMesure && sanitySurMesure.length > 0) {
          const formattedSurMesure = sanitySurMesure.map((proj) => ({
            id: proj._id,
            title: formatTypography(proj.title),
            titleEn: proj.titleEn ? formatTypography(proj.titleEn, 'en') : '',
            date: formatTypography(proj.date || ''),
            dateEn: proj.dateEn ? formatTypography(proj.dateEn, 'en') : '',
            image: proj.image ? urlFor(proj.image).width(900).url() : '/images/nouveauxBandeauxClairs/BANDO_SUR-MESURE.jpg',
            description: formatTypography(proj.description || ''),
            descriptionEn: proj.descriptionEn ? formatTypography(proj.descriptionEn, 'en') : '',
            order: proj.order ?? 1,
          }))
          setSurMesureProjects(formattedSurMesure)
        }

        if (sanityBanners) {
          setSiteBanners((prev) => ({
            ...prev,
            headerImage: sanityBanners.headerImage
              ? urlFor(sanityBanners.headerImage).width(2000).url()
              : prev.headerImage,
            surMesureTitle: formatTypography(sanityBanners.surMesureTitle || prev.surMesureTitle),
            surMesureTitleEn: sanityBanners.surMesureTitleEn
              ? formatTypography(sanityBanners.surMesureTitleEn, 'en')
              : prev.surMesureTitleEn,
            surMesureBanner: sanityBanners.surMesureBanner
              ? urlFor(sanityBanners.surMesureBanner).width(1600).url()
              : prev.surMesureBanner,
            ourseBruneTitle: formatTypography(sanityBanners.ourseBruneTitle || prev.ourseBruneTitle),
            ourseBruneTitleEn: sanityBanners.ourseBruneTitleEn
              ? formatTypography(sanityBanners.ourseBruneTitleEn, 'en')
              : prev.ourseBruneTitleEn,
            contactTitle: formatTypography(sanityBanners.contactTitle || prev.contactTitle),
            contactTitleEn: sanityBanners.contactTitleEn
              ? formatTypography(sanityBanners.contactTitleEn, 'en')
              : prev.contactTitleEn,
            newsletterTitle: formatTypography(sanityBanners.newsletterTitle || prev.newsletterTitle),
            newsletterTitleEn: sanityBanners.newsletterTitleEn
              ? formatTypography(sanityBanners.newsletterTitleEn, 'en')
              : prev.newsletterTitleEn,
          }))
        }

        if (sanitySeries && sanitySeries.length > 0) {
          const dynamicSeries = sanitySeries.map((s) => {
            const bannerUrl = s.bannerImage ? urlFor(s.bannerImage).width(1600).url() : ''
            const serieSlug = s.slug?.current || s._id.replace('serie-', '')

            const matchedPieces = sanityPieces
              ? sanityPieces
                  .filter((p) => (p.serieSlug || p.serie) === serieSlug || p.serieRef === s._id)
                  .map(formatSanityDish)
              : []

            return {
              id: serieSlug,
              title: formatTypography(s.title),
              titleEn: s.titleEn ? formatTypography(s.titleEn, 'en') : '',
              bannerText: formatTypography(s.bannerText || s.title),
              bannerTextEn: s.bannerTextEn ? formatTypography(s.bannerTextEn, 'en') : '',
              bannerSubtitle: formatTypography(s.bannerSubtitle || ''),
              bannerSubtitleEn: s.bannerSubtitleEn ? formatTypography(s.bannerSubtitleEn, 'en') : '',
              bannerImg: bannerUrl,
              order: s.order ?? 99,
              description: formatTypography(s.description || ''),
              descriptionEn: s.descriptionEn ? formatTypography(s.descriptionEn, 'en') : '',
              items: matchedPieces.length > 0 ? matchedPieces : (SERIES_LIST.find((loc) => loc.id === serieSlug)?.items || []),
              isReady: true,
            }
          })
          setSeriesList(dynamicSeries)
        } else if (sanityPieces && sanityPieces.length > 0) {
          setSeriesList((prevSeries) => {
            return prevSeries.map((serie) => {
              const matchedPieces = sanityPieces
                .filter((p) => (p.serieSlug || p.serie) === serie.id || p.serieRef === `serie-${serie.id}`)
                .map(formatSanityDish)

              if (matchedPieces.length > 0) {
                return {
                  ...serie,
                  items: matchedPieces,
                  isReady: true,
                }
              }
              return serie
            })
          })
        }
      } catch (err) {
        console.warn('Erreur lors du chargement des données Sanity, données locales conservées :', err)
      }
    }

    loadData()
  }, [])

  const handleOrderPiece = (pieceName) => {
    setSelectedDish(null)
    const orderPrefix = language === 'en' ? 'Order' : 'Commande'
    const defaultSubject = language === 'en' ? "Ordering a piece" : "Commande d'une pièce"
    setContactSubject(pieceName ? `${orderPrefix} : ${pieceName}` : defaultSubject)
    setIsContactOpen(true)
    setTimeout(() => {
      const el = document.getElementById('contact')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 60)
  }

  const handleContactClick = (subject) => {
    const defaultCustom = language === 'en' ? "Bespoke project" : "Projet sur-mesure"
    setContactSubject(subject || defaultCustom)
    setIsContactOpen(true)
    setTimeout(() => {
      const el = document.getElementById('contact')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 60)
  }

  const handleNavigate = (id) => {
    if (id === 'ourse-brune') {
      setIsOurseBruneOpen(true)
    } else if (id === 'contact') {
      setIsContactOpen(true)
    } else if (id === 'actualites' || id === 'newsletter') {
      setIsNewsletterOpen(true)
    }

    setTimeout(() => {
      const targetId = id === 'newsletter' ? 'actualites' : id
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 60)
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col items-center">
      {/* HEADER HERO (Ours pleine largeur avec logo et menu hamburger 2 barres) */}
      <Header
        onNavigate={handleNavigate}
        headerImage={siteBanners.headerImage}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* MAIN CONTAINER (RIDEAU QUI REMONTE SUR L'OURS FIXE) */}
      <main className="relative z-10 w-full flex flex-col items-center bg-white shadow-[0_-12px_30px_rgba(0,0,0,0.25)]">
        {/* 6 SÉRIES ACCORDÉON AVEC BANDEAUX ET TEXTES SUPERPOSÉS */}
        <SeriesSection
          seriesList={seriesList}
          onSelectDish={setSelectedDish}
          activeCenterId={activeCenterId}
          language={language}
        />

        {/* LE SUR-MESURE */}
        <SurMesureSection
          bannerTitle={language === 'en' && siteBanners.surMesureTitleEn ? siteBanners.surMesureTitleEn : siteBanners.surMesureTitle}
          bannerImage={siteBanners.surMesureBanner}
          projects={surMesureProjects}
          onContactClick={handleContactClick}
          isCenter={activeCenterId === 'sur-mesure'}
          language={language}
        />

        {/* OURSE BRUNE ? (Bandeau Bordeaux) */}
        <OurseBruneSection
          bannerTitle={language === 'en' && siteBanners.ourseBruneTitleEn ? siteBanners.ourseBruneTitleEn : siteBanners.ourseBruneTitle}
          storyText={ourseBruneText}
          storyTextEn={ourseBruneTextEn}
          isOpen={isOurseBruneOpen}
          onToggle={setIsOurseBruneOpen}
          language={language}
        />

        {/* CONTACT / COMMANDE (Bandeau Jaune) */}
        <ContactSection
          initialSubject={contactSubject}
          bannerTitle={language === 'en' && siteBanners.contactTitleEn ? siteBanners.contactTitleEn : siteBanners.contactTitle}
          contactText={contactText}
          contactTextEn={contactTextEn}
          isOpen={isContactOpen}
          onToggle={setIsContactOpen}
          language={language}
        />

        {/* NEWSLETTER / ACTUALITÉS (Bandeau Noir) */}
        <NewsletterSection
          bannerTitle={language === 'en' && siteBanners.newsletterTitleEn ? siteBanners.newsletterTitleEn : siteBanners.newsletterTitle}
          events={events}
          actualiteText={actualiteText}
          actualiteTextEn={actualiteTextEn}
          isOpen={isNewsletterOpen}
          onToggle={setIsNewsletterOpen}
          language={language}
        />
      </main>

      {/* FOOTER */}
      <div className="relative z-10 w-full bg-black">
        <Footer language={language} />
      </div>

      {/* LIGHTBOX MODAL SANS FLÈCHES, AVEC POINTS ET NAVIGATION SWIPE / DRAG */}
      {selectedDish && (
        <DishModal
          key={selectedDish.id}
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onOrder={handleOrderPiece}
          language={language}
        />
      )}
    </div>
  )
}

export default App
