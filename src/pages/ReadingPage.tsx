import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { ReadingContent } from '../components/ReadingContent';
import { ReadingNavbar } from '../components/ReadingNavbar';
import { useReadingStore } from '../store/useReadingStore';
import {  Mail, Phone, MapPin} from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import logo from '../img/logo.png';
//import { Category } from '../types';
import { FaLinkedin, FaInstagram, FaTiktok} from 'react-icons/fa'; // Importar íconos de react-icons
const currentYear = new Date().getFullYear();


export const ReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { readings, selectedReading, setSelectedReading } = useReadingStore();

  useEffect(() => {
    if (id && (!selectedReading || selectedReading._id !== id)) {
      const reading = readings.find((r) => r._id === id);
      if (reading) {
        setSelectedReading(reading);
      } else {
        navigate('/');
      }
    }
  }, [id, readings, selectedReading, setSelectedReading, navigate]);

  if (!selectedReading) {
    return null;
  }

  return (
    <>
      <ReadingNavbar />
       
      <div className="pt-20 pb-12">
       
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 
                     hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Readings</span>
          </button>

          <ReadingContent reading={selectedReading} />
        </div>
      </div>
      <footer className={`w-full text-gray-300 mt-8 bg-gray-900`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <img src={logo} alt="Logo" className="w-24 h-24"/>
              <p className="text-sm">
                Transformando el aprendizaje de idiomas a través de la tecnología y la innovación.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-white transition-colors">Inicio</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors">Sobre Nosotros</a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition-colors">Planes</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contact@example.com" className="hover:text-white transition-colors">
                    Info@fluentphrases.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +54-1162908729
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>CIUDAD DE BUENOS AIRES, ARGENTINA</span>
                </li>
              </ul>
            </div>

            {/* Social Media & Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Síguenos</h3>
              <div className="flex space-x-4 mb-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
              <a
                href="/contact"
                className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Contactar
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm">
                © {currentYear} Fluent Phrases. Todos los derechos reservados.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="hover:text-white transition-colors">
                  Política de Privacidad
                </a>
                <a href="/terms" className="hover:text-white transition-colors">
                  Términos de Uso
                </a>
                <a href="/cookies" className="hover:text-white transition-colors">
                  Política de Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};