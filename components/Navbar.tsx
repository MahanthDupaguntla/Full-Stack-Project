
import React from 'react';
import { User } from '../types';
import Logo from './Logo';

interface NavbarProps {
  user: User | null;
  activeView: 'gallery' | 'exhibitions' | 'auctions' | 'dashboard' | 'sold' | 'timeline' | 'profile';
  onViewChange: (view: any) => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, activeView, onViewChange, onLogout, onSearch, searchQuery }) => {
  if (!user) return null;

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    switch (user.role) {
      case 'ARTIST': return 'Artist Studio';
      case 'CURATOR': return 'Curatorial Deck';
      case 'ADMIN': return 'Gallery Control';
      default: return 'My Sanctuary';
    }
  };

  const quickLinks = [
    { id: 'auctions', label: 'Live Auction', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'exhibitions', label: 'Exhibitions', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'dashboard', label: getDashboardLabel(), icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'timeline', label: 'Ledger', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Top Header */}
        <div className="glass rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl border border-white/10">
          <div className="cursor-pointer" onClick={() => onViewChange('gallery')}>
            <Logo size="md" showTagline={true} />
          </div>

          <div className="flex-1 max-w-xl mx-8 relative flex items-center gap-4">
            <div className="relative flex-1">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search the archive..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-xs text-white outline-none focus:border-amber-500 focus:bg-white/10 transition-all"
              />
              <svg className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            
            <div className="hidden xl:flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
              {quickLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => onViewChange(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${activeView === link.id ? 'bg-white/10 text-amber-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} /></svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{link.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
               <p className="text-[10px] text-white font-black tracking-widest uppercase">{user.name}</p>
               <p className="text-[8px] text-amber-500/60 uppercase tracking-[0.3em] font-bold">{user.role}</p>
            </div>
            
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 cursor-pointer overflow-hidden hover:border-amber-500 transition-all shadow-xl">
                <img src={user.avatar} className="w-full h-full object-cover" alt="user" />
              </div>
              <div className="absolute right-0 top-full pt-4 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div className="glass rounded-2xl p-5 w-56 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10">
                  <div className="pb-4 border-b border-white/10 mb-4">
                    <p className="text-[9px] text-zinc-500 mb-1 uppercase tracking-widest font-bold">Liquidity Available</p>
                    <p className="text-lg font-serif font-bold text-white">${user.walletBalance.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => onViewChange('profile')}
                      className="w-full text-center py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full text-center py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Terminate Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Mobile Nav (Visible only on smaller screens) */}
        <div className="xl:hidden flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {quickLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onViewChange(link.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full glass border transition-all ${activeView === link.id ? 'border-amber-500/50 text-amber-500 bg-amber-500/10' : 'border-white/5 text-zinc-400'}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} /></svg>
              <span className="text-[9px] font-bold uppercase tracking-widest">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
