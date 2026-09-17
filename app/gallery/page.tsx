// src/app/gallery/page.tsx

export default function GalleryPage() {
  const photos = [
    {
      id: 1,
      label: 'The Beginning',
      className: 'aspect-[4/5] bg-wine-soft',
    },
    {
      id: 2,
      label: 'Together',
      className: 'aspect-square bg-mint-light',
    },
    {
      id: 3,
      label: 'Forever',
      className: 'aspect-[4/5] bg-emerald-soft',
    },
    {
      id: 4,
      label: 'Our Day',
      className: 'aspect-square bg-blush',
    },
    {
      id: 5,
      label: 'Love & Laughter',
      className: 'aspect-[4/5] bg-mint',
    },
    {
      id: 6,
      label: 'A Beautiful Memory',
      className: 'aspect-square bg-wine-soft',
    },
  ];

  return (
    <main className="min-h-screen bg-cream px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald">
            OASIS&apos;26
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-wine sm:text-6xl">
            Our Gallery
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
            A collection of beautiful moments from a day we will always
            remember.
          </p>
        </header>

        {/* Gallery */}
        <section className="mt-10 columns-2 gap-3 sm:mt-14 sm:columns-3 sm:gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group mb-3 break-inside-avoid overflow-hidden rounded-[22px] border border-sand-dark/70 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:mb-4 sm:rounded-[26px] ${photo.className}`}
            >
              <div className="flex h-full min-h-40 items-end bg-gradient-to-t from-ink/40 via-transparent to-transparent p-4">
                <span className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-white sm:text-2xl">
                  {photo.label}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}