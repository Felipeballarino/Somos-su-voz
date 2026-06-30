'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminForm from '@/components/AdminForm'
import AdminAnimalList from '@/components/AdminAnimalList'
import AdminSettingsForm from '@/components/AdminSettingsForm'
import type { User } from '@supabase/supabase-js'

const TABS = [
  { id: 'create', label: 'Cargar animal' },
  { id: 'animals', label: 'Mis animales' },
  { id: 'settings', label: 'Configuración' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)
  const [tab, setTab] = useState<TabId>('create')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLogging(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email o contraseña incorrectos.')
    setLogging(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="card p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔒</div>
            <h1 className="text-2xl font-bold text-brand-dark">Acceso admin</h1>
            <p className="text-sm text-brand-dark/50 mt-1">Solo para rescatistas autorizados</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">Contraseña</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={logging}
              className="btn-primary w-full disabled:opacity-60"
            >
              {logging ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Panel de carga</h1>
          <p className="text-sm text-brand-dark/50 mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-brand-dark/50 hover:text-brand-dark transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="flex gap-2 mb-10 border-b border-cream-darker">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id
                ? 'border-orange text-orange'
                : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'create' && <AdminForm />}
      {tab === 'animals' && <AdminAnimalList />}
      {tab === 'settings' && <AdminSettingsForm />}
    </main>
  )
}
