import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 w-full h-screen">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-2xl text-gray-600">Oops! Page not found.</p>
      <Link
        to="/"
        className="
        inline-flex items-center text-zinc-800 hover:text-zinc-900 
        transition-colors duration-200
        "
    >
        <FiArrowLeft className="w-5 h-5 mr-2" />
            Go Home
    </Link>
    </div>
  );
}
