const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-navy-700 border-t-gold-500 rounded-full animate-spin" />
      <p className="text-navy-200 mt-4 text-sm animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-navy-950 flex items-center justify-center z-[100]">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
