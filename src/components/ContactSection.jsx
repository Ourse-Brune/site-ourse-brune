import { useState, useEffect } from 'react'
import { formatTypography } from '../utils/typography'
import { TRANSLATIONS } from '../data/translations'

export default function ContactSection({
  initialSubject,
  bannerTitle = 'CONTACT / COMMANDE',
  contactText = '',
  contactTextEn = '',
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  language = 'fr',
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = externalIsOpen !== undefined
  const isOpen = isControlled ? externalIsOpen : internalIsOpen
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr
  const isDefaultTitle = !bannerTitle || bannerTitle.replace(/[\s\u00A0]+/g, ' ').trim().toUpperCase().includes('CONTACT')
  const displayTitle = isDefaultTitle ? t.banners.contact : bannerTitle

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject || t.contact.subjectPiece,
    message: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (initialSubject) {
      if (!isControlled) {
        setInternalIsOpen(true)
      }
      setFormData((prev) => ({
        ...prev,
        subject: initialSubject,
      }))
    }
  }, [initialSubject, isControlled])

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
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          _gotcha: honeypot,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSubmitted(true)
        setErrorMessage('')
      } else {
        setErrorMessage(data.error || t.contact.errorText)
      }
    } catch (err) {
      console.error('Erreur contact :', err)
      setErrorMessage(t.contact.errorText)
    } finally {
      setIsLoading(false)
    }
  }

  const defaultParagraphs = [
    t.contact.p1,
    t.contact.p2,
    t.contact.p3,
    t.contact.p4,
  ]

  const customContact = language === 'en' ? contactTextEn : contactText
  const paragraphs = customContact
    ? customContact.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : defaultParagraphs

  return (
    <section id="contact" className="w-full bg-white flex flex-col items-center scroll-mt-20">
      <div className="w-full flex flex-col">
        {/* BANDEAU CONTACT / COMMANDE (Jaune / Ocre) — PLEINE LARGEUR */}
        <button
          type="button"
          onClick={toggle}
          className="group relative w-full py-10 sm:py-14 bg-[#fba700] hover:bg-[#e69800] transition-colors duration-200 cursor-pointer flex items-center justify-center text-center px-6 block leading-none"
          aria-expanded={isOpen}
        >
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-[0.14em] sm:tracking-[0.2em] text-white uppercase font-sans">
            {formatTypography(displayTitle, language)}
          </h2>
        </button>

        {/* CONTENU DÉPLIABLE DU FORMULAIRE */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-white pt-12 sm:pt-16 pb-0 flex flex-col items-center text-black">
            {/* Modalités et délais de commande */}
            <div className="w-full max-w-3xl px-4 sm:px-8 space-y-6 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{formatTypography(p, language)}</p>
              ))}
            </div>

            {/* Texte d'introduction */}
            <div className="w-full max-w-3xl px-4 sm:px-8 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8">
              <p>{formatTypography(t.contact.intro, language)}</p>
            </div>

            {/* Formulaire simple (sans partie "pièce concernée") */}
            <div className="w-full max-w-xl px-4 mb-12">
              {submitted ? (
                <div className="p-8 sm:p-10 rounded-2xl bg-stone-50 border border-stone-200 text-center flex flex-col items-center">
                  <h4 className="text-xl font-bold text-black mb-2">
                    {t.contact.successTitle}
                  </h4>
                  <p className="text-sm sm:text-base text-stone-600 max-w-md leading-relaxed">
                    {t.contact.successText}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: t.contact.subjectPiece,
                        message: '',
                      })
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full bg-black hover:bg-stone-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium text-center">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        {t.contact.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.contact.namePlaceholder}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        {t.contact.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.contact.emailPlaceholder}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        {t.contact.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        disabled={isLoading}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t.contact.phonePlaceholder}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        {t.contact.subjectLabel}
                      </label>
                      <select
                        disabled={isLoading}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white disabled:opacity-60"
                      >
                        <option value={t.contact.subjectPiece}>{t.contact.subjectPiece}</option>
                        <option value={t.contact.subjectCustom}>{t.contact.subjectCustom}</option>
                        <option value={t.contact.subjectGallery}>{t.contact.subjectGallery}</option>
                        <option value={t.contact.subjectOther}>{t.contact.subjectOther}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                      {t.contact.messageLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      disabled={isLoading}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.contact.messagePlaceholder}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white disabled:opacity-60"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-lg bg-black hover:bg-stone-800 text-white font-bold tracking-wider uppercase text-sm shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{isLoading ? t.contact.submittingBtn : t.contact.submitBtn}</span>
                  </button>
                </form>
              )}
            </div>

            {/* FLÈCHE NOIRE PLEINE LARGEUR COLLÉE AU BANDEAU SUIVANT SANS AUCUN VIDE */}
            <button
              type="button"
              onClick={collapse}
              className="w-full block border-0 p-0 m-0 bg-transparent cursor-pointer transition-opacity duration-200 hover:opacity-85 focus:outline-hidden leading-none select-none"
              title={t.contact.collapse}
              aria-label={t.contact.collapse}
            >
              <img
                src="/images/FLECHE-NOIRE.png"
                alt={t.contact.collapse}
                className="w-full h-auto block select-none pointer-events-none"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
