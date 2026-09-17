// src/app/program/page.tsx

export default function ProgramPage() {
  const programs = [
    {
      time: '10:00 AM',
      title: 'Wedding Ceremony',
      description:
        'Join us as we begin this beautiful journey surrounded by family and friends.',
      accent: 'bg-wine',
    },
    {
      time: '1:00 PM',
      title: 'Reception',
      description:
        'An afternoon of celebration, good food, music, laughter, and cherished memories.',
      accent: 'bg-mint-dark',
    },
    {
      time: '4:00 PM',
      title: 'Wedding Party',
      description:
        'Meet the wonderful people standing with us as we celebrate this special day.',
      accent: 'bg-emerald',
    },
    {
      time: '7:00 PM',
      title: 'Evening Celebration',
      description:
        'An unforgettable evening of dancing, joy, and celebration with everyone we love.',
      accent: 'bg-wine-light',
    },
  ];

  return (
    <main className="min-h-screen bg-cream px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald">
            OASIS&apos;26
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-wine sm:text-6xl">
            Wedding Programme
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
            Everything planned for our celebration. Come ready to share in the
            joy and make beautiful memories with us.
          </p>
        </header>

        {/* Programme */}
        <section className="mx-auto mt-10 max-w-3xl space-y-4 sm:mt-14">
          {programs.map((program) => (
            <article
              key={`${program.time}-${program.title}`}
              className="relative overflow-hidden rounded-[24px] border border-sand-dark/70 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div
                className={`absolute left-0 top-0 h-full w-1.5 ${program.accent}`}
              />

              <div className="pl-3 sm:pl-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald">
                  {program.time}
                </p>

                <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-wine sm:text-4xl">
                  {program.title}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
                  {program.description}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}