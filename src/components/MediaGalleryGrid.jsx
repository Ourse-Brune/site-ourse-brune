export default function MediaGalleryGrid({ images = [], title = '', onImageClick }) {
  if (!images || images.length === 0) return null

  // 1 image : respecte le ratio naturel (ne rogne pas les formats panoramiques / bandeaux)
  if (images.length === 1) {
    return (
      <div
        onClick={() => onImageClick && onImageClick(0)}
        className="relative w-full rounded-2xl border border-stone-200/90 shadow-sm bg-stone-100 overflow-hidden cursor-pointer group flex items-center justify-center transition-all duration-300 hover:shadow-md"
      >
        <img
          src={images[0]}
          alt={title || 'Visuel'}
          className="w-full h-auto max-h-[460px] object-cover transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
        />
        {/* Overlay discret au survol avec loupe */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg backdrop-blur-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  // 2 images : 2 colonnes égales côte à côte
  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => onImageClick && onImageClick(idx)}
            className="relative w-full rounded-xl border border-stone-200/90 shadow-sm bg-stone-100 overflow-hidden cursor-pointer group aspect-[4/3] flex items-center justify-center transition-all duration-300 hover:shadow-md"
          >
            <img
              src={img}
              alt={`${title} - ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg backdrop-blur-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 3 images : 1 grande en haut (16/9) + 2 en dessous (4/3)
  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
        <div
          onClick={() => onImageClick && onImageClick(0)}
          className="col-span-2 relative w-full rounded-xl border border-stone-200/90 shadow-sm bg-stone-100 overflow-hidden cursor-pointer group aspect-[16/9] flex items-center justify-center transition-all duration-300 hover:shadow-md"
        >
          <img
            src={images[0]}
            alt={`${title} - 1`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg backdrop-blur-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </div>
        </div>
        {images.slice(1).map((img, idx) => (
          <div
            key={idx + 1}
            onClick={() => onImageClick && onImageClick(idx + 1)}
            className="relative w-full rounded-xl border border-stone-200/90 shadow-sm bg-stone-100 overflow-hidden cursor-pointer group aspect-[4/3] flex items-center justify-center transition-all duration-300 hover:shadow-md"
          >
            <img
              src={img}
              alt={`${title} - ${idx + 2}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg backdrop-blur-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 4 images ou plus : grille 2x2 avec badge sur la 4ème si > 4
  const displayImages = images.slice(0, 4)
  const remainingCount = images.length - 4

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
      {displayImages.map((img, idx) => {
        const isLastAndHasMore = idx === 3 && remainingCount > 0
        return (
          <div
            key={idx}
            onClick={() => onImageClick && onImageClick(idx)}
            className="relative w-full rounded-xl border border-stone-200/90 shadow-sm bg-stone-100 overflow-hidden cursor-pointer group aspect-[4/3] flex items-center justify-center transition-all duration-300 hover:shadow-md"
          >
            <img
              src={img}
              alt={`${title} - ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {isLastAndHasMore ? (
              <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center text-white font-bold text-lg sm:text-xl backdrop-blur-xs transition-colors hover:bg-black/75">
                <span>+{remainingCount}</span>
                <span className="text-[10px] tracking-widest uppercase font-normal text-stone-300 mt-0.5">photos</span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg backdrop-blur-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
