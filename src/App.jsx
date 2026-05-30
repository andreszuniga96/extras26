import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Star, Search, RefreshCw, Minus, Plus, AlertCircle, ShieldCheck, Sparkles, X, Check } from 'lucide-react';

const PLAYERS = [
  { id: 'arg-messi', name: 'Lionel Messi', country: 'Argentina', flag: '🇦🇷' },
  { id: 'bel-doku', name: 'Jérémy Doku', country: 'Bélgica', flag: '🇧🇪' },
  { id: 'bra-vini', name: 'Vinícius Júnior', country: 'Brasil', flag: '🇧🇷' },
  { id: 'can-davies', name: 'Alphonso Davies', country: 'Canadá', flag: '🇨🇦' },
  { id: 'col-diaz', name: 'Luis Díaz', country: 'Colombia', flag: '🇨🇴' },
  { id: 'cro-modric', name: 'Luka Modrić', country: 'Croacia', flag: '🇭🇷' },
  { id: 'ecu-caicedo', name: 'Moisés Caicedo', country: 'Ecuador', flag: '🇪🇨' },
  { id: 'egy-salah', name: 'Mohamed Salah', country: 'Egipto', flag: '🇪🇬' },
  { id: 'eng-bellingham', name: 'Jude Bellingham', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'fra-mbappe', name: 'Kylian Mbappé', country: 'Francia', flag: '🇫🇷' },
  { id: 'ger-wirtz', name: 'Florian Wirtz', country: 'Alemania', flag: '🇩🇪' },
  { id: 'kor-son', name: 'Heungmin Son', country: 'Corea del Sur', flag: '🇰🇷' },
  { id: 'mex-jimenez', name: 'Raúl Jiménez', country: 'México', flag: '🇲🇽' },
  { id: 'mar-hakimi', name: 'Achraf Hakimi', country: 'Marruecos', flag: '🇲🇦' },
  { id: 'ned-gakpo', name: 'Cody Gakpo', country: 'Países Bajos', flag: '🇳🇱' },
  { id: 'nor-haaland', name: 'Erling Haaland', country: 'Noruega', flag: '🇳🇴' },
  { id: 'por-ronaldo', name: 'Cristiano Ronaldo', country: 'Portugal', flag: '🇵🇹' },
  { id: 'esp-yamal', name: 'Lamine Yamal', country: 'España', flag: '🇪🇸' },
  { id: 'uru-valverde', name: 'Federico Valverde', country: 'Uruguay', flag: '🇺🇾' },
  { id: 'usa-pulisic', name: 'Christian Pulisic', country: 'Estados Unidos', flag: '🇺🇸' }
];

const VARIANTS = [
  { 
    id: 'base', 
    name: 'Base', 
    bg: 'bg-gradient-to-br from-rose-900 to-rose-950',
    border: 'border-rose-500/40',
    text: 'text-rose-100',
    glow: 'hover:shadow-[0_0_15px_rgba(225,29,72,0.3)]',
    controls: 'bg-rose-950/80 text-rose-200 border-rose-500/30'
  },
  { 
    id: 'bronze', 
    name: 'Bronce', 
    bg: 'bg-gradient-to-br from-[#804a00] via-[#9c5a00] to-[#593400]',
    border: 'border-[#cd7f32]/50',
    text: 'text-orange-50',
    glow: 'hover:shadow-[0_0_15px_rgba(205,127,50,0.4)]',
    controls: 'bg-[#4a2b00]/80 text-[#ffd7a0] border-[#cd7f32]/30'
  },
  { 
    id: 'silver', 
    name: 'Plata', 
    bg: 'bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500',
    border: 'border-slate-100',
    text: 'text-slate-900',
    glow: 'hover:shadow-[0_0_20px_rgba(203,213,225,0.6)]',
    controls: 'bg-slate-800/80 text-slate-100 border-slate-400/30'
  },
  { 
    id: 'gold', 
    name: 'Oro', 
    bg: 'bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600',
    border: 'border-yellow-200',
    text: 'text-yellow-950',
    glow: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.7)]',
    controls: 'bg-yellow-900/90 text-yellow-100 border-yellow-400/50'
  }
];

