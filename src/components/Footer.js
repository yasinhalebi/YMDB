import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020c1b] text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 justify-items-center sm:justify-items-start">
          <div className="flex flex-col items-center sm:items-start max-w-sm">
            <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-400">
              YMDB
            </Link>
            <p className="text-sm text-gray-400 mt-2 text-center sm:text-left">
              Your ultimate destination for movies and TV shows
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold mb-2 text-lg">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/moviespage" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">Movies</Link>
              <Link to="/tvshowspage" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">TV Shows</Link>
              <Link to="/searchpage" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">Search</Link>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold mb-2 text-lg">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/yasinhalebi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/yasinhalebi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            © {currentYear} YMDB. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}