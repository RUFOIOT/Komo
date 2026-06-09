import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STATS, COURSES } from '../data/mockData';

// Animated counter hook
function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

export default function Landing() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const studentsCount = useCountUp(STATS.totalStudents, 2000, statsVisible);
  const tutorsCount = useCountUp(STATS.activeTutors, 1800, statsVisible);
  const coursesCount = useCountUp(STATS.coursesAvailable, 2200, statsVisible);
  const tokensCount = useCountUp(STATS.tokensCirculating, 2500, statsVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleEnter = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-100 overflow-hidden">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] top-[-200px] left-[-200px] bg-violet-600/20"></div>
        <div className="orb w-[400px] h-[400px] top-[20%] right-[-100px] bg-cyan-500/15"></div>
        <div className="orb w-[300px] h-[300px] bottom-[10%] left-[30%] bg-yellow-500/10"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Floating tokens */}
        <div className="absolute animate-float" style={{ top: '20%', left: '8%' }}>
          <TokenFloating value="8T" color="#7c3aed" />
        </div>
        <div className="absolute animate-float-delay" style={{ top: '35%', right: '10%' }}>
          <TokenFloating value="⚡" color="#06b6d4" />
        </div>
        <div className="absolute animate-float-delay2" style={{ bottom: '25%', left: '15%' }}>
          <TokenFloating value="📚" color="#f59e0b" />
        </div>
        <div className="absolute animate-float" style={{ bottom: '30%', right: '18%', animationDelay: '3s' }}>
          <TokenFloating value="🎓" color="#10b981" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-violet-500/30 mb-8 animate-fade-in">
            <div className="live-dot"></div>
            <span className="text-sm text-violet-300 font-medium">Plataforma Web3 Educativa · Ecuador 🇪🇨</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-6 animate-slide-up">
            Aprende.{' '}
            <span className="gradient-text">Enseña.</span>
            <br />
            Gana{' '}
            <span className="gradient-text-gold">EightTokens.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            La primera biblioteca educativa Web3 del Ecuador.
            Accede a tutorías, cursos y apuntes. Cada logro queda registrado
            en blockchain para siempre. 🔗
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={handleEnter} className="btn-primary text-lg px-8 py-4 animate-pulse-glow">
              🚀 Entrar al Demo
            </button>
            <a href="#features" className="btn-ghost text-base px-8 py-4">
              Ver características ↓
            </a>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Sin costo para empezar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-violet-400">✓</span>
              <span>Tokens reales en blockchain</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">✓</span>
              <span>Certificados verificables</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-slate-600 text-xs">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-600"></div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-16 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={studentsCount.toLocaleString()} label="Estudiantes" emoji="👩‍🎓" color="violet" />
            <StatCard value={tutorsCount.toLocaleString()} label="Tutores verificados" emoji="⭐" color="yellow" />
            <StatCard value={coursesCount.toLocaleString()} label="Cursos disponibles" emoji="📚" color="cyan" />
            <StatCard value={(tokensCount / 1000000).toFixed(1) + 'M'} label="8T en circulación" emoji="⚡" color="green" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 relative">
        <div className="orb w-[400px] h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-violet-400 font-semibold text-sm uppercase tracking-wider">¿Qué es Komo?</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
              Educación con <span className="gradient-text">propósito</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Una economía digital donde el conocimiento tiene valor real y cada logro queda grabado para siempre.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="📚"
              title="Biblioteca Virtual"
              desc="Miles de apuntes, guías y materiales subidos por estudiantes. Descarga lo que necesitas, sube lo que sabes."
              gradient="from-violet-600/20 to-indigo-600/10"
              border="border-violet-500/20"
              badge="1,847 recursos"
            />
            <FeatureCard
              icon="🎓"
              title="Tutorías Personalizadas"
              desc="Conecta con tutores verificados en blockchain. Agenda sesiones 1:1 o en grupo pagando con EightTokens."
              gradient="from-cyan-600/20 to-blue-600/10"
              border="border-cyan-500/20"
              badge="312 tutores"
            />
            <FeatureCard
              icon="⚡"
              title="EightTokens"
              desc="La moneda del conocimiento. Gana tokens subiendo apuntes, dando tutorías y completando cursos. Úsalos para aprender más."
              gradient="from-yellow-600/20 to-orange-600/10"
              border="border-yellow-500/20"
              badge="Web3 nativo"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <FeatureCard
              icon="🔗"
              title="Blockchain Certificates"
              desc="Tus logros, certificados y reputación se registran en la blockchain. Inmutables, verificables por cualquier empleador."
              gradient="from-emerald-600/20 to-teal-600/10"
              border="border-emerald-500/20"
              badge="NFT Certificates"
            />
            <FeatureCard
              icon="🏆"
              title="Sistema de Logros"
              desc="Desbloquea badges NFT por cada hito. Construye tu portafolio académico verificable y único."
              gradient="from-pink-600/20 to-rose-600/10"
              border="border-pink-500/20"
              badge="Achievement NFTs"
            />
            <FeatureCard
              icon="🤝"
              title="Comunidad Estudiantil"
              desc="Encuentra compañeros en tu misma materia, forma grupos de estudio y colabora en proyectos académicos."
              gradient="from-orange-600/20 to-red-600/10"
              border="border-orange-500/20"
              badge="8,432 activos"
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 bg-dark-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Cómo funciona</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">
              3 pasos para <span className="gradient-text">empezar</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-violet-500 via-cyan-500 to-yellow-500 opacity-30 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <StepCard
                step="01"
                icon="🔐"
                title="Crea tu cuenta"
                desc="Regístrate con tu email universitario. Conecta tu wallet para recibir tu primer regalo: 100 EightTokens de bienvenida."
                color="violet"
              />
              <StepCard
                step="02"
                icon="📖"
                title="Aprende o enseña"
                desc="Compra cursos con tokens, agenda tutorías o sube tus propios apuntes para ganar tokens mientras ayudas a otros."
                color="cyan"
              />
              <StepCard
                step="03"
                icon="🏆"
                title="Acumula logros"
                desc="Cada acción se registra en blockchain. Tu reputación crece, desbloqueas badges NFT y accedes a tutores premium."
                color="yellow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TOKENS SECTION ────────────────────────────────────────── */}
      <section id="tokens" className="py-24 px-4 relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] right-[-200px] top-1/2 -translate-y-1/2 bg-yellow-500/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">EightTokens Economy</span>
              <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6">
                El conocimiento tiene{' '}
                <span className="gradient-text-gold">valor real</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                EightTokens (8T) es la moneda nativa de Komo. Diseñada para incentivar el aprendizaje colaborativo y recompensar a quienes contribuyen a la comunidad.
              </p>

              <div className="space-y-4">
                <TokenEarnWay icon="📤" title="Sube apuntes" earn="+10 a +50 8T" desc="según calidad y votos" />
                <TokenEarnWay icon="👨‍🏫" title="Da tutorías" earn="+15 8T/hora" desc="más tips de estudiantes" />
                <TokenEarnWay icon="🎯" title="Completa cursos" earn="+25 8T" desc="por cada curso finalizado" />
                <TokenEarnWay icon="🔥" title="Racha diaria" earn="+5 8T/día" desc="por constancia en el aprendizaje" />
              </div>
            </div>

            <div className="relative">
              {/* Token visual */}
              <div className="relative w-full aspect-square max-w-sm mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/10 animate-pulse-glow"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/20 animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center glass rounded-3xl p-8 border border-yellow-500/20">
                    <div className="text-8xl mb-4">⚡</div>
                    <div className="text-5xl font-black gradient-text-gold">8T</div>
                    <div className="text-slate-400 text-sm mt-2">EightTokens</div>
                    <div className="mt-4 flex justify-center gap-3 text-xs">
                      <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">ERC-20</span>
                      <span className="px-2 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">Web3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ──────────────────────────────────────── */}
      <section className="py-24 px-4 bg-dark-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-violet-400 font-semibold text-sm uppercase tracking-wider">Cursos destacados</span>
              <h2 className="text-4xl font-black mt-2">Lo más popular esta semana</h2>
            </div>
            <button onClick={handleEnter} className="btn-ghost text-sm hidden md:block">
              Ver todos →
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.filter(c => c.isFeatured).map(course => (
              <CourseMiniCard key={course.id} course={course} onEnter={handleEnter} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="orb w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600/20"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="glass rounded-3xl p-12 border border-violet-500/20 gradient-border">
            <div className="text-6xl mb-6">🎓</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Únete a la revolución<br />
              <span className="gradient-text">educativa Web3</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              8,432 estudiantes ya están aprendiendo y ganando tokens. Tú también puedes.
            </p>
            <button onClick={handleEnter} className="btn-primary text-xl px-10 py-5 animate-pulse-glow">
              🚀 Comenzar Ahora — Es Gratis
            </button>
            <p className="text-slate-600 text-sm mt-4">
              100 EightTokens de bienvenida al registrarte · Sin tarjeta de crédito
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm">K</div>
              <span className="font-bold text-white">Komo</span>
              <span className="text-slate-500 text-sm">— Educación Web3</span>
            </div>
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <span>ODS 4 · Educación de Calidad</span>
              <span>ODS 9 · Innovación</span>
              <span>ODS 10 · Reducción de Desigualdades</span>
            </div>
            <div className="text-slate-600 text-sm">
              🇪🇨 Made in Ecuador — Hackatón 2026
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/[0.03] flex flex-wrap justify-center gap-4 text-xs text-slate-700">
            <span>Alejandro Escobar</span>
            <span>•</span>
            <span>Emiliano Viteri</span>
            <span>•</span>
            <span>Elías Muñoz</span>
            <span>•</span>
            <span>Jhonatan Sarango</span>
            <span>•</span>
            <span>Matías Ojeda</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function TokenFloating({ value, color }) {
  return (
    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-2xl shadow-xl"
      style={{ borderColor: color + '40', background: color + '15' }}>
      {value}
    </div>
  );
}

function StatCard({ value, label, emoji, color }) {
  const colors = {
    violet: 'border-violet-500/20 bg-violet-500/5',
    yellow: 'border-yellow-500/20 bg-yellow-500/5',
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
    green: 'border-emerald-500/20 bg-emerald-500/5',
  };
  const text = {
    violet: 'text-violet-400',
    yellow: 'text-yellow-400',
    cyan: 'text-cyan-400',
    green: 'text-emerald-400',
  };

  return (
    <div className={`glass rounded-2xl p-6 border ${colors[color]} text-center`}>
      <div className="text-3xl mb-2">{emoji}</div>
      <div className={`text-3xl font-black ${text[color]} token-number`}>{value}</div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, gradient, border, badge }) {
  return (
    <div className={`glass glass-hover rounded-2xl p-6 border ${border} bg-gradient-to-br ${gradient}`}>
      <div className="text-3xl mb-4">{icon}</div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold text-white text-lg">{title}</h3>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
      <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/[0.08]">{badge}</span>
    </div>
  );
}

function StepCard({ step, icon, title, desc, color }) {
  const colors = {
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    yellow: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  };

  return (
    <div className="text-center">
      <div className={`w-20 h-20 rounded-2xl glass border ${colors[color]} flex flex-col items-center justify-center mx-auto mb-6`}>
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold ${colors[color].split(' ')[0]} mt-1`}>{step}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TokenEarnWay({ icon, title, earn, desc }) {
  return (
    <div className="flex items-center gap-4 glass rounded-xl p-4 border border-white/[0.06] hover:border-yellow-500/20 transition-colors">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="font-semibold text-white text-sm">{title}</div>
        <div className="text-slate-500 text-xs">{desc}</div>
      </div>
      <div className="text-yellow-400 font-bold text-sm">{earn}</div>
    </div>
  );
}

function CourseMiniCard({ course, onEnter }) {
  const subjectEmojis = {
    'Matemáticas': '📐',
    'Programación': '💻',
    'Física': '⚛️',
    'Contabilidad': '📊',
    'IA/ML': '🤖',
    'Química': '🧪',
  };

  return (
    <div
      onClick={onEnter}
      className="glass glass-hover rounded-2xl overflow-hidden border border-white/[0.06] cursor-pointer"
    >
      {/* Header */}
      <div className="h-32 flex items-center justify-center text-6xl relative"
        style={{ background: `linear-gradient(135deg, ${course.subjectColor}20, ${course.subjectColor}08)` }}>
        {subjectEmojis[course.subject] || '📚'}
        {course.isNew && (
          <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-300 border border-violet-500/30 font-medium">
            NUEVO
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: course.subjectColor + '20', color: course.subjectColor }}>
            {course.subject}
          </span>
          <span className="text-xs text-slate-500">{course.level}</span>
        </div>

        <h3 className="font-bold text-white text-base mb-1 line-clamp-2">{course.title}</h3>

        <div className="flex items-center gap-1 mb-3 text-sm text-slate-400">
          <span>por</span>
          <span className="text-slate-300 font-medium">{course.tutor}</span>
          <span className="text-slate-600">·</span>
          <span className="text-yellow-400">★</span>
          <span className="font-medium">{course.rating}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span className="text-yellow-400 font-black text-lg">{course.price}</span>
            <span className="text-yellow-600 text-sm font-bold">8T</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>👥</span>
            <span>{course.students} estudiantes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
