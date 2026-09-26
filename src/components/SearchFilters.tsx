export default function SearchFilters() {
  return (
    <form className="rounded-lg border bg-gray-50 p-4">
      <h2 className="text-lg font-semibold">Search Filters</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="bedrooms" className="block font-medium">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            className="mt-1 w-full rounded border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        <div>
          <label htmlFor="maxPrice" className="block font-medium">
            Maximum price
          </label>
          <select
            id="maxPrice"
            name="maxPrice"
            className="mt-1 w-full rounded border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <option value="">Any price</option>
            <option value="500000">$500,000</option>
            <option value="750000">$750,000</option>
            <option value="1000000">$1,000,000</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 rounded bg-blue-700 px-4 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Search properties
      </button>
    </form>
  );
}