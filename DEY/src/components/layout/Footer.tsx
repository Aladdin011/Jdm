import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-300 dark:bg-sky-600 text-slate-800 dark:text-white pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <div className="flex items-center mr-2">
                <div className="text-2xl font-bold mr-1 text-[#4A90E2]">JD</div>
                <div className="text-xl font-bold text-white">MARC</div>
              </div>
              <p>
                <br />
              </p>
            </Link>
            <p className="text-slate-600 dark:text-slate-200">
              Building Africa's future cities with innovative construction and
              infrastructure solutions since 2007.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-slate-500 dark:border-slate-400 pb-2 text-slate-800 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-slate-500 dark:border-slate-400 pb-2 text-slate-800 dark:text-white">
              Our Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Total Construction
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Urban Planning & Smart Cities
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Global Procurement
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Infrastructure Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Nigeria HQ */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-slate-500 dark:border-slate-400 pb-2 text-slate-800 dark:text-white">
              Nigeria (HQ)
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin
                  className="text-orange-500 dark:text-orange-400 mt-1 flex-shrink-0"
                  size={18}
                />
                <span className="text-slate-600 dark:text-slate-200">
                  Plot 107, Ahmadu Bello Way
                  <br />
                  Abuja, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="text-orange-500 dark:text-orange-400 flex-shrink-0"
                  size={18}
                />
                <a
                  href="tel:+2348037065497"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  +234 (0)8037 065497
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="text-orange-500 dark:text-orange-400 flex-shrink-0"
                  size={18}
                />
                <a
                  href="mailto:info@jdmarcng.com"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  info@jdmarcng.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe
                  className="text-orange-500 dark:text-orange-400 flex-shrink-0"
                  size={18}
                />
                <a
                  href="https://www.jdmarcng.com"
                  className="text-slate-600 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  www.jdmarcng.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* International Offices */}
        <div className="border-t border-slate-500 dark:border-slate-400 pt-8 pb-6">
          <h3 className="text-lg font-bold text-center mb-6 text-slate-800 dark:text-white">
            International Offices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* UK Office */}
            <div className="text-center">
              <h4 className="font-bold mb-3 text-orange-500 dark:text-orange-400">
                United Kingdom
              </h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={16} />
                  <span>71-75 Shelton Street, London WC2H 9RQ</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} />
                  <a
                    href="tel:+447760954844"
                    className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    +44 (0)7760954844
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <a
                    href="mailto:info@jdmarc.co.uk"
                    className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    info@jdmarc.co.uk
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Globe size={16} />
                  <a
                    href="https://www.jdmarc.co.uk"
                    className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    www.jdmarc.co.uk
                  </a>
                </div>
              </div>
            </div>

            {/* USA Office */}
            <div className="text-center">
              <h4 className="font-bold mb-3 text-orange-500 dark:text-orange-400">
                United States
              </h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={16} />
                  <span>125 Park Avenue, New York, NY 10017</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} />
                  <a
                    href="tel:+12124567890"
                    className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    +1 (212) 456-7890
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <a
                    href="mailto:usa@jdmarc.com"
                    className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    usa@jdmarc.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-slate-500 dark:border-slate-400 pt-8 pb-6">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-center mb-4 text-slate-800 dark:text-white">
              Stay Updated with JD Marc
            </h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-500 dark:border-slate-400 pt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>
            &copy; {currentYear} JD Marc. All rights reserved. Building Africa's
            Future Cities.
          </p>
        </div>
      </div>
    </footer>
  );
}
