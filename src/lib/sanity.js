import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'rerp2lu3',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'ourse-brune-studio',
  useCdn: false, // false pour voir immédiatement les publications sans délai de cache
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source) {
  if (!source) return ''
  return builder.image(source).auto('format').fit('max')
}
