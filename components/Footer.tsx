import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-green text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo + descripción */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/assets/logo.png"
                alt="Somos Su Voz"
                width={52}
                height={52}
                className="object-contain brightness-0 invert"
              />
              <div>
                <p className="font-bold text-lg leading-tight">Somos Su Voz</p>
                <p className="text-sm text-white/60">Pim Pum Pam</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Grupo de proteccionistas comprometidos con el bienestar animal.
              Rescatamos, cuidamos y buscamos hogar para quienes no tienen voz.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Navegación</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                ['/', 'Inicio'],
                ['/adopcion', 'Adopción'],
                ['/#donar', 'Donar'],
                ['/#contacto', 'Contacto'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div id="contacto">
            <h4 className="font-semibold mb-4 text-white/90">Contacto</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="https://www.instagram.com/somos.su.voz.vmvn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @somos.su.voz.vmvn
                </a>
              </li>
              <li className="text-white/50 text-xs pt-2">
                Villa María, Córdoba, Argentina
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Somos Su Voz — Pim Pum Pam. Todos los derechos reservados.</p>
          <Link href="/admin" className="hover:text-white/70 transition-colors">
            Acceso admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
