import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { COURSES, ACTIVITY_FEED, ACHIEVEMENTS, timeAgo, generateTxHash } from '../data/mockData';

// Animated counter
function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    const diff = value - prev;
    if (diff === 0) return;
    const steps = 20;
    const step = diff / steps;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setDisplay(Math.round(prev + step * count));
      if (count >= steps) { clearInterval(interval); setDisplay(value); }
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

export default function Dashboard() {
  const { user, tokens, purchasedCourses, buyCourse, earnTokens, walletConnected, connectWallet } = useApp();
  const [feed, setFeed] = useState(ACTIVITY_FEED);
  const [buyingId, setBuyingId] = useState(null);
  const [justBought, setJustBought] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Live feed updates
  useEffect(() => {
    const activityNames = ['Laura P.', 'Diego H.', 'Valentina R.', 'Sebastián M.', 'Isabella T.'];
    const activityActions = [
      { type: 'earn', action: 'subió apuntes de', subject: 'Álgebra Lineal', tokens: +20 },
      { type: 'purchase', action: 'compró', subject: 'Física Mecánica', tokens: -35 },
      { type: 'tutor', action: 'completó tutoría de', subject: 'Cálculo II', tokens: +45 },
      { type: 'achievement', action: 'desbloqueó logro', subject: 'Primer Paso', tokens: +10 },
    ];

    const interval = setInterval(() => {
      const random = activityActions[Math.floor(Math.random() * activityActions.length)];
      const name = activityNames[Math.floor(Math.random() * activityNames.length)];
      setFeed(prev => [{
        id: 'act_' + Date.now(),
        ...random,
        user: name,
        timestamp: new Date(),
        hash: generateTxHash(),
      }, ...prev.slice(0, 8)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleBuy = async (course) => {
    setBuyingId(course.id);
    await new Promise(r => setTimeout(r, 800));
    const ok = buyCourse(course);
    if (ok) setJustBought(course.id);
    setBuyingId(null);
    setTimeout(() => setJustBought(null), 2000);
  };

  const progressPercent = Math.min((user?.completedCourses / 20) * 100, 100);

  return (
    <div className="min-h-screen bg-dark-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Welcome Banner ────────────────────────────────────── */}
        <div className="relative glass rounded-3xl p-6 md:p-8 mb-8 border border-violet-500/20 overflow-hidden">
          <div className="orb w-64 h-64 right-0 top-1/2 -translate-y-1/2 bg-violet-600/20"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-violet-500/30">
                {user?.avatar}
              </div>
              <div>
                <p className="text-slate-400 text-sm">Bienvenido de vuelta 👋</p>
                <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <span className="text-slate-400">{user?.university}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-violet-400 font-medium">{user?.level} 🏅</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center glass px-5 py-3 rounded-2xl border border-yellow-500/20">
                <div className="text-2xl font-black text-yellow-400 token-number">
                  <AnimatedNumber value={tokens} />
                </div>
                <div className="text-yellow-600 text-xs font-semibold">EightTokens</div>
              </div>
              <div className="text-center glass px-5 py-3 rounded-2xl border border-orange-500/20">
                <div className="text-2xl font-black text-orange-400">{user?.streak}</div>
                <div className="text-orange-600 text-xs font-semibold">🔥 Racha</div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="relative z-10 mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Progreso hacia <span className="text-violet-400">Platinum Scholar</span></span>
              <span>{user?.completedCourses}/20 cursos</span>
            </div>
            <div className="progress-bar h-2">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* ── KPIs ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            icon="📚"
            label="Cursos completados"
            value={user?.completedCourses}
            sub="+3 este mes"
            color="violet"
          />
          <KpiCard
            icon="📤"
            label="Apuntes subidos"
            value={user?.uploadedNotes}
            sub={`+${user?.uploadedNotes * 10} 8T ganados`}
            color="cyan"
          />
          <KpiCard
            icon="👨‍🏫"
            label="Tutorías dadas"
            value={user?.tutoringSessions}
            sub="⭐ 4.9 promedio"
            color="yellow"
          />
          <KpiCard
            icon="🏆"
            label="Logros desbloqueados"
            value={5}
            sub="1 pendiente"
            color="green"
          />
        </div>

        {/* ── Tabs ──────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['overview', 'mis-cursos', 'billetera'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab === 'overview' && '🏠 Inicio'}
              {tab === 'mis-cursos' && '📚 Mis Cursos'}
              {tab === 'billetera' && '⚡ Billetera'}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ─────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Recommended Courses */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Cursos recomendados</h2>
                <Link to="/explore" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
                  Ver todos →
                </Link>
              </div>

              <div className="space-y-3">
                {COURSES.slice(0, 4).map(course => (
                  <CourseRow
                    key={course.id}
                    course={course}
                    tokens={tokens}
                    onBuy={handleBuy}
                    buying={buyingId === course.id}
                    bought={justBought === course.id || !!purchasedCourses.find(c => c.id === course.id)}
                  />
                ))}
              </div>
            </div>

            {/* Right: Activity + Wallet */}
            <div className="space-y-6">
              {/* Wallet summary */}
              {!walletConnected ? (
                <div className="glass rounded-2xl p-5 border border-violet-500/20">
                  <h3 className="font-bold text-white mb-1">🔗 Conecta tu Wallet</h3>
                  <p className="text-slate-400 text-xs mb-4">Activa tu cuenta blockchain para recibir NFTs y certificados verificables.</p>
                  <button onClick={connectWallet} className="btn-primary w-full text-sm py-2.5">
                    Conectar MetaMask
                  </button>
                </div>
              ) : (
                <div className="glass rounded-2xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="live-dot"></div>
                    <h3 className="font-bold text-emerald-400 text-sm">Wallet Conectada</h3>
                  </div>
                  <div className="font-mono text-slate-300 text-xs mb-2">{user?.walletAddress}</div>
                  <div className="text-2xl font-black text-yellow-400 token-number">
                    <AnimatedNumber value={tokens} suffix=" 8T" />
                  </div>
                  <button
                    onClick={() => earnTokens(25, 'subir apuntes')}
                    className="mt-3 w-full text-sm py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                  >
                    + Ganar tokens (demo)
                  </button>
                </div>
              )}

              {/* Live activity */}
              <div className="glass rounded-2xl p-5 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Actividad en vivo</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="live-dot"></div>
                    <span className="text-xs text-emerald-400">LIVE</span>
                  </div>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {feed.map((item, i) => (
                    <ActivityItem key={item.id} item={item} isNew={i === 0} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Mis Cursos ───────────────────────────────────── */}
        {activeTab === 'mis-cursos' && (
          <div>
            {purchasedCourses.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-white mb-2">Aún no tienes cursos</h3>
                <p className="text-slate-400 mb-6">Explora el marketplace y compra tu primer curso con EightTokens</p>
                <Link to="/explore" className="btn-primary inline-block">
                  Explorar cursos →
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedCourses.map(course => (
                  <PurchasedCourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Billetera ────────────────────────────────────── */}
        {activeTab === 'billetera' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border border-yellow-500/20">
              <h3 className="font-bold text-white mb-6">💳 Mi Billetera EightTokens</h3>

              <div className="text-center py-6 mb-6">
                <div className="text-6xl font-black gradient-text-gold token-number">
                  <AnimatedNumber value={tokens} />
                </div>
                <div className="text-yellow-600 font-semibold mt-1">EightTokens disponibles</div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <WalletStat label="Total ganado" value={user?.totalEarned} color="emerald" />
                <WalletStat label="Total gastado" value={user?.totalSpent} color="red" />
                <WalletStat label="Balance neto" value={user?.totalEarned - user?.totalSpent} color="yellow" />
              </div>

              <div className="space-y-2">
                <button onClick={() => earnTokens(50, 'subir apuntes de Cálculo')} className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-sm font-medium">
                  📤 Simular: Subir apuntes (+50 8T)
                </button>
                <button onClick={() => earnTokens(60, 'completar tutoría')} className="w-full py-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors text-sm font-medium">
                  👨‍🏫 Simular: Completar tutoría (+60 8T)
                </button>
                <button onClick={() => earnTokens(25, 'completar curso')} className="w-full py-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors text-sm font-medium">
                  🎯 Simular: Completar curso (+25 8T)
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/[0.06]">
              <h3 className="font-bold text-white mb-4">📊 Historial de transacciones</h3>
              <div className="space-y-3">
                {feed.slice(0, 6).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <div>
                      <div className="text-sm text-slate-300">{item.action} {item.subject}</div>
                      <div className="hash-text mt-0.5">{item.hash} · {timeAgo(item.timestamp)}</div>
                    </div>
                    <span className={`font-bold text-sm ${item.tokens > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.tokens > 0 ? '+' : ''}{item.tokens} 8T
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, color }) {
  const colors = {
    violet: 'border-violet-500/20 bg-violet-500/5',
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
    yellow: 'border-yellow-500/20 bg-yellow-500/5',
    green: 'border-emerald-500/20 bg-emerald-500/5',
  };
  const text = {
    violet: 'text-violet-400',
    cyan: 'text-cyan-400',
    yellow: 'text-yellow-400',
    green: 'text-emerald-400',
  };

  return (
    <div className={`glass rounded-2xl p-5 border ${colors[color]}`}>
      <div className="text-2xl mb-3">{icon}</div>
      <div className={`text-3xl font-black ${text[color]}`}>{value}</div>
      <div className="text-slate-400 text-xs mt-1">{label}</div>
      <div className={`text-xs mt-1 ${text[color]} opacity-70`}>{sub}</div>
    </div>
  );
}

function CourseRow({ course, tokens, onBuy, buying, bought }) {
  const subjectEmojis = { 'Matemáticas': '📐', 'Programación': '💻', 'Física': '⚛️', 'Contabilidad': '📊', 'IA/ML': '🤖', 'Química': '🧪' };
  const canAfford = tokens >= course.price;

  return (
    <div className="glass glass-hover rounded-xl p-4 border border-white/[0.06] flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
        style={{ background: course.subjectColor + '20' }}>
        {subjectEmojis[course.subject] || '📚'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-sm truncate">{course.title}</div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
          <span>{course.tutor}</span>
          <span>·</span>
          <span className="text-yellow-400">★ {course.rating}</span>
          <span>·</span>
          <span>{course.duration}</span>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <div className="text-yellow-400 font-bold text-sm mb-1">{course.price} 8T</div>
        {bought ? (
          <span className="text-xs text-emerald-400 font-medium">✓ Comprado</span>
        ) : (
          <button
            onClick={() => onBuy(course)}
            disabled={buying || !canAfford}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              buying ? 'bg-violet-500/20 text-violet-400 animate-pulse' :
              canAfford ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30' :
              'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {buying ? '...' : canAfford ? 'Comprar' : 'Sin 8T'}
          </button>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ item, isNew }) {
  const colors = {
    purchase: 'text-red-400',
    earn: 'text-emerald-400',
    tutor: 'text-cyan-400',
    achievement: 'text-yellow-400',
  };
  const icons = { purchase: '🛒', earn: '📤', tutor: '👨‍🏫', achievement: '🏆' };

  return (
    <div className={`transition-all duration-500 ${isNew ? 'animate-slide-up' : ''}`}>
      <div className="flex items-start gap-2">
        <span className="text-base flex-shrink-0">{icons[item.type]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-medium text-white">{item.user}</span>
            {' '}{item.action}{' '}
            <span className="text-slate-400">{item.subject}</span>
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="hash-text">{item.hash}</span>
            <span className={`text-xs font-bold ${colors[item.type]}`}>
              {item.tokens > 0 ? '+' : ''}{item.tokens} 8T
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WalletStat({ label, value, color }) {
  const text = { emerald: 'text-emerald-400', red: 'text-red-400', yellow: 'text-yellow-400' };
  return (
    <div className="glass rounded-xl p-3 text-center border border-white/[0.06]">
      <div className={`text-lg font-black ${text[color]} token-number`}>{value?.toLocaleString()}</div>
      <div className="text-slate-500 text-xs mt-0.5">{label}</div>
    </div>
  );
}

function PurchasedCourseCard({ course }) {
  const [progress] = useState(Math.floor(Math.random() * 80) + 10);
  const subjectEmojis = { 'Matemáticas': '📐', 'Programación': '💻', 'Física': '⚛️', 'Contabilidad': '📊', 'IA/ML': '🤖', 'Química': '🧪' };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-emerald-500/20">
      <div className="h-28 flex items-center justify-center text-5xl"
        style={{ background: course.subjectColor + '20' }}>
        {subjectEmojis[course.subject] || '📚'}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-slate-400 text-xs mb-4">{course.tutor}</p>
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>Progreso</span>
          <span className="text-emerald-400">{progress}%</span>
        </div>
        <div className="progress-bar h-1.5">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <button className="mt-4 w-full py-2 rounded-lg text-sm font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors">
          Continuar →
        </button>
      </div>
    </div>
  );
}
