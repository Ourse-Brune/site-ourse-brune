import { useState, useEffect } from 'react'
import { CONTACT_POLICY } from '../data/siteData'

export default function ContactSection({
  initialSubject,
  bannerTitle = 'CONTACT / COMMANDE',
  contactText = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject || "Commande d'une pièce",
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (initialSubject) {
      setIsOpen(true)
      setFormData((prev) => ({
        ...prev,
        subject: initialSubject || prev.subject,
      }))
    }
  }, [initialSubject])

  const toggle = () => setIsOpen(!isOpen)

  const collapse = () => {
    setIsOpen(false)
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

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
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-[0.14em] sm:tracking-[0.2em] text-white uppercase font-sans">
            {bannerTitle}
          </h2>
        </button>

        {/* CONTENU DÉPLIABLE DU FORMULAIRE */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-white pt-12 sm:pt-16 pb-0 flex flex-col items-center text-black">
            {/* Texte d'introduction : sans style et pas dans un bloc */}
            <div className="w-full max-w-3xl px-4 sm:px-8 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8">
              <p>Pour toute question ou commande, merci d’utiliser le formulaire ici</p>
            </div>

            {/* Formulaire simple (sans partie "pièce concernée") */}
            <div className="w-full max-w-xl px-4 mb-10">
              {submitted ? (
                <div className="p-8 sm:p-10 rounded-2xl bg-stone-50 border border-stone-200 text-center flex flex-col items-center">
                  <h4 className="text-xl font-bold text-black mb-2">
                    Merci pour votre message !
                  </h4>
                  <p className="text-sm sm:text-base text-stone-600 max-w-md leading-relaxed">
                    Votre demande a bien été transmise à l'atelier Ourse Brune. Je vous répondrai dans les plus brefs délais.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: "Commande d'une pièce",
                        message: '',
                      })
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full bg-black hover:bg-stone-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Adresse Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.fr"
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Téléphone (optionnel)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06 12 34 56 78"
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Objet de votre demande *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white"
                      >
                        <option value="Commande d'une pièce">Commande d'une pièce</option>
                        <option value="Projet sur-mesure">Projet sur-mesure / Fresque</option>
                        <option value="Galerie & Exposition">Galerie & Exposition</option>
                        <option value="Autre demande">Autre demande</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Précisez votre demande, questions ou souhaits particuliers..."
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all text-sm bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-lg bg-black hover:bg-stone-800 text-white font-bold tracking-wider uppercase text-sm shadow-md transition-all duration-200 cursor-pointer"
                  >
                    Envoyer ma demande
                  </button>
                </form>
              )}
            </div>

            {/* Modalités & délais de commande : texte administrable dans Sanity */}
            {(() => {
              const paragraphs = contactText
                ? contactText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
                : [
                    CONTACT_POLICY.p1,
                    CONTACT_POLICY.p2,
                    CONTACT_POLICY.p3,
                    CONTACT_POLICY.p4,
                  ]

              return (
                <div className="w-full max-w-3xl px-4 sm:px-8 space-y-6 text-black text-center text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-12">
                  {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )
            })()}

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
