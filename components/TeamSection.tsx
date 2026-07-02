const team = [
  {
    initials: 'MG',
    color: '#E8891A',
    name: 'Maca Gonzalez',
    role: 'Info Personal',
    bio: 'Llevo más de 8 años rescatando animales en Villa María. Mi casa siempre tiene lugar para uno más — y mi corazón, para todos.',
  },
  {
    initials: 'MG',
    color: '#5C6B2E',
    name: 'Maca Gonzalez',
    role: 'Info Personal',
    bio: 'Me encargo de que cada animal encuentre la familia perfecta. Cada historia de adopción exitosa me recuerda por qué hacemos esto.',
  },
  {
    initials: 'MG',
    color: '#C4720F',
    name: 'Maca Gonzalez',
    role: 'Info personal',
    bio: 'Cuento las historias de nuestros rescatados para que lleguen a las personas que los están esperando sin saberlo.',
  },
]

export default function TeamSection() {
  return (
    <section id="quienes-somos" className="py-16" style={{ background: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">
            Las personas detrás
          </p>
          <h2 className="section-title">Quiénes somos</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Somos un grupo de proteccionistas voluntarias de Villa María, Córdoba.
            Sin fines de lucro, solo con amor y mucha dedicación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="card-tilt p-8 flex flex-col items-center text-center gap-5 group">
              {/* Avatar con iniciales */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md transition-transform duration-300 group-hover:animate-wiggle"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>

              <div>
                <h3 className="text-xl font-bold text-brand-dark">{member.name}</h3>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--orange)' }}>
                  {member.role}
                </p>
              </div>

              <p className="text-brand-dark/60 leading-relaxed text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
