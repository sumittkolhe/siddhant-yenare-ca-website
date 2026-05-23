import { motion } from 'framer-motion';

const SectionHeader = ({ tag, tagIcon: TagIcon, title, goldText, subtitle }) => {
  // Build the title with gold text highlighted
  const renderTitle = () => {
    if (!goldText || !title.includes(goldText)) {
      return title;
    }

    const parts = title.split(goldText);
    return (
      <>
        {parts[0]}
        <span className="text-gold-500">{goldText}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      {tag && (
        <span className="inline-flex items-center gap-2 bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          {TagIcon && <TagIcon className="w-4 h-4" />}
          {tag}
        </span>
      )}

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-navy-900 dark:text-white leading-tight">
        {renderTitle()}
      </h2>

      {subtitle && (
        <p className="text-gray-600 dark:text-navy-200 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
