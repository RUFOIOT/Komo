import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { isLoggedIn, tokens, user, logout, login, walletConnected, connectWallet } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || isLoggedIn
        ? 'glass border-b border-white/[0.06] py-3'
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              K
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Komo
            </span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium border border-violet-500/30">
              Web3
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isLoggedIn ? (
              <>
                <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
                <NavLink to="/explore" active={isActive('/explore')}>Explorar</NavLink>
                <NavLink to="/profile" active={isActive('/profile')}>Mi Perfil</NavLink>
              </>
            ) : (
              <>
                <a href="#features" className="nav-item">Características</a>
                <a href="#how-it-works" className="nav-item">Cómo funciona</a>
                <a href="#tokens" className="nav-item">EightTokens</a>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Token balance */}
                <div className="hidden sm:flex items-center gap-2 glass px-3 py-1.5 rounded-xl border border-yellow-500/20">
                  <span className="text-yellow-400 text-base">⚡</span>
                  <span className="font-bold text-yellow-400 token-number">{tokens.toLocaleString()}</span>
                  <span className="text-yellow-600 text-xs font-medium">8T</span>
                </div>

                {/* Wallet */}
                {!walletConnected ? (
                  <button
                    onClick={connectWallet}
                    className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 transition-colors"
                  >
                    <span>🔗</span>
                    <span>Wallet</span>
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <div className="live-dot w-1.5 h-1.5"></div>
                    <span className="font-mono">{user?.walletAddress}</span>
                  </div>
                )}

                {/* Avatar */}
                <div className="relative group">
                  <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                    {user?.avatar}
                  </button>
                  <div className="absolute right-0 top-12 w-44 glass border border-white/10 rounded-xl p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                    <Link to="/profile" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Mi Perfil</Link>
                    <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">Cerrar sesión</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button onClick={handleLogin} className="btn-ghost text-sm py-2 px-4">
                  Iniciar sesión
                </button>
                <button onClick={handleLogin} className="btn-primary text-sm py-2 px-4">
                  Probar Demo 🚀
                </button>
              </>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 glass rounded-xl border border-white/[0.08] p-3 animate-slide-up">
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link to="/dashboard" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/explore" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMenuOpen(false)}>Explorar</Link>
                <Link to="/profile" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMenuOpen(false)}>Mi Perfil</Link>
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="text-yellow-400">⚡</span>
                  <span className="font-bold text-yellow-400">{tokens} 8T</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <button onClick={() => { handleLogin(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg">Probar Demo</button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .nav-item {
          padding: 0.4rem 0.875rem;
          font-size: 0.9rem;
          color: rgba(203, 213, 225, 0.8);
          border-radius: 0.5rem;
          transition: all 0.2s;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-item:hover {
          color: white;
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
}
