export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold">
            Neighborhood Listing Platform
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            A community-focused platform for discovering local property
            listings, neighborhood sponsors, and accessible voice assistance.
          </p>
        </header>

        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">
            Platform Features
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Property Listings</h3>
              <p className="mt-2 text-gray-600">
                Explore available properties in your neighborhood.
              </p>
            </article>

            <article className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">
                Neighborhood Sponsors
              </h3>
              <p className="mt-2 text-gray-600">
                Discover local businesses and organizations supporting the
                community.
              </p>
            </article>

            <article className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Voice Help</h3>
              <p className="mt-2 text-gray-600">
                Use accessible voice assistance to navigate the platform.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}