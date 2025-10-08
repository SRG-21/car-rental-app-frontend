import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="text-6xl mt-4">🚗💨</div>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-4 text-gray-600">
          Oops! Looks like this page took a wrong turn. Let's get you back on track.
        </p>
        <div className="mt-8">
          <Link to="/search" className="btn-primary px-8 py-3 text-base">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
