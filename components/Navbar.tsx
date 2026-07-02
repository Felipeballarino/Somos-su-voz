'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Inicio' },
  {
    href: '/adopcion',
    label: 'Adopción',
    children: [
      { href: '/adopcion', label: '🐾 Ver animales' },
      { href: '/adopcion/requisitos', label: '📋 Requisitos' },
    ],
  },
  { href: '/ayudar', label: 'Ayudar' },
  { href: '/#quienes-somos', label: 'Quiénes somos' },
  { href: '/#donar', label: 'Donar' },
  { href: '/#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isAdopcionActive = pathname.startsWith('/adopcion')

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-cream-dark shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/assets/logo.png"
            alt="Somos Su Voz"
            width={44}
            height={44}
            className="object-contain transition-transform duration-300 group-hover:animate-wiggle"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight" style={{ color: 'var(--green)' }}>
              Somos Su Voz
            </p>
            <p className="text-xs leading-tight text-brand-dark/50">Pim Pum Pam</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) =>
            link.children ? (
              // Dropdown
              <div key={link.href} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isAdopcionActive
                      ? 'text-orange font-semibold'
                      : 'text-brand-dark/70 hover:text-brand-dark hover:bg-cream'
                  }`}
                >
                  {link.label}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-cream-dark overflow-hidden">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-cream ${
                          pathname === child.href
                            ? 'text-orange font-semibold bg-orange/5'
                            : 'text-brand-dark/70'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Link simple
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-orange font-semibold'
                    : 'text-brand-dark/70 hover:text-brand-dark hover:bg-cream'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <Link href="/adopcion" className="hidden md:block btn-primary text-sm py-2 px-4">
            Adoptá ahora 🐾
          </Link>
          <button
            className="md:hidden p-2 rounded-lg text-brand-dark/70 hover:bg-cream"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-cream-dark px-4 py-3 space-y-1">
          {links.map((link) =>
            link.children ? (
              <div key={link.href}>
                <p className="px-4 py-2 text-xs font-semibold text-brand-dark/40 uppercase tracking-wider">
                  {link.label}
                </p>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-2.5 rounded-lg text-sm text-brand-dark/70 hover:bg-cream"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-brand-dark/70 hover:bg-cream"
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/adopcion"
            onClick={() => setMobileOpen(false)}
            className="block btn-primary text-sm text-center mt-2"
          >
            Adoptá ahora 🐾
          </Link>
        </div>
      )}
    </header>
  )
}
