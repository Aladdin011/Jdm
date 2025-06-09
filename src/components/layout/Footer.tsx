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
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <div className="flex items-center mr-2">
                <div className="text-2xl font-bold mr-1 text-[#4A90E2]">JD</div>
                <div className="text-xl font-bold text-white">MARC</div>
              </div>
              <span className="text-lg">CONSTRUCTION</span>
            </Link>
            <p className="text-gray-300">
              Building Africa's future cities with innovative construction and
              infrastructure solutions since 2007.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">
              Our Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Total Construction
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Urban Planning & Smart Cities
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Global Procurement
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  Infrastructure Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Nigeria HQ */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">
              Nigeria (HQ)
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="text-accent mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-300">
                  Plot 107, Ahmadu Bello Way
                  <br />
                  Abuja, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-accent flex-shrink-0" size={18} />
                <a
                  href="tel:+2348037065497"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  +234 (0)8037 065497
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-accent flex-shrink-0" size={18} />
                <a
                  href="mailto:info@jdmarcng.com"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  info@jdmarcng.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="text-accent flex-shrink-0" size={18} />
                <a
                  href="https://www.jdmarcng.com"
                  className="text-gray-300 hover:text-accent transition-colors"
                >
                  www.jdmarcng.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* International Offices */}
        <div className="border-t border-gray-700 pt-8 pb-6">
          <h3 className="text-lg font-bold text-center mb-6">
            International Offices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* UK Office */}
            <div className="text-center">
              <h4 className="font-bold mb-3 text-accent">United Kingdom</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={16} />
                  <span>71-75 Shelton Street, London WC2H 9RQ</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} />
                  <a
                    href="tel:+447760954844"
                    className="hover:text-accent transition-colors"
                  >
                    +44 (0)7760954844
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <a
                    href="mailto:info@jdmarc.co.uk"
                    className="hover:text-accent transition-colors"
                  >
                    info@jdmarc.co.uk
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Globe size={16} />
                  <a
                    href="https://www.jdmarc.co.uk"
                    className="hover:text-accent transition-colors"
                  >
                    www.jdmarc.co.uk
                  </a>
                </div>
              </div>
            </div>

            {/* USA Office */}
            <div className="text-center">
              <h4 className="font-bold mb-3 text-accent">United States</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={16} />
                  <span>125 Park Avenue, New York, NY 10017</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} />
                  <a
                    href="tel:+12124567890"
                    className="hover:text-accent transition-colors"
                  >
                    +1 (212) 456-7890
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <a
                    href="mailto:usa@jdmarc.com"
                    className="hover:text-accent transition-colors"
                  >
                    usa@jdmarc.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 pt-8 pb-6">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-center mb-4">
              Stay Updated with JD Marc
            </h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-accent hover:bg-accent/90 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {currentYear} JD Marc. All rights reserved. Building Africa's
            Future Cities.
          </p>
        </div>
      </div>
    </footer>
  );
}
