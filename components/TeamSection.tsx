import Image from 'next/image'

export default function TeamSection() {
  return (
    <section id="quienes-somos" className="py-16" style={{ background: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">
            Las personas detrás
          </p>
          <h2 className="section-title">Quiénes somos</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full max-w-xl rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
            <Image
              src="/assets/nosotros.jpeg"
              alt="Equipo de Somos su Voz y Pim Pum Pam"
              width={5230}
              height={3487}
              className="w-full h-auto"
              sizes="(min-width: 768px) 576px, 100vw"
            />
          </div>

          <div className="flex-1 space-y-5 text-center md:text-left">
            <p className="text-brand-dark/70 leading-relaxed">
              Somos Somos su Voz y Pim Pum Pam, un grupo de mujeres y hombres unidos por la misma
              misión: rescatar, proteger y dar segundas oportunidades a los animales en riesgo.
            </p>
            <p className="text-brand-dark/70 leading-relaxed">
              Nuestro nombre refleja nuestra forma de actuar: rápida, decidida y con mucho corazón.
              Creemos que cada vida merece respeto, cuidados y amor, por eso trabajamos en rescates,
              atención veterinaria y adopciones responsables.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
