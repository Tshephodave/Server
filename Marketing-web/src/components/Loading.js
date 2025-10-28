import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="text-center space-y-4">
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-full h-full border-4 border-green-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-ping"></div>
          </div>
        </div>
        <div>
          <p className="text-green-800 font-semibold">Preparing your content</p>
          <p className="text-green-600 text-sm">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