const STORAGE_KEY = 'panini-26-extras-inventory';

export default function App() {
  const [inventory, setInventory] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'missing', 'duplicates'
  const [isLoaded, setIsLoaded] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const savedInventory = localStorage.getItem(STORAGE_KEY);
    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (e) {
        console.error("Error parsing inventory from storage");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    }
  }, [inventory, isLoaded]);

  const updateCount = (playerId, variantId, delta) => {
    const key = `${playerId}_${variantId}`;
    setInventory(prev => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      
      const newInventory = { ...prev };
      if (next === 0) {
        delete newInventory[key];
      } else {
        newInventory[key] = next;
      }
      return newInventory;
    });
  };

  const confirmReset = () => {
    setInventory({});
    setShowResetModal(false);
  };

  const stats = useMemo(() => {
    let uniqueStickers = 0;
    let duplicates = 0;
    const keys = Object.keys(inventory);
    
    keys.forEach(key => {
      const count = inventory[key];
      if (count > 0) {
        uniqueStickers += 1;
        duplicates += (count - 1);
      }
    });

    return {
      unique: uniqueStickers,
      totalPossible: 80,
      duplicates,
      percentage: ((uniqueStickers / 80) * 100).toFixed(1)
    };
  }, [inventory]);

  const filteredPlayers = useMemo(() => {
    // Función para quitar tildes y normalizar a minúsculas
    const normalize = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
    
    const normalizedSearch = normalize(searchTerm);

    return PLAYERS.filter(p => {
      const matchesSearch = normalize(p.name).includes(normalizedSearch) || normalize(p.country).includes(normalizedSearch);
      
      if (!matchesSearch) return false;

      // Lógica de pestañas para móvil
      if (filterTab === 'all') return true;
      
      if (filterTab === 'duplicates') {
        // ¿Tiene al menos una repetida?
        return VARIANTS.some(v => (inventory[`${p.id}_${v.id}`] || 0) > 1);
      }
      
      if (filterTab === 'missing') {
        // ¿Le falta al menos una variante?
        return VARIANTS.some(v => (inventory[`${p.id}_${v.id}`] || 0) === 0);
      }

      return true;
    });
  }, [searchTerm, inventory, filterTab]);

  if (!isLoaded) return <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center"><RefreshCw className="animate-spin text-yellow-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-black text-slate-200 font-sans selection:bg-yellow-500 selection:text-yellow-950 pb-24 relative">
      
      {/* HEADER - Glassmorphism effect */}
      <header className="sticky top-0 z-40 bg-[#0a0f1c]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 p-2 rounded-xl border border-yellow-200 shadow-xl">
                  <Star className="text-yellow-950 w-5 h-5 fill-current" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight leading-none">
                    Extras <span className="text-yellow-500">Pro</span>
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar jugador o país..." 
                className="w-full bg-white/5 border border-white/10 text-base rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 focus:ring-2 focus:ring-yellow-500/20 transition-all placeholder:text-slate-500 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6">
        
        {/* CARRUSEL DE ESTADÍSTICAS PARA MÓVIL (Scroll Horizontal) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Progress Card */}
          <div className="snap-center shrink-0 w-[85vw] sm:w-72 bg-white/[0.03] border border-white/10 rounded-3xl p-5 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-end mb-4">
              <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Progreso
              </p>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">{stats.percentage}%</span>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-3 p-0.5 border border-white/5 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-300 h-full rounded-full transition-all duration-1000 relative" 
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <div className="text-sm text-slate-500 text-right font-medium">
              <span className="text-white">{stats.unique}</span> / {stats.totalPossible} cromos
            </div>
          </div>

          {/* Duplicates Card */}
          <div className="snap-center shrink-0 w-[85vw] sm:w-72 bg-white/[0.03] border border-white/10 rounded-3xl p-5 backdrop-blur-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-semibold mb-1 uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-500" /> Para Cambiar
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-400 tracking-tighter">{stats.duplicates}</span>
                <span className="text-sm text-slate-500">Repetidas</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN RÁPIDA */}
        <div className="px-4 mb-6">
          <div className="flex bg-slate-800/40 p-1.5 rounded-2xl border border-white/5">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'missing', label: 'Faltantes' },
              { id: 'duplicates', label: 'Repetidas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filterTab === tab.id 
                    ? 'bg-slate-700/80 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 active:scale-95'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE JUGADORES (Formato Horizontal) */}
        <div className="px-4 flex flex-col gap-5">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                inventory={inventory} 
                updateCount={updateCount} 
              />
            ))
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-slate-500 bg-white/[0.02] rounded-3xl border border-white/5">
              <AlertCircle className="w-12 h-12 mb-3 opacity-50 text-yellow-500" />
              <p className="text-base font-medium text-slate-400">No hay resultados.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center pb-8">
          <button 
            onClick={() => setShowResetModal(true)}
            className="text-xs text-slate-500 font-semibold hover:text-rose-500 transition-colors uppercase tracking-widest px-4 py-2 active:scale-95"
          >
            Reiniciar Inventario
          </button>
        </div>
      </main>

      {/* Modal de Reinicio (Se mantiene igual) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">¿Borrar todo?</h3>
            <p className="text-slate-400 text-center mb-8">
              Estás a punto de reiniciar toda tu colección de Extras. Perderás el progreso de tus {stats.unique} cromos. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors active:scale-95"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmReset}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)] active:scale-95"
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ player, inventory, updateCount }) {
  // Lógica de progreso
  const variantsOwned = VARIANTS.filter(v => (inventory[`${player.id}_${v.id}`] || 0) > 0).length;
  const isFullyComplete = variantsOwned === 4;

  return (
    <div className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 p-3.5
      ${isFullyComplete ? 'border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] bg-gradient-to-b from-[#1a1c23] to-[#0a0f1c]' : 'border border-white/5 bg-slate-900/50'}
    `}>
      {/* Cabecera del Jugador Compacta */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl drop-shadow-md">{player.flag}</span>
          <div className="flex flex-col">
            <h3 className="font-black text-lg text-white tracking-tight leading-none mb-1">
              {player.name}
            </h3>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{player.country}</span>
          </div>
        </div>
        
        {/* Status Badge */}
        <div>
           {isFullyComplete ? (
             <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 p-1.5 rounded-full shadow-lg shadow-yellow-500/20">
               <Check className="w-4 h-4 stroke-[3]" />
             </div>
           ) : variantsOwned > 0 ? (
             <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-lg">
               {variantsOwned}/4
             </div>
           ) : null}
        </div>
      </div>

      {/* Grid de Variantes Ultra-Eficiente (4 Columnas) */}
      <div className="grid grid-cols-4 gap-2">
        {VARIANTS.map(variant => {
          const key = `${player.id}_${variant.id}`;
          const count = inventory[key] || 0;
          const hasCard = count > 0;

          return (
            <div key={variant.id} className="relative group">
              {/* Botón Principal - TOQUE PARA AÑADIR */}
              <button 
                onClick={() => updateCount(player.id, variant.id, 1)}
                className={`w-full h-16 flex flex-col items-center justify-center rounded-2xl border transition-all active:scale-90
                  ${hasCard 
                    ? `${variant.bg} ${variant.border} shadow-lg ring-1 ring-inset ring-white/10` 
                    : 'bg-black/20 border-white/5 border-dashed hover:bg-white/5'}
                `}
                aria-label={`Añadir ${variant.name}`}
              >
                <span className={`text-[9px] font-black uppercase tracking-widest mb-0.5
                  ${hasCard ? variant.text : 'text-slate-600'}
                `}>
                  {variant.name}
                </span>
                <span className={`text-xl font-black leading-none
                  ${hasCard ? 'text-white' : 'text-slate-700'}
                `}>
                  {count}
                </span>
              </button>

              {/* Botón para Restar (Solo aparece si ya tienes el cromo) */}
              {hasCard && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que se sume y reste a la vez
                    updateCount(player.id, variant.id, -1);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-slate-900 border border-slate-700 text-slate-300 rounded-full flex items-center justify-center shadow-xl active:scale-75 transition-transform z-10 hover:bg-rose-900 hover:text-white hover:border-rose-500"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
              )}
              
              {/* Indicador de Repetidas */}
              {count > 1 && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow-md z-10 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  +{count - 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}