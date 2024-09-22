import React from 'react';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-500 to-orange-500 p-4 md:p-1">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl text-gray-600 mb-6">Oops! Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <a 
          href="/" 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
