'use client'

import { Animal, buildWhatsAppMessage } from '@/lib/types'

interface WhatsAppButtonProps {
  animal: Animal
  className?: string
}

export default function WhatsAppButton({ animal, className }: WhatsAppButtonProps) {
  const handleClick = () => {
    const message = encodeURIComponent(buildWhatsAppMessage(animal))
    window.open(`https://wa.me/${animal.rescuer_phone}?text=${message}`, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${className ?? ''}`}
      style={{
        background: 'linear-gradient(135deg, #25D366, #128C7E)',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
      }}
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.559 4.118 1.532 5.845L.057 23.986l6.304-1.654A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.98 0-3.824-.58-5.37-1.576l-.385-.228-3.99 1.046 1.065-3.887-.249-.4A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
      </svg>
      Contactar por WhatsApp
    </button>
  )
}
