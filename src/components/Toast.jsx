import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300',
    info: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const type = toast.type || 'success';

  return (
    <div
      key={toast.id}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl glass border ${colors[type]} shadow-2xl animate-bounce-in`}
      style={{ minWidth: '280px', maxWidth: '90vw' }}
    >
      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-current flex-shrink-0">
        {icons[type]}
      </span>
      <span className="text-sm font-medium text-slate-200">{toast.msg}</span>
    </div>
  );
}
