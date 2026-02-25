import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Artwork, User } from './types';
import Navbar from './components/Navbar';
import ArtworkDetails from './components/ArtworkDetails';
import VirtualTour from './components/VirtualTour';
import AuthFlow from './components/AuthFlow';
import AuctionHouse from './components/AuctionHouse';
import UserProfile from './components/UserProfile';
import {
  ArtistDashboard,
  CuratorDashboard,
  AdminDashboard,
  VisitorDashboard,
} from './components/Dashboards';
import { mockBackend } from './services/mockBackend';
import { INITIAL_EXHIBITIONS } from './constants';
import { getGalleryGuideResponse } from './services/geminiService';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Greetings. I am the ArtForge AI Guide. How may I assist your exploration of our sovereign collections today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await getGalleryGuideResponse(userMsg, []);
    setMessages((prev) => [
      ...prev,
      { role: 'ai', text: response || "I'm sorry, I couldn't process that." },
    ]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      {isOpen ? (
        <div className="glass w-80 h-[500px] rounded-3xl overflow-hidden flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-fadeIn border border-white/10">
          <div className="bg-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                Gallery Guide
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black/40 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none bg-black/40"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-medium leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-amber-500 text-black rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none border border-white/10 backdrop-blur-md'}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-1 items-center px-4">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            )}
          </div>
          <form onSubmit={handleSend} className="p-4 bg-black/60 border-t border-white/10">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message the Guide..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white outline-none focus:border-amber-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 text-amber-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-black p-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-105 hover:-translate-y-1 transition-all duration-500 flex items-center gap-3 group"
        >
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ask the Guide</span>
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockBackend.getCurrentUser());
  const [activeView, setActiveView] = useState<
    'gallery' | 'exhibitions' | 'auctions' | 'dashboard' | 'sold' | 'timeline' | 'profile'
  >('gallery');
  const [artworks, setArtworks] = useState<Artwork[]>(() => mockBackend.getArtworks());
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // Initial load already handled by lazy state initializer
  }, []);

  const refreshData = () => {
    setArtworks(mockBackend.getArtworks());
  };

  const handleLogout = () => {
    mockBackend.logout();
    setCurrentUser(null);
    setActiveView('gallery');
  };

  const handleArtworkAction = (art: Artwork) => {
    if (!currentUser) {
      alert('Please sign in to interact with the gallery.');
      return;
    }

    if (art.isAuction) {
      setActiveView('auctions');
      setSelectedArtwork(null);
    } else {
      const success = mockBackend.purchaseArtwork(art.id, currentUser);
      if (success) {
        alert(`Congratulations! You now own "${art.title}".`);
        refreshData();
        setCurrentUser(mockBackend.getCurrentUser());
        setSelectedArtwork(null);
      } else {
        alert('Insufficient funds or artwork no longer available.');
      }
    }
  };

  const filteredArtworks = artworks.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;

    if (activeView === 'sold') return matchesSearch && matchesCategory && !a.isListed;
    return matchesSearch && matchesCategory && a.isListed;
  });

  const categories = ['All', ...Array.from(new Set(artworks.map((a) => a.category)))];

  const renderContent = () => {
    if (activeView === 'dashboard') {
      if (!currentUser) return null;
      switch (currentUser.role) {
        case UserRole.ARTIST:
          return <ArtistDashboard artworks={artworks} />;
        case UserRole.CURATOR:
          return <CuratorDashboard />;
        case UserRole.ADMIN:
          return <AdminDashboard />;
        default:
          return <VisitorDashboard />;
      }
    }

    if (activeView === 'profile') {
      if (!currentUser) return null;
      return <UserProfile user={currentUser} artworks={artworks} onUpdateUser={setCurrentUser} />;
    }

    if (activeView === 'auctions') {
      return (
        <AuctionHouse
          user={currentUser!}
          artworks={artworks}
          onBidUpdate={refreshData}
          onSelectArtwork={setSelectedArtwork}
          onBackToGallery={() => setActiveView('gallery')}
        />
      );
    }

    if (activeView === 'exhibitions') {
      return (
        <div className="space-y-16 animate-fadeIn py-12 px-4">
          <header className="max-w-4xl">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
              Current Narratives
            </span>
            <h2 className="text-5xl font-serif font-bold text-white mb-6 italic">
              Curated Exhibitions
            </h2>
            <p className="text-zinc-500 text-sm font-light leading-relaxed max-w-2xl">
              Discover thematic landscapes and conceptual explorations curated by our global network
              of art historians and visionaries.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {INITIAL_EXHIBITIONS.map((ex) => (
              <div key={ex.id} className="group cursor-pointer">
                <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden glass shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/5 transition-all duration-700 hover:border-amber-500/30">
                  <img
                    src={ex.bannerUrl}
                    className="w-full h-full object-cover grayscale transition-all duration-[3s] group-hover:scale-110 group-hover:grayscale-0"
                    alt={ex.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-12 left-12 right-12">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                      <span className="text-white text-[9px] font-black uppercase tracking-[0.4em]">
                        {ex.status} EXHIBITION
                      </span>
                    </div>
                    <h3 className="text-4xl font-serif text-white mb-6 font-bold italic">
                      {ex.title}
                    </h3>
                    <button className="bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black hover:bg-amber-500 transition-all shadow-xl uppercase tracking-widest">
                      Enter Narrative
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeView === 'timeline') {
      return (
        <div className="animate-fadeIn py-12 px-4 max-w-4xl mx-auto">
          <header className="text-center mb-20">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
              Platform Ledger
            </span>
            <h2 className="text-5xl font-serif font-bold text-white mb-6 italic">Event Timeline</h2>
            <p className="text-zinc-500 text-sm font-light">
              Real-time chronicle of acquisitions, bid placements, and gallery expansions.
            </p>
          </header>

          <div className="space-y-12 relative">
            <div className="absolute left-[15px] top-0 bottom-0 w-[1px] bg-zinc-800"></div>
            {[
              {
                type: 'Acquisition',
                user: 'Julian Reed',
                item: 'Echoes of Eternity',
                price: '$4,500',
                time: '2 hours ago',
              },
              {
                type: 'New Bid',
                user: 'Sora Kim',
                item: 'Neon Renaissance',
                price: '$7,500',
                time: '4 hours ago',
              },
              {
                type: 'Exhibition Launch',
                user: 'Admin',
                item: 'Digital Horizons',
                price: 'Active',
                time: '1 day ago',
              },
              {
                type: 'Asset Listed',
                user: 'Elena Vance',
                item: 'Kinetic Solitude',
                price: '$5,600',
                time: '2 days ago',
              },
            ].map((event, i) => (
              <div key={i} className="flex gap-10 items-start relative pl-12 group">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center z-10 group-hover:border-amber-500 transition-colors">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                </div>
                <div className="flex-1 glass p-6 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                      {event.type}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                      {event.time}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">
                    {event.user} <span className="font-normal text-zinc-400">interacted with</span>{' '}
                    {event.item}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Value: <span className="text-white font-bold">{event.price}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-32 animate-fadeIn">
        <section className="relative h-[65vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden rounded-[3.5rem] glass shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=2500"
              className="w-full h-full object-cover"
              alt="Hero"
            />
          </div>
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-amber-500/50"></div>
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.6em]">
                Premium Art Sanctuary
              </span>
              <div className="h-[1px] w-12 bg-amber-500/50"></div>
            </div>
            <h2 className="text-8xl md:text-9xl font-serif mb-8 text-white leading-none font-bold italic drop-shadow-2xl">
              Art<span className="text-amber-500">Forge</span>
            </h2>
            <p className="text-xl text-zinc-300 mb-12 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
              Transcending the physical. Preserving the eternal. The world's most evocative digital
              holding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setIsTourActive(true)}
                className="bg-white text-black px-12 py-4 rounded-xl font-black text-[11px] hover:bg-amber-500 transition-all flex items-center gap-4 shadow-2xl uppercase tracking-[0.2em]"
              >
                Begin Immersion
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-20">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${activeCategory === cat ? 'bg-amber-500 border-amber-500 text-black shadow-[0_10px_30px_rgba(245,158,11,0.3)]' : 'bg-transparent border-white/10 text-zinc-500 hover:text-white hover:border-white/20'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 px-2">
            <div>
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
                Archive Directory
              </span>
              <h3 className="text-5xl font-serif text-white italic font-bold">The Portfolio</h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              <span>Showing</span>
              <span className="text-white bg-white/5 px-3 py-1 rounded-lg">
                {filteredArtworks.length}
              </span>
              <span>Available Assets</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="group cursor-pointer artwork-card"
                onClick={() => setSelectedArtwork(art)}
              >
                <div className="relative overflow-hidden aspect-[4/5] mb-8 rounded-[2rem] bg-zinc-950 border border-white/5 shadow-2xl ring-1 ring-white/5">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white text-black px-10 py-3 rounded-xl uppercase text-[10px] font-black tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Examine
                    </div>
                  </div>
                  {art.isAuction && (
                    <div className="absolute top-6 right-6">
                      <div className="bg-red-500 px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        Live
                      </div>
                    </div>
                  )}
                  {!art.isListed && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-[12px] font-black uppercase tracking-[0.4em] border-2 border-white/20 px-8 py-3 rounded-xl rotate-[-12deg]">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-2">
                  <h4 className="text-2xl font-serif font-bold text-white group-hover:text-amber-500 transition-colors leading-tight italic">
                    {art.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-3 mb-6">
                    <div className="w-4 h-[1px] bg-amber-500/40"></div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                      {art.artist}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-5 border-t border-white/5">
                    <p className="text-white font-serif font-bold text-xl">
                      ${art.price.toLocaleString()}
                    </p>
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">
                      {art.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {filteredArtworks.length === 0 && (
              <div className="col-span-full py-40 text-center opacity-40 italic font-serif text-3xl font-light">
                No matches found in the sovereign archive.
              </div>
            )}
          </div>
        </section>

        <section className="pb-32">
          <div className="glass p-20 rounded-[4rem] flex flex-col md:flex-row justify-between items-center gap-12 border border-white/5">
            <div className="max-w-xl">
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
                Exclusivity
              </span>
              <h4 className="text-4xl font-serif text-white mb-6 italic font-bold leading-tight">
                Join the inner circle of sovereign collectors
              </h4>
              <p className="text-zinc-500 font-light text-lg leading-relaxed">
                Early access to masterworks, curatorial reports, and invitations to private
                auctions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="email"
                placeholder="Identity Address"
                className="bg-black/60 border border-white/10 rounded-xl px-8 py-5 text-white outline-none focus:border-amber-500 w-full sm:w-80 text-xs font-bold"
              />
              <button className="bg-white text-black px-12 py-5 rounded-xl font-black text-[11px] hover:bg-amber-500 transition-all shadow-2xl uppercase tracking-widest">
                Connect
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {!currentUser && <AuthFlow onLogin={setCurrentUser} />}
      <Navbar
        user={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      <main className="pt-48 max-w-7xl mx-auto px-6 pb-20">{renderContent()}</main>
      {selectedArtwork && (
        <ArtworkDetails
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onAction={handleArtworkAction}
          user={currentUser}
        />
      )}
      {isTourActive && <VirtualTour artworks={artworks} onClose={() => setIsTourActive(false)} />}
      <AiAssistant />
    </div>
  );
};

export default App;
