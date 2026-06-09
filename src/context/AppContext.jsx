import React, { createContext, useContext, useState, useCallback } from 'react';
import { DEMO_USER, COURSES } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokens, setTokens] = useState(DEMO_USER.tokens);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [toast, setToast] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const login = useCallback(() => {
    setUser(DEMO_USER);
    setIsLoggedIn(true);
    showToast('¡Bienvenido de vuelta, ' + DEMO_USER.name.split(' ')[0] + '! 🎉');
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setTokens(DEMO_USER.tokens);
    setPurchasedCourses([]);
    setWalletConnected(false);
  }, []);

  const buyCourse = useCallback((course) => {
    if (purchasedCourses.find(c => c.id === course.id)) {
      showToast('Ya tienes este curso 📖', 'info');
      return false;
    }
    if (tokens < course.price) {
      showToast('No tienes suficientes EightTokens 😕', 'error');
      return false;
    }
    setTokens(prev => prev - course.price);
    setPurchasedCourses(prev => [...prev, course]);
    showToast(`¡Compraste "${course.title}" por ${course.price} 8T! 🚀`);
    return true;
  }, [tokens, purchasedCourses, showToast]);

  const earnTokens = useCallback((amount, reason) => {
    setTokens(prev => prev + amount);
    showToast(`+${amount} EightTokens ganados: ${reason} 💰`);
  }, [showToast]);

  const connectWallet = useCallback(() => {
    setTimeout(() => {
      setWalletConnected(true);
      showToast('Wallet conectada: ' + DEMO_USER.walletAddress + ' 🔗');
    }, 1200);
  }, [showToast]);

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn,
      tokens,
      purchasedCourses,
      toast,
      walletConnected,
      login,
      logout,
      buyCourse,
      earnTokens,
      connectWallet,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
