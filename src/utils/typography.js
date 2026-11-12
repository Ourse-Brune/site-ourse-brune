/**
 * Utilitaire de typographie française automatique :
 * 1. Supprime les césures / tirets conditionnels invisibles (soft hyphens \u00AD).
 * 2. Remplace le signe & par le mot "et" (sauf entités HTML).
 * 3. Ajoute une espace insécable (\u00A0) avant les ponctuations doubles (!, ?, ;, :)
 *    sans altérer les URLs (comme https://).
 * 4. Ajoute une espace insécable après « et avant ».
 * 5. Ajoute une espace insécable avant les symboles % et €.
 */
export function formatTypography(str, lang = 'fr') {
  if (typeof str !== 'string' || !str) return str

  // Supprime les soft hyphens (césures invisibles)
  const cleaned = str.replace(/\u00AD/g, '')

  if (lang === 'en') {
    return cleaned.replace(/[ \t\u00A0\u202F]*&(?![a-zA-Z0-9#]+;)[ \t\u00A0\u202F]*/g, ' and ')
  }

  return cleaned
    // Remplace le signe & isolé ou entouré d'espaces par "et" (sans toucher aux entités comme &nbsp; ou &bull;)
    .replace(/[ \t\u00A0\u202F]*&(?![a-zA-Z0-9#]+;)[ \t\u00A0\u202F]*/g, ' et ')
    // Espace insécable après guillemet ouvrant «
    .replace(/«[ \t\u00A0\u202F]*/g, '«\u00A0')
    // Espace insécable avant guillemet fermant »
    .replace(/[ \t\u00A0\u202F]*»/g, '\u00A0»')
    // Espace insécable avant ponctuation double (! ? ; : % €), en préservant les URLs (http://, https://)
    .replace(/([^\s\n\r/])[ \t\u00A0\u202F]*(:(?!\/\/)|[!?;%€])/g, '$1\u00A0$2')
}

