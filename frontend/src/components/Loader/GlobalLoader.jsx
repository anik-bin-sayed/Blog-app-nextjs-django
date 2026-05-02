const GlobalLoader = () => {
  return (
    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm ">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-yellow-600 "></div>
        <p className="text-lg font-medium text-gray-700 ">Loading...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
