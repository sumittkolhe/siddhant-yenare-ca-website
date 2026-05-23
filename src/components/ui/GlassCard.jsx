const GlassCard = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white dark:bg-navy-800/50 backdrop-blur-sm border border-gray-100 dark:border-navy-700/50 rounded-2xl shadow-glass ${
        hover
          ? 'hover:shadow-glass-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
