
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { mockBackend } from '../services/mockBackend';
import Logo from './Logo';

interface Props {
  onLogin: (user: User) => void;
}

const AuthFlow: React.FC<Props> = ({ onLogin }) => {
  const [step, setStep] = useState<'splash' | 'role' | 'login'>('splash');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>(UserRole.VISITOR);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('login');
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    // For mock purposes, we just log in with the provided name and role
    const user = mockBackend.login(name, role);
    onLogin(user);
  };

  if (step === 'splash') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 scale-110 blur-sm"
            alt="background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center animate-fadeIn">
          <Logo size="xl" showTagline={true} className="mb-8" />
          <button 
            onClick={() => setStep('role')}
            className="group relative overflow-hidden bg-white text-black px-16 py-5 rounded-full font-bold text-xl hover:bg-amber-500 transition-all shadow-2xl flex items-center gap-4"
          >
            <span>Enter the Sanctuary</span>
            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Visual Side */}
      <div className="hidden lg:block w-1/2 h-full relative">
        <img 
          src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1500" 
          className="w-full h-full object-cover grayscale opacity-60" 
          alt="Art background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black"></div>
        <div className="absolute bottom-20 left-20">
          <h2 className="text-4xl font-serif text-white mb-4 italic italic">"Art washes away from the soul the dust of everyday life."</h2>
          <p className="text-zinc-500 uppercase tracking-widest text-sm">— Pablo Picasso</p>
        </div>
      </div>

      {/* Auth Form Side */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 bg-[#080808]">
        <div className="w-full max-w-md animate-fadeIn">
          {step === 'role' && (
            <div className="space-y-10">
              <header className="text-left">
                <Logo size="md" showText={false} className="mb-6" />
                <h2 className="text-4xl font-serif text-white mb-2">Identify Your Path</h2>
                <p className="text-zinc-500">Choose how you wish to engage with the gallery.</p>
              </header>
              
              <div className="space-y-4">
                {[
                  { r: UserRole.VISITOR, label: 'Collector', desc: 'Browse and acquire unique masterpieces.', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                  { r: UserRole.ARTIST, label: 'Artist', desc: 'Exhibit your vision to a global audience.', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
                  { r: UserRole.CURATOR, label: 'Curator', desc: 'Organize exhibitions and provide insights.', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
                  { r: UserRole.ADMIN, label: 'Administrator', desc: 'Manage platform users and settings.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
                ].map((item) => (
                  <button
                    key={item.r}
                    onClick={() => handleRoleSelect(item.r)}
                    className="w-full group p-6 glass rounded-2xl hover:bg-amber-500/5 hover:border-amber-500 transition-all flex items-center gap-6"
                  >
                    <div className="p-3 bg-white/5 rounded-xl text-zinc-400 group-hover:text-amber-500 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">{item.label}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'login' && (
            <div className="space-y-8">
              <header>
                <button onClick={() => setStep('role')} className="text-zinc-500 hover:text-white mb-6 flex items-center gap-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  Back to selection
                </button>
                <div className="flex justify-between items-end mb-2">
                  <h2 className="text-4xl font-serif text-white">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors pb-1"
                  >
                    {mode === 'login' ? 'Sign Up' : 'Log In'}
                  </button>
                </div>
                <p className="text-zinc-500 uppercase text-xs font-bold tracking-[0.2em]">Authorized Access • {role}</p>
              </header>

              <form onSubmit={handleFinalize} className="space-y-6">
                <div className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. julian@artforge.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-amber-500 transition-all"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Registered Identity</label>
                    <input 
                      autoFocus
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Julian Reed"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Passkey</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
                <button className="w-full bg-white text-black py-5 rounded-2xl font-bold text-lg hover:bg-amber-500 transition-all shadow-xl">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
                <p className="text-center text-xs text-zinc-600">Secure encryption active. Your credentials are protected.</p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;
