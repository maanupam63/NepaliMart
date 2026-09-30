import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
       
          <div>
            <h2 className="text-2xl font-extrabold mb-4">
              Nepali<span className="text-orange-500">Mart</span>
            </h2>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Nepal's Largest Online Grocery Store. Connecting local vendors,
              big marts, and mini marts directly with customers across Nepal.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

  
          <div>
            <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/salesman/register"
                  className="hover:text-white transition"
                >
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

        
          <div>
            <h3 className="font-bold mb-4 text-lg">Categories</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link
                  to="/category/fruits-vegetables"
                  className="hover:text-white transition"
                >
                  Fruits & Vegetables
                </Link>
              </li>
              <li>
                <Link
                  to="/category/dairy-breakfast"
                  className="hover:text-white transition"
                >
                  Dairy & Breakfast
                </Link>
              </li>
              <li>
                <Link
                  to="/category/snacks-beverages"
                  className="hover:text-white transition"
                >
                  Snacks & Beverages
                </Link>
              </li>
              <li>
                <Link
                  to="/category/rice-grains"
                  className="hover:text-white transition"
                >
                  Rice & Grains
                </Link>
              </li>
              <li>
                <Link
                  to="/category/oil-masala"
                  className="hover:text-white transition"
                >
                  Oil & Masala
                </Link>
              </li>
            </ul>
          </div>

      
          <div>
            <h3 className="font-bold mb-4 text-lg">Contact Us</h3>
            <ul className="text-gray-400 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0" />
                <span>Kathmandu, Nepal<br />sanothimi-2</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-green-500 flex-shrink-0" />
                <a href="tel:+9779800000000" className="hover:text-white">
                  +977 9716226395
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-green-500 flex-shrink-0" />
                <a
                  href="mailto:info@nepalimart.com"
                  className="hover:text-white"
                >
                  info@nepalimart.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="border-t border-gray-800 pt-6 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              <span className="font-semibold text-white">Payment Methods:</span>{' '}
              Cash on Delivery • eSewa • Khalti 
            </div>
            <div className="text-gray-400 text-sm">
              <span className="font-semibold text-white">Delivery:</span> All
              over Nepal
            </div>
          </div>
        </div>

  
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 Nepali Mart. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;