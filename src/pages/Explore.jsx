import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COURSES, TUTORS, CATEGORIES } from '../data/mockData';

export default function Explore() {
  const { tokens, buyCourse, purchasedCourses } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [activeTab, setActiveTab] = useState('courses');
  const [buyingId, setBuyingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const filtered = useMemo(() => {
    let result = COURSES;
    if (activeCategory !== 'all') {
      const categoryMap = {
        math: 'Matemáticas',
        programming: 'Programación',
        physics: 'Física',
        chemistry: 'Química',
        accounting: 'Contabilidad',
        ai: 'IA/ML',
      };
      result = result.filter(c => c.subject === categoryMap[activeCategory]);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.tutor.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'popular') result = [...result].sort((a, b) => b.students - a.students);
    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, search, sortBy]);

  const handleBuy = async (course) => {
    if (buyingId) return;
    setBuyingId(course.id);
    await new Promise(r => setTimeout(r, 900));
    const ok = buyCourse(course);
    setBuyingId(null);
    if (ok) {
      setSuccessId(course.id);
      setTimeout(() => setSuccessId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="py-10">
          <div className="orb w-96 h-96 right-0 top-0 bg-cyan-500/10 -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Explorar <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-slate-400 text-lg">
            {COURSES.length} cursos · {TUTORS.length} tutores · Paga con <span className="text-yellow-400 font-semibold">EightTokens ⚡</span>
          </p>
        </div>

        {/* ── Tab Switch ────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          {['courses', 'tutors'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab === 'courses' ? '📚 Cursos' : '👨‍🏫 Tutores'}
            </button>
          ))}
        </div>

        {/* ── Courses Tab ───────────────────────────────────────── */}
        {activeTab === 'courses' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-60 flex-shrink-0">
              <div className="glass rounded-2xl p-4 border border-white/[0.06] sticky top-24">
                <h3 className="font-bold text-white text-sm mb-4">Categorías</h3>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex justify-between items-center ${
                        activeCategory === cat.id
                          ? 'bg-violet-500/20 text-violet-300'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-xs text-slate-600">{cat.count}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <h3 className="font-bold text-white text-sm mb-4">Tu balance</h3>
                  <div className="flex items-center gap-2 glass rounded-xl p-3 border border-yellow-500/20">
                    <span className="text-yellow-400 text-lg">⚡</span>
                    <div>
                      <div className="text-yellow-400 font-black token-number">{tokens.toLocaleString()}</div>
                      <div className="text-yellow-600 text-xs">EightTokens</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1">
              {/* Search + Sort */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar cursos, tutores, materias..."
                    className="w-full glass border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors bg-transparent"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="glass border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 bg-transparent cursor-pointer"
                >
                  <option value="popular" className="bg-dark-200">Más popular</option>
                  <option value="rating" className="bg-dark-200">Mejor valorado</option>
                  <option value="price-asc" className="bg-dark-200">Precio: menor a mayor</option>
                  <option value="price-desc" className="bg-dark-200">Precio: mayor a menor</option>
                </select>
              </div>

              {/* Results count */}
              <p className="text-slate-500 text-sm mb-4">
                Mostrando <span className="text-white font-medium">{filtered.length}</span> cursos
              </p>

              {/* Grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-white font-bold text-lg mb-2">Sin resultados</h3>
                  <p className="text-slate-400 text-sm">Prueba con otra búsqueda</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      tokens={tokens}
                      onBuy={handleBuy}
                      buying={buyingId === course.id}
                      success={successId === course.id}
                      purchased={!!purchasedCourses.find(c => c.id === course.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tutors Tab ────────────────────────────────────────── */}
        {activeTab === 'tutors' && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TUTORS.map(tutor => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>

            {/* Become tutor CTA */}
            <div className="mt-10 glass rounded-2xl p-8 border border-violet-500/20 text-center bg-gradient-to-br from-violet-600/10 to-indigo-600/5">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl font-black text-white mb-2">¿Quieres ser tutor?</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">
                Comparte tu conocimiento, gana EightTokens y obtén tu certificado de tutor verificado en blockchain.
              </p>
              <button className="btn-primary px-8 py-3">
                Aplicar como tutor →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CourseCard({ course, tokens, onBuy, buying, success, purchased }) {
  const subjectEmojis = { 'Matemáticas': '📐', 'Programación': '💻', 'Física': '⚛️', 'Contabilidad': '📊', 'IA/ML': '🤖', 'Química': '🧪' };
  const canAfford = tokens >= course.price;

  return (
    <div className={`glass glass-hover rounded-2xl overflow-hidden border transition-all duration-300 ${
      success ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/20' :
      purchased ? 'border-violet-500/30' :
      'border-white/[0.06]'
    }`}>
      {/* Thumbnail */}
      <div className="h-36 flex items-center justify-center text-5xl relative"
        style={{ background: `linear-gradient(135deg, ${course.subjectColor}25, ${course.subjectColor}08)` }}>
        {subjectEmojis[course.subject] || '📚'}

        <div className="absolute top-3 left-3 flex gap-2">
          {course.isNew && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/40 text-violet-200 font-medium border border-violet-500/30">
              NUEVO
            </span>
          )}
          {course.isFeatured && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/30 text-yellow-300 font-medium border border-yellow-500/30">
              ⭐ DEST.
            </span>
          )}
        </div>

        {purchased && (
          <div className="absolute top-3 right-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-300 font-medium border border-emerald-500/30">
              ✓ Comprado
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Subject */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: course.subjectColor + '20', color: course.subjectColor }}>
            {course.subject}
          </span>
          <span className="text-xs text-slate-500 ml-auto">{course.level}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-base mb-2 line-clamp-2 min-h-[2.5rem]">{course.title}</h3>
        <p className="text-slate-500 text-xs mb-3 line-clamp-2">{course.description}</p>

        {/* Tutor */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            {course.tutorAvatar}
          </div>
          <span className="text-xs text-slate-400">{course.tutor}</span>
          <span className="ml-auto flex items-center gap-1 text-xs">
            <span className="text-yellow-400">★</span>
            <span className="text-white font-medium">{course.rating}</span>
            <span className="text-slate-600">({course.reviews})</span>
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/[0.06]">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 font-black text-xl">{course.price}</span>
              <span className="text-yellow-600 font-bold">8T</span>
            </div>
            <div className="text-slate-600 text-xs">👥 {course.students}</div>
          </div>

          {purchased ? (
            <button className="px-4 py-2 rounded-xl text-sm font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors">
              Abrir →
            </button>
          ) : (
            <button
              onClick={() => onBuy(course)}
              disabled={buying || !canAfford}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${
                success ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/30' :
                buying ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30 animate-pulse' :
                canAfford ? 'btn-primary py-2 px-4' :
                'bg-slate-800/50 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              }`}
            >
              {success ? '✓ ¡Comprado!' : buying ? 'Procesando...' : canAfford ? 'Comprar' : 'Sin 8T'}
            </button>
          )}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
          <span>⏱ {course.duration}</span>
          <span>·</span>
          <span>🎓 {course.tutorUniversity}</span>
        </div>
      </div>
    </div>
  );
}

function TutorCard({ tutor }) {
  const [requested, setRequested] = useState(false);

  return (
    <div className="glass glass-hover rounded-2xl p-6 border border-white/[0.06]">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
            {tutor.avatar}
          </div>
          {tutor.isOnline && (
            <div className="absolute -bottom-1 -right-1">
              <div className="live-dot w-3.5 h-3.5"></div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white">{tutor.name}</h3>
            {tutor.isVerified && (
              <span className="verified-badge">✓ Blockchain</span>
            )}
          </div>
          <div className="text-slate-400 text-xs mt-0.5">{tutor.university}</div>
          <div className="hash-text mt-1">{tutor.txHash}</div>
        </div>
      </div>

      <p className="text-slate-400 text-xs mb-4 line-clamp-2">{tutor.bio}</p>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tutor.specialties.map(s => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {s}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="glass rounded-lg p-2 border border-white/[0.04]">
          <div className="text-yellow-400 font-bold">{tutor.rating}</div>
          <div className="text-slate-500 text-xs">Rating</div>
        </div>
        <div className="glass rounded-lg p-2 border border-white/[0.04]">
          <div className="text-cyan-400 font-bold">{tutor.sessions}</div>
          <div className="text-slate-500 text-xs">Sesiones</div>
        </div>
        <div className="glass rounded-lg p-2 border border-white/[0.04]">
          <div className="text-emerald-400 font-bold text-xs">{tutor.responseTime}</div>
          <div className="text-slate-500 text-xs">Respuesta</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <div>
          <span className="text-yellow-400 font-black">{tutor.hourlyRate} 8T</span>
          <span className="text-slate-500 text-xs">/hora</span>
        </div>
        <button
          onClick={() => setRequested(true)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            requested
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'btn-primary py-2 px-4'
          }`}
        >
          {requested ? '✓ Enviado' : 'Agendar'}
        </button>
      </div>
    </div>
  );
}
