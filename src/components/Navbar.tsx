"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Kids", href: "/kids" },
    { name: "Collections", href: "/collections" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/nike-swoosh.svg"
                alt="Nike"
                width={60}
                height={22}
                className="text-black"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-900 hover:text-gray-600 px-3 py-2 text-base font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/search"
              className="text-gray-900 hover:text-gray-600 text-base font-medium transition-colors"
            >
              Search
            </Link>
            <Link
              href="/cart"
              className="text-gray-900 hover:text-gray-600 text-base font-medium transition-colors"
            >
              My Cart (2)
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/search"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Search
            </Link>
            <Link
              href="/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              My Cart (2)
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
