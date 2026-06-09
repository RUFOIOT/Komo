import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, TOKEN_HISTORY, generateTxHash } from '../data/mockData';

export default function Profile() {
  const { user, tokens, purchasedCourses, earnTokens } = useApp();
  const [uploadingNotes, setUploadingNotes] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState(null);

  const handleUpload = async () => {
    setUploadingNotes(true);
    await new Promise(r => setTimeout(r, 1500));
    earnTokens(25, 'subir apuntes de Termodinámica');
    setUploadingNotes(false);
  };

  const rarityColor = {
    'Común': { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400' },
    'Raro': { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
    'Épico': { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' },
    'Legendario': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  };

  return (
    <div className="min-h-screen bg-dark-100 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Profile Header ────────────────────────────────────── */}
        <div className="relative glass rounded-3xl overflow-hidden mb-8 border border-white/[0.06]">
          {/* Banner */}
          <div className="h-36 bg-gradient-to-r from-violet-900 via-indigo-900 to-cyan-900 relative overflow-hidden">
            <div className="orb w-64 h-64 left-1/4 top-1/2 -translate-y-1/2 bg-violet-600/30"></div>
            <div className="orb w-48 h-48 right-1/4 top-1/2 -translate-y-1/2 bg-cyan-600/20"></div>
            {/* ODS badges */}
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="text-xs px-2 py-1 rounded-lg bg-white/10 text-white border border-white/20">ODS 4 ✓</span>
              <span className="text-xs px-2 py-1 rounded-lg bg-white/10 text-white border border-white/20">ODS 9 ✓</span>
              <span className="text-xs px-2 py-1 rounded-lg bg-white/10 text-white border border-white/20">ODS 10 ✓</span>
            </div>
          </div>

          {/* Profile info */}
          <div className="px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 mb-6 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-black border-4 border-dark-200 shadow-xl shadow-violet-500/30">
                {user?.avatar}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                  <span className="verified-badge">✓ Blockchain</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-medium">
                    🏅 {user?.level}
                  </span>
                </div>
                <div className="text-slate-400 text-sm mt-1">{user?.username} · {user?.university}</div>
                <div className="text-slate-500 text-xs mt-0.5">{user?.career} · {user?.semester}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center glass px-4 py-2 rounded-xl border border-yellow-500/20">
                  <div className="text-xl font-black text-yellow-400 token-number">{tokens}</div>
                  <div className="text-yellow-600 text-xs">8T</div>
                </div>
                <div className="text-center glass px-4 py-2 rounded-xl border border-orange-500/20">
                  <div className="text-xl font-black text-orange-400">{user?.streak}</div>
                  <div className="text-orange-600 text-xs">🔥 días</div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ProfileStat emoji="📚" value={user?.completedCourses} label="Cursos" color="violet" />
              <ProfileStat emoji="📤" value={user?.uploadedNotes} label="Apuntes subidos" color="cyan" />
              <ProfileStat emoji="👨‍🏫" value={user?.tutoringSessions} label="Tutorías" color="yellow" />
              <ProfileStat emoji="⭐" value={user?.reputation} label="Reputación" color="green" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="space-y-6">
            {/* Wallet card */}
            <div className="glass rounded-2xl p-6 border border-yellow-500/20">
              <h3 className="font-bold text-white mb-4">⚡ Billetera</h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-black gradient-text-gold token-number">{tokens}</div>
                <div className="text-yellow-600 text-sm font-semibold">EightTokens</div>
              </div>
              <div className="font-mono text-xs text-slate-500 text-center mb-4 hash-text">
                {user?.walletAddress}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Total ganado</span>
                  <span className="text-emerald-400 font-semibold">{user?.totalEarned} 8T</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total gastado</span>
                  <span className="text-red-400 font-semibold">{user?.totalSpent} 8T</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-2 border-t border-white/[0.06]">
                  <span>Balance neto</span>
                  <span className="text-yellow-400 font-bold">{user?.totalEarned - user?.totalSpent} 8T</span>
                </div>
              </div>
            </div>

            {/* Token chart - simple bars */}
            <div className="glass rounded-2xl p-6 border border-white/[0.06]">
              <h3 className="font-bold text-white mb-4">📊 Actividad mensual</h3>
              <div className="flex items-end justify-between gap-2 h-28">
                {TOKEN_HISTORY.map((d) => {
                  const maxVal = Math.max(...TOKEN_HISTORY.map(x => Math.max(x.earned, x.spent)));
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col items-center gap-0.5">
                        <div
                          className="w-full rounded-sm bg-emerald-500/40 transition-all"
                          style={{ height: `${(d.earned / maxVal) * 70}px` }}
                        ></div>
                        <div
                          className="w-full rounded-sm bg-red-500/30 transition-all"
                          style={{ height: `${(d.spent / maxVal) * 40}px` }}
                        ></div>
                      </div>
                      <span className="text-slate-600 text-xs">{d.date}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500/40"></div><span className="text-slate-500">Ganado</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-red-500/30"></div><span className="text-slate-500">Gastado</span></div>
              </div>
            </div>

            {/* Upload notes */}
            <div className="glass rounded-2xl p-6 border border-cyan-500/20">
              <h3 className="font-bold text-white mb-2">📤 Compartir apuntes</h3>
              <p className="text-slate-400 text-xs mb-4">Sube tus apuntes y gana EightTokens por cada descarga de la comunidad.</p>

              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-violet-500/30 transition-colors cursor-pointer mb-3">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-slate-400 text-xs">Arrastra PDF/DOCX o haz click</div>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploadingNotes}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  uploadingNotes
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                    : 'btn-primary'
                }`}
              >
                {uploadingNotes ? '📡 Subiendo a blockchain...' : '⬆️ Subir y ganar 8T'}
              </button>
            </div>
          </div>

          {/* Right: Achievements + Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <div className="glass rounded-2xl p-6 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-lg">🏆 Logros NFT</h3>
                <span className="text-xs text-slate-500">{ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length} desbloqueados</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ACHIEVEMENTS.map(ach => (
                  <div
                    key={ach.id}
                    onClick={() => setActiveAchievement(activeAchievement?.id === ach.id ? null : ach)}
                    className={`nft-badge p-4 cursor-pointer transition-all ${ach.unlocked ? '' : 'opacity-40 grayscale'}`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{ach.emoji}</div>
                      <div className="font-bold text-white text-xs mb-1">{ach.title}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${rarityColor[ach.rarity]?.bg} ${rarityColor[ach.rarity]?.border} ${rarityColor[ach.rarity]?.text} border`}>
                        {ach.rarity}
                      </div>
                      {ach.unlocked && (
                        <div className="mt-2 text-yellow-400 text-xs font-bold">+{ach.tokenReward} 8T</div>
                      )}
                    </div>

                    {/* Expanded */}
                    {activeAchievement?.id === ach.id && ach.unlocked && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-slate-400 text-xs mb-2">{ach.description}</p>
                        {ach.txHash && (
                          <div className="hash-text">{ach.txHash}</div>
                        )}
                        <div className="text-slate-600 text-xs mt-1">{ach.earnedAt}</div>
                      </div>
                    )}

                    {activeAchievement?.id === ach.id && !ach.unlocked && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-slate-400 text-xs">{ach.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Purchased courses */}
            <div className="glass rounded-2xl p-6 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">📚 Mis Cursos</h3>
                <span className="text-xs text-slate-500">{purchasedCourses.length} comprados</span>
              </div>

              {purchasedCourses.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm">Aún no has comprado cursos</p>
                  <p className="text-xs mt-1">Explora el marketplace y comienza a aprender</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchasedCourses.map(course => (
                    <div key={course.id} className="flex items-center gap-4 glass rounded-xl p-3 border border-violet-500/20">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ background: course.subjectColor + '20' }}>
                        {['📐','💻','⚛️','📊','🤖','🧪']['Matemáticas,Programación,Física,Contabilidad,IA/ML,Química'.split(',').indexOf(course.subject)] || '📚'}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{course.title}</div>
                        <div className="text-xs text-slate-500">{course.tutor}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-emerald-400 font-medium">✓ Comprado</div>
                        <div className="text-xs text-slate-500">{course.price} 8T</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificate CTA */}
            <div className="glass rounded-2xl p-6 border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎓</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Certificado Blockchain</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Completa 5 cursos más para obtener tu certificado verificable en blockchain — válido ante empleadores y universidades.
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progreso</span>
                      <span className="text-yellow-400">{purchasedCourses.length}/5 cursos</span>
                    </div>
                    <div className="progress-bar h-2">
                      <div className="progress-fill" style={{ width: `${Math.min((purchasedCourses.length / 5) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600">
                    NFT ID: {generateTxHash()} · Emitido en Ethereum Testnet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileStat({ emoji, value, label, color }) {
  const text = { violet: 'text-violet-400', cyan: 'text-cyan-400', yellow: 'text-yellow-400', green: 'text-emerald-400' };
  const border = { violet: 'border-violet-500/20', cyan: 'border-cyan-500/20', yellow: 'border-yellow-500/20', green: 'border-emerald-500/20' };

  return (
    <div className={`glass rounded-xl p-3 border ${border[color]} text-center`}>
      <div className="text-2xl mb-1">{emoji}</div>
      <div className={`text-2xl font-black ${text[color]}`}>{value}</div>
      <div className="text-slate-500 text-xs mt-0.5">{label}</div>
    </div>
  );
}
