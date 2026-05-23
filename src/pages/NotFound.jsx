import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="text-[150px] font-display font-bold text-navy-800/50 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-gold">
              <Home className="w-10 h-10 text-navy-950" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-display font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-navy-300 mb-8 text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold px-6 py-3 rounded-xl hover:shadow-gold transition-all"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-navy-700 text-navy-200 hover:bg-navy-800 px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
