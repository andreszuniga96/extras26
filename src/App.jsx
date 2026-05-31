import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Search, RefreshCw, Minus, Check, Share2, CheckCircle2 } from 'lucide-react';

const PLAYERS = [
  { id: 'eng-bellingham', name: 'Bellingham, Jude', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'ecu-caicedo', name: 'Caicedo, Moisés', country: 'Ecuador', flag: '🇪🇨' },
  { id: 'can-davies', name: 'Davies, Alphonso', country: 'Canadá', flag: '🇨🇦' },
  { id: 'col-diaz', name: 'Díaz, Luis', country: 'Colombia', flag: '🇨🇴' },
  { id: 'bel-doku', name: 'Doku, Jérémy', country: 'Bélgica', flag: '🇧🇪' },
  { id: 'ned-gakpo', name: 'Gakpo, Cody', country: 'Países Bajos', flag: '🇳🇱' },
  { id: 'nor-haaland', name: 'Haaland, Erling', country: 'Noruega', flag: '🇳🇴' },
  { id: 'mar-hakimi', name: 'Hakimi, Achraf', country: 'Marruecos', flag: '🇲🇦' },
  { id: 'mex-jimenez', name: 'Jiménez, Raúl', country: 'México', flag: '🇲🇽' },
  { id: 'fra-mbappe', name: 'Mbappé, Kylian', country: 'Francia', flag: '🇫🇷' },
  { id: 'arg-messi', name: 'Messi, Lionel', country: 'Argentina', flag: '🇦🇷' },
  { id: 'cro-modric', name: 'Modrić, Luka', country: 'Croacia', flag: '🇭🇷' },
  { id: 'usa-pulisic', name: 'Pulisic, Christian', country: 'Estados Unidos', flag: '🇺🇸' },
  { id: 'por-ronaldo', name: 'Ronaldo, Cristiano', country: 'Portugal', flag: '🇵🇹' },
  { id: 'egy-salah', name: 'Salah, Mohamed', country: 'Egipto', flag: '🇪🇬' },
  { id: 'kor-son', name: 'Son, Heungmin', country: 'Corea del Sur', flag: '🇰🇷' },
  { id: 'uru-valverde', name: 'Valverde, Federico', country: 'Uruguay', flag: '🇺🇾' },
  { id: 'bra-vini', name: 'Vinícius Júnior', country: 'Brasil', flag: '🇧🇷' },
  { id: 'ger-wirtz', name: 'Wirtz, Florian', country: 'Alemania', flag: '🇩🇪' },
  { id: 'esp-yamal', name: 'Yamal, Lamine', country: 'España', flag: '🇪🇸' }
];

const VARIANTS = [
  { id: 'base', name: 'Base', bg: 'bg-gradient-to-br from-red-800 to-red-950', border: 'border-red-500', text: 'text-red-100', emptyText: 'text-red-500/50', emptyBorder: 'border-red-900/50', iconColor: 'text-red-500' },
  { id: 'bronze', name: 'Bronce', bg: 'bg-gradient-to-br from-[#CD7F32] via-[#8B4513] to-[#4A2511]', border: 'border-[#F4A460]', text: 'text-orange-50', emptyText: 'text-[#CD7F32]/50', emptyBorder: 'border-[#8B4513]/50', iconColor: 'text-[#CD7F32]' },
  { id: 'silver', name: 'Plata', bg: 'bg-gradient-to-br from-[#E2E8F0] via-[#94A3B8] to-[#475569]', border: 'border-white', text: 'text-slate-950', emptyText: 'text-slate-500/50', emptyBorder: 'border-slate-700/50', iconColor: 'text-slate-400' },
  { id: 'gold', name: 'Oro', bg: 'bg-gradient-to-br from-[#FEF08A] via-[#EAB308] to-[#A16207]', border: 'border-[#FEF9C3]', text: 'text-yellow-950', emptyText: 'text-yellow-600/50', emptyBorder: 'border-yellow-900/50', iconColor: 'text-yellow-500' }
];

const STORAGE_KEY = 'panini-26-extras-inventory';

