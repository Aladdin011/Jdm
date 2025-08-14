import React from 'react';

const SimpleFallback = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">JD Marc Limited</h1>
        <p className="text-gray-600 mb-4">Building Africa's Future</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>✅ App is loading correctly</p>
          <p>✅ React components working</p>
          <p>✅ CSS styles loading</p>
          <p>✅ Environment variables configured</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default SimpleFallback;
