import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-[--color-bg-dark]">
      <div className="max-w-xl mx-auto">
        <h1 className="text-9xl font-extrabold text-[--color-primary] animate-pulse drop-shadow-lg">
          404
        </h1>
        <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-[--color-text-light]">
          Whoops! Looks like you&apos;ve gone off the beaten path.
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          The page you&apos;re looking for might have been moved, deleted, or
          never existed. Don&apos;t worry, there&apos;s a showtime waiting for
          you back at the main cinema.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center px-6 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 hover:!text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Vibe Pass
          </Link>
          <Link
            href="/movies"
            className="text-[--color-primary] hover:text-[--color-primary-hover] font-medium transition-colors"
          >
            Browse all movies
          </Link>
        </div>
      </div>
    </div>
  )
}