export default function App() {
  const [inventory, setInventory] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); 
  const [isLoaded, setIsLoaded] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedInventory = localStorage.getItem(STORAGE_KEY);
    if (savedInventory) {
      try { setInventory(JSON.parse(savedInventory)); } catch (e) { console.error("Error parsing"); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory, isLoaded]);

  const updateCount = (playerId, variantId, delta) => {
    const key = `${playerId}_${variantId}`;
    setInventory(prev => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      const newInventory = { ...prev };
      if (next === 0) delete newInventory[key];
      else newInventory[key] = next;
      return newInventory;
    });
  };

  const stats = useMemo(() => {
    let unique = 0;
    let duplicates = 0;
    const variantsCount = { base: 0, bronze: 0, silver: 0, gold: 0 };

    Object.entries(inventory).forEach(([key, count]) => {
      if (count > 0) {
        unique += 1;
        duplicates += (count - 1);
        const variantId = key.split('_')[1];
        if (variantsCount[variantId] !== undefined) variantsCount[variantId] += 1;
      }
    });

    return {
      unique,
      totalPossible: 80,
      duplicates,
      percentage: ((unique / 80) * 100).toFixed(1),
      variantsCount
    };
  }, [inventory]);

  const handleShare = async () => {
    let text = "🏆 *Mis Extra Stickers Panini 2026* 🏆\n\n";
    text += `📊 Progreso: ${stats.unique}/80 (${stats.percentage}%)\n`;
    text += `🟥 Base: ${stats.variantsCount.base}/20 | 🟫 Bronce: ${stats.variantsCount.bronze}/20\n`;
    text += `⬜ Plata: ${stats.variantsCount.silver}/20 | 🟨 Oro: ${stats.variantsCount.gold}/20\n\n`;

    const repes = Object.entries(inventory).filter(([_, count]) => count > 1);
    
    if (repes.length > 0) {
      text += "🔁 *TENGO REPETIDAS:*\n";
      repes.forEach(([key, count]) => {
        const [pId, vId] = key.split('_');
        const p = PLAYERS.find(p => p.id === pId);
        const v = VARIANTS.find(v => v.id === vId);
        text += `- ${p.name} (${v.name}) x${count - 1}\n`;
      });
      text += "\n¿Alguien cambia? 👀";
    } else {
      text += "🔁 Sin repetidas por el momento.";
    }

    try {
      await navigator.clipboard.writeText(text);
      setToast("¡Lista copiada! Lista para pegar en WhatsApp.");
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      setToast("Error al copiar. Intenta de nuevo.");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filteredPlayers = useMemo(() => {
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const normalizedSearch = normalize(searchTerm);

    return PLAYERS.map(p => {
      const matchesSearch = normalize(p.name).includes(normalizedSearch) || normalize(p.country).includes(normalizedSearch);
      if (!matchesSearch) return null;

      let visibleVariants = [];
      if (filterTab === 'all') visibleVariants = VARIANTS;
      else if (filterTab === 'missing') visibleVariants = VARIANTS.filter(v => (inventory[`${p.id}_${v.id}`] || 0) === 0);
      else if (filterTab === 'duplicates') visibleVariants = VARIANTS.filter(v => (inventory[`${p.id}_${v.id}`] || 0) > 1);

      if (visibleVariants.length === 0) return null;
      return { ...p, visibleVariants };
    }).filter(Boolean);
  }, [searchTerm, inventory, filterTab]);

  const confirmReset = () => { setInventory({}); setShowResetModal(false); };

  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center"><RefreshCw className="animate-spin text-yellow-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-yellow-500 selection:text-yellow-950 pb-24 relative">
      
      {/* HEADER STICKY: Búsqueda + Pestañas pegadas arriba */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-900 shadow-2xl pt-3 pb-3 px-3 flex flex-col gap-3">
        <div className="max-w-7xl mx-auto w-full flex gap-2">
          <div className="relative w-full group flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-500" />
            </div>
            <input 
              type="text" 
              placeholder="Ej: Messi, vi, oro..." 
              className="w-full bg-zinc-900 border border-zinc-800 text-[15px] font-medium rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition-all text-white placeholder:text-zinc-600 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleShare}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 w-12 rounded-xl flex items-center justify-center active:scale-90 transition-transform shadow-md"
            aria-label="Compartir"
          >
            <Share2 className="w-5 h-5 text-emerald-500" />
          </button>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="max-w-7xl mx-auto w-full flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'missing', label: 'Faltantes' },
            { id: 'duplicates', label: 'Repetidas' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                filterTab === tab.id ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 active:scale-95'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-4">
        
        {/* CARRUSEL DE ESTADÍSTICAS DETALLADAS */}
        <div className="px-3 mb-5 overflow-hidden">
          <style>{`.hide-scroll::-webkit-scrollbar { display: none; } .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          <div className="flex overflow-x-auto hide-scroll gap-3 snap-x snap-mandatory pb-2">
            
            {/* Global */}
            <div className="snap-start min-w-[150px] bg-zinc-900 rounded-2xl p-3 border border-zinc-800 flex flex-col justify-center shadow-lg">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total</span>
                <span className="text-sm font-black text-yellow-500">{stats.unique}/80</span>
              </div>
              <div className="w-full bg-black rounded-full h-2 p-0.5 border border-zinc-800">
                <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${stats.percentage}%` }}/>
              </div>
            </div>

            {/* Tarjetas por Rareza */}
            {VARIANTS.map(variant => (
              <div key={variant.id} className="snap-start min-w-[100px] bg-zinc-900 rounded-2xl p-3 border border-zinc-800 flex flex-col justify-between shadow-lg">
                 <span className={`text-[10px] font-black uppercase tracking-wider ${variant.iconColor}`}>{variant.name}</span>
                 <div className="flex items-end justify-between mt-1">
                   <span className="text-xl font-black text-white leading-none">{stats.variantsCount[variant.id]}</span>
                   <span className="text-xs font-bold text-zinc-600 mb-0.5">/20</span>
                 </div>
              </div>
            ))}
            
            {/* Repetidas Total */}
            <div className="snap-start min-w-[100px] bg-zinc-900 rounded-2xl p-3 border border-zinc-800 flex flex-col items-center justify-center shadow-lg">
              <span className="text-xl font-black text-emerald-500 leading-none">{stats.duplicates}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mt-1">Repes</span>
            </div>
          </div>
        </div>

        {/* LISTA DE JUGADORES */}
        <div className="px-3 flex flex-col gap-3">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <PlayerCard key={player.id} player={player} inventory={inventory} updateCount={updateCount} filterTab={filterTab} />
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-zinc-900/50 rounded-2xl border border-zinc-800/50 mx-1">
              <Trophy className="w-10 h-10 mb-2 opacity-20 text-yellow-500" />
              <p className="text-sm font-semibold text-zinc-500">Ningún resultado para tu búsqueda.</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center pb-8">
          <button onClick={() => setShowResetModal(true)} className="text-[11px] text-zinc-600 font-bold hover:text-red-500 uppercase tracking-widest px-4 py-2">
            Reiniciar Todo
          </button>
        </div>
      </main>

      {/* TOAST DE NOTIFICACIÓN (Para cuando copias a WhatsApp) */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold border border-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            {toast}
          </div>
        </div>
      )}

      {/* Modal de Reinicio */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white text-center mb-2">¿Borrar todo?</h3>
            <p className="text-sm text-zinc-400 text-center mb-6">Perderás el progreso de tus {stats.unique} cromos.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetModal(false)} className="flex-1 py-3 bg-zinc-800 text-white font-bold rounded-xl active:scale-95">Cancelar</button>
              <button onClick={confirmReset} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl active:scale-95">Borrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ player, inventory, updateCount, filterTab }) {
  const variantsOwned = VARIANTS.filter(v => (inventory[`${player.id}_${v.id}`] || 0) > 0).length;
  const isFullyComplete = variantsOwned === 4;
  const variantsToRender = player.visibleVariants;

  const gridColsClass = 
    variantsToRender.length === 1 ? 'grid-cols-1' :
    variantsToRender.length === 2 ? 'grid-cols-2' :
    variantsToRender.length === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <div className={`relative flex flex-col rounded-2xl overflow-hidden transition-all p-3 ${isFullyComplete && filterTab === 'all' ? 'border border-yellow-600/30 bg-yellow-900/10' : 'border border-zinc-800/80 bg-[#0a0a0a]'}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <span className="text-[28px] drop-shadow-md leading-none">{player.flag}</span>
          <h3 className="font-bold text-base text-white tracking-tight leading-none mb-0.5">{player.name}</h3>
        </div>
        
        {filterTab === 'all' && (
          <div>
             {isFullyComplete ? (
               <div className="text-yellow-500 bg-yellow-500/10 p-1.5 rounded-full"><Check className="w-4 h-4 stroke-[4]" /></div>
             ) : variantsOwned > 0 ? (
               <div className="text-zinc-500 text-[11px] font-black px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800">{variantsOwned}/4</div>
             ) : null}
          </div>
        )}
      </div>

      <div className={`grid gap-2 ${gridColsClass}`}>
        {variantsToRender.map(variant => {
          const key = `${player.id}_${variant.id}`;
          const count = inventory[key] || 0;
          const hasCard = count > 0;

          return (
            <div key={variant.id} className="relative group flex-1">
              <button 
                onClick={() => updateCount(player.id, variant.id, 1)}
                className={`w-full h-[60px] flex flex-col items-center justify-center rounded-xl border transition-all active:scale-[0.92]
                  ${hasCard ? `${variant.bg} ${variant.border} shadow-lg shadow-black` : `bg-transparent border-dashed border-2 ${variant.emptyBorder}`}
                `}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${hasCard ? variant.text : variant.emptyText}`}>
                  {variant.name}
                </span>
                
                {filterTab !== 'missing' && (
                  <span className={`text-xl font-black leading-none ${hasCard ? variant.text : 'hidden'}`}>
                    {count}
                  </span>
                )}
                {filterTab === 'missing' && (
                  <span className="text-xs font-black text-zinc-600 uppercase tracking-widest mt-1">+ Toca</span>
                )}
              </button>

              {hasCard && filterTab !== 'missing' && (
                <button
                  onClick={(e) => { e.stopPropagation(); updateCount(player.id, variant.id, -1); }}
                  className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-zinc-900 border border-zinc-600 text-zinc-300 rounded-full flex items-center justify-center shadow-lg active:scale-75 z-10"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}