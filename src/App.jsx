import { useState, useEffect } from 'react'
import Header from './components/Header'
import SeriesSection from './components/SeriesSection'
import SurMesureSection from './components/SurMesureSection'
import OurseBruneSection from './components/OurseBruneSection'
import ContactSection from './components/ContactSection'
import NewsletterSection from './components/NewsletterSection'
import DishModal from './components/DishModal'
import Footer from './components/Footer'
import { SERIES_LIST, SITE_BANNERS_DEFAULT, DEFAULT_EVENTS } from './data/siteData'
import { sanityClient, urlFor } from './lib/sanity'

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
    name: p.title,
    type: p.dimensions || '',
    material: p.material || '',
    edition: p.exemplaires || '',
    status: statusText,
    statusColor,
    image: mainImageUrl,
    fullImage: fullImageUrl,
    gallery: galleryUrls,
    serie: p.serieSlug || p.serie,
    order: p.order ?? 99,
  }
}

function App() {
  const [seriesList, setSeriesList] = useState(SERIES_LIST)
  const [siteBanners, setSiteBanners] = useState(SITE_BANNERS_DEFAULT)
  const [events, setEvents] = useState(DEFAULT_EVENTS)
  const [ourseBruneText, setOurseBruneText] = useState('')
  const [contactText, setContactText] = useState('')
  const [actualiteText, setActualiteText] = useState('')
  const [selectedDish, setSelectedDish] = useState(null)
  const [contactSubject, setContactSubject] = useState("Commande d'une pièce")

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
        ])

        if (sanityOurseBrune?.storyText) {
          setOurseBruneText(sanityOurseBrune.storyText)
        }

        if (sanityContact?.text) {
          setContactText(sanityContact.text)
        }

        if (sanityActualite?.text) {
          setActualiteText(sanityActualite.text)
        }

        if (sanityEvents && sanityEvents.length > 0) {
          const formatted = sanityEvents.map((ev) => ({
            id: ev._id,
            title: ev.title,
            date: ev.date || '',
            image: ev.image ? urlFor(ev.image).width(900).url() : '/images/COCTEAU-MALEINE.JPG',
            description: ev.description || '',
            link: ev.link || '',
            linkText: ev.linkText || 'En savoir plus',
            order: ev.order ?? 1,
          }))
          setEvents(formatted)
        }

        if (sanityBanners) {
          setSiteBanners((prev) => ({
            ...prev,
            surMesureTitle: sanityBanners.surMesureTitle || prev.surMesureTitle,
            surMesureBanner: sanityBanners.surMesureBanner
              ? urlFor(sanityBanners.surMesureBanner).width(1600).url()
              : prev.surMesureBanner,
            ourseBruneTitle: sanityBanners.ourseBruneTitle || prev.ourseBruneTitle,
            contactTitle: sanityBanners.contactTitle || prev.contactTitle,
            newsletterTitle: sanityBanners.newsletterTitle || prev.newsletterTitle,
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
              title: s.title,
              bannerText: s.bannerText || s.title,
              bannerSubtitle: s.bannerSubtitle || '',
              bannerImg: bannerUrl,
              order: s.order ?? 99,
              description: s.description || '',
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
    setContactSubject(pieceName ? `Commande : ${pieceName}` : "Commande d'une pièce")
    const el = document.getElementById('contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleContactClick = (subject) => {
    setContactSubject(subject || "Projet sur-mesure")
    const el = document.getElementById('contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNavigate = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col items-center">
      {/* HEADER HERO (Ours pleine largeur avec logo et menu hamburger 2 barres) */}
      <Header onNavigate={handleNavigate} />

      {/* MAIN CONTAINER (RIDEAU QUI REMONTE SUR L'OURS FIXE) */}
      <main className="relative z-10 w-full flex flex-col items-center bg-white shadow-[0_-12px_30px_rgba(0,0,0,0.25)]">
        {/* 6 SÉRIES ACCORDÉON AVEC BANDEAUX ET TEXTES SUPERPOSÉS */}
        <SeriesSection
          seriesList={seriesList}
          onSelectDish={setSelectedDish}
        />

        {/* LE SUR-MESURE */}
        <SurMesureSection
          bannerTitle={siteBanners.surMesureTitle}
          bannerImage={siteBanners.surMesureBanner}
          onContactClick={handleContactClick}
        />

        {/* OURSE BRUNE ? (Bandeau Bordeaux) */}
        <OurseBruneSection
          bannerTitle={siteBanners.ourseBruneTitle}
          storyText={ourseBruneText}
        />

        {/* CONTACT / COMMANDE (Bandeau Jaune) */}
        <ContactSection
          initialSubject={contactSubject}
          bannerTitle={siteBanners.contactTitle}
          contactText={contactText}
        />

        {/* ACTUALITÉS / NEWSLETTER (Bandeau Noir) */}
        <NewsletterSection
          bannerTitle={siteBanners.newsletterTitle}
          events={events}
          actualiteText={actualiteText}
        />
      </main>

      {/* FOOTER */}
      <div className="relative z-10 w-full bg-black">
        <Footer />
      </div>

      {/* LIGHTBOX MODAL SANS FLÈCHES, AVEC POINTS ET NAVIGATION SWIPE / DRAG */}
      {selectedDish && (
        <DishModal
          key={selectedDish.id}
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onOrder={handleOrderPiece}
        />
      )}
    </div>
  )
}

export default App
