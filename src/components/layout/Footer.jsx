import { Landmark, Mail, MapPin, Clock } from 'lucide-react';
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Why Choose Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
];

const serviceLinks = [
  { label: 'Income Tax', href: '#services' },
  { label: 'GST Services', href: '#services' },
  { label: 'Audit & Assurance', href: '#services' },
  { label: 'Company Registration', href: '#services' },
  { label: 'Business Advisory', href: '#services' },
];


const handleSmoothScroll = (e, href) => {
  if (href.startsWith('#')) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const Footer = () => {
  return (
    <footer className="bg-navy-950 text-navy-200 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <Landmark className="w-5 h-5 text-navy-950" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm leading-tight">
                  Siddhant Yenare & Co.
                </div>
                <div className="text-xs text-gold-500 leading-tight">
                  Chartered Accountants
                </div>
              </div>
            </a>
            <p className="text-sm text-navy-400 leading-relaxed mb-6">
              Your trusted partner for comprehensive financial and advisory
              services. Registered with ICAI (FRN: 158865W).
            </p>
            <div className="flex items-center gap-2">
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-gold-500 flex items-center justify-center transition-all text-navy-200 hover:text-navy-950"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-gold-500 flex items-center justify-center transition-all text-navy-200 hover:text-navy-950"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-gold-500 flex items-center justify-center transition-all text-navy-200 hover:text-navy-950"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className="text-sm text-navy-400 hover:text-gold-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-navy-600 group-hover:bg-gold-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className="text-sm text-navy-400 hover:text-gold-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-navy-600 group-hover:bg-gold-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-navy-400 leading-relaxed">
                  Pune, Maharashtra, India
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <a
                  href="mailto:info@siddhantca.com"
                  className="text-sm text-navy-400 hover:text-gold-400 transition-colors duration-300"
                >
                  info@siddhantca.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-navy-400 leading-relaxed">
                  Mon – Sat: 10:00 AM – 7:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-navy-800 mt-12 pt-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <p className="text-sm text-navy-500">
              © {new Date().getFullYear()} Siddhant Yenare & Co. All rights
              reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-navy-500">
              <a
                href="#"
                className="hover:text-gold-400 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <span className="mx-2">·</span>
              <a
                href="#"
                className="hover:text-gold-400 transition-colors duration-300"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
