
import React from 'react';

interface TriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: 'primary' | 'ghost' | 'alert';
  busy?: boolean;
}

export const ActionTrigger: React.FC<TriggerProps> = ({ 
  children, 
  mode = 'primary', 
  busy, 
  className = '', 
  disabled,
  ...rest 
}) => {
  const coreClass = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-semibold transition-all duration-150 text-sm outline-none ring-offset-white dark:ring-offset-slate-950 focus:ring-2";
  
  const styles = {
    primary: "bg-violet-700 hover:bg-violet-600 text-white focus:ring-violet-400 shadow-lg shadow-violet-900/20",
    ghost: "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:ring-slate-300 dark:focus:ring-slate-700 border border-slate-200 dark:border-slate-800 shadow-sm",
    alert: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/40"
  };

  return (
    <button 
      className={`${coreClass} ${styles[mode]} ${disabled || busy ? 'opacity-40 grayscale pointer-events-none' : ''} ${className}`}
      disabled={disabled || busy}
      {...rest}
    >
      {busy && (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
