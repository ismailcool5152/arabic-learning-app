import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, backupToDrive, restoreFromDrive } from '../lib/driveSync';
import { Cloud, UploadCloud, DownloadCloud, Loader2, LogOut, User as UserIcon, Check } from 'lucide-react';

interface StudyCircleSyncProps {
    theme: string;
}

export default function DriveSettings({ theme }: StudyCircleSyncProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [actionStatus, setActionStatus] = useState<{message: string, type: 'success'|'error'} | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Theme logic
    const isParchment = theme === 'parchment';
    const isCosmic = theme === 'cosmic';

    const bgClass = isParchment ? 'bg-[#ebd8c3]/35 border-[#dfd2be]/80 text-[#2c241e]' : isCosmic ? 'bg-indigo-950/35 border-indigo-950/80 text-indigo-100' : 'bg-slate-900/60 border-slate-800/80 text-slate-100';
    const textClass = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400';
    const highlightBgHover = isParchment ? 'hover:bg-[#dfd2be]' : isCosmic ? 'hover:bg-indigo-900/80' : 'hover:bg-slate-800';

    useEffect(() => {
        const unsubscribe = initAuth(
            (user) => { setUser(user); },
            () => { setUser(null); }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showMessage = (msg: string, isError = false) => {
        setActionStatus({ message: msg, type: isError ? 'error' : 'success' });
        setTimeout(() => setActionStatus(null), 3000);
    }

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await googleSignIn();
            if (result) setUser(result.user);
        } catch (e: any) {
            showMessage(e.message, true);
        } finally {
            setIsLoading(false);
        }
    }

    const handleBackup = async () => {
        setIsLoading(true);
        try {
            await backupToDrive();
            showMessage("Backed up successfully.");
        } catch (e: any) {
            showMessage(e.message || "Backup failed", true);
        } finally {
            setIsLoading(false);
        }
    }

    const handleRestore = async () => {
        setIsLoading(true);
        try {
            const success = await restoreFromDrive();
            if (success) {
                showMessage("Restored successfully.");
            }
        } catch (e: any) {
            showMessage(e.message || "Restore failed", true);
        } finally {
            setIsLoading(false);
            setIsMenuOpen(false);
        }
    }

    const handleSignOut = async () => {
        await logout();
        setIsMenuOpen(false);
    }

    return (
        <div className={`relative flex items-center rounded-xl border p-1 transition-all duration-300 ${bgClass}`} ref={menuRef}>
            {user ? (
                <div className="flex items-center gap-2 pl-2.5 pr-1.5 py-0.5" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className={`p-1 rounded-lg bg-current/5 border border-current/10 cursor-pointer ${textClass}`}>
                        {user.photoURL ? (
                           <img src={user.photoURL} alt="Profile" className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                           <UserIcon className="w-3.5 h-3.5" />
                        )}
                    </div>
                    <div className="min-w-0 pr-1 cursor-pointer">
                        <p className={`flex items-center gap-1 text-[8px] font-mono uppercase tracking-wider leading-none text-current/50`}>
                            Study Circle
                        </p>
                        <h3 className="text-[11px] font-bold truncate leading-snug mt-0.5 flex items-center gap-1">
                            <span>{user.displayName || user.email?.split('@')[0]}</span>
                        </h3>
                    </div>
                    {/* Status inline */}
                    {actionStatus && (
                         <div className={`text-[9px] font-mono whitespace-nowrap absolute right-[-4px] top-[-16px] px-1.5 py-0.5 rounded shadow ${actionStatus.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            {actionStatus.message}
                        </div>
                    )}
                </div>
            ) : (
                <button 
                    onClick={handleLogin} 
                    disabled={isLoading}
                    className={`px-3 py-1 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${highlightBgHover} rounded-lg`}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : (
                        <svg className="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                    )}
                    Sign in to Circle
                </button>
            )}

            {isMenuOpen && user && (
                <div className={`absolute top-full right-0 mt-2 z-50 min-w-[200px] border shadow-xl rounded-xl p-2 ${
                     isParchment ? 'bg-[#fdfbf7] border-[#dfd2be] text-[#2c241e]' 
                     : isCosmic ? 'bg-[#0b0c10] border-indigo-900 text-indigo-100'
                     : 'bg-slate-900 border-slate-800 text-slate-100'
                }`}>
                    <div className="flex flex-col gap-1">
                        <button 
                            onClick={handleBackup} 
                            disabled={isLoading}
                            className={`px-3 py-2 text-xs text-left rounded-lg transition-all flex items-center justify-between ${highlightBgHover} disabled:opacity-50`}
                        >
                            <span className="flex items-center gap-2">
                                <UploadCloud className="w-4 h-4" /> Sync to Drive
                            </span>
                            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                        </button>
                        
                        <button 
                            onClick={handleRestore} 
                            disabled={isLoading}
                            className={`px-3 py-2 text-xs text-left rounded-lg transition-all flex items-center justify-between ${highlightBgHover} disabled:opacity-50`}
                        >
                            <span className="flex items-center gap-2">
                                <DownloadCloud className="w-4 h-4" /> Restore from Drive
                            </span>
                        </button>

                        <div className="h-px bg-current opacity-10 my-1"></div>

                        <button 
                            onClick={handleSignOut}
                            disabled={isLoading}
                            className={`px-3 py-2 text-xs text-left rounded-lg transition-all flex items-center gap-2 text-red-400 hover:bg-red-500/10 disabled:opacity-50`}
                        >
                            <LogOut className="w-4 h-4" /> Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
