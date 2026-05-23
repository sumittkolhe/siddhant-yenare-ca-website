import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const whatsappUrl =
    'https://wa.me/918262883408?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20CA%20services.';

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse Ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

      {/* WhatsApp SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-white relative z-10"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.39l6.218-1.962a15.907 15.907 0 0 0 8.732 2.576C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.338 22.616c-.394 1.108-1.948 2.028-3.192 2.296-.852.182-1.964.326-5.71-1.228-4.8-1.988-7.886-6.862-8.124-7.18-.228-.318-1.912-2.546-1.912-4.856s1.21-3.446 1.64-3.918c.43-.472.94-.59 1.254-.59.312 0 .626.004.898.016.288.014.676-.11 1.058.806.394.95 1.338 3.26 1.456 3.498.118.238.198.516.04.834-.158.318-.238.516-.476.794-.238.278-.5.62-.714.832-.238.238-.486.496-.208.97.278.472 1.234 2.034 2.65 3.296 1.82 1.622 3.354 2.126 3.828 2.364.472.238.748.198 1.026-.118.278-.318 1.194-1.39 1.512-1.868.318-.476.636-.396 1.072-.238.436.158 2.75 1.296 3.222 1.532.472.238.788.356.906.55.118.198.118 1.128-.276 2.236z" />
      </svg>
    </motion.a>
  );
};

export default WhatsAppButton;
