import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Star, Search, RefreshCw, Minus, AlertCircle, ShieldCheck, Sparkles, X, Check } from 'lucide-react';

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

// Colores reajustados para máximo contraste en pantallas OLED
const VARIANTS = [
  { 
    id: 'base', 
    name: 'Base', 
    bg: 'bg-gradient-to-br from-red-800 to-red-950',
    border: 'border-red-500',
    text: 'text-red-100',
    emptyText: 'text-red-500/50',
    emptyBorder: 'border-red-900/50',
  },
  { 
    id: 'bronze', 
    name: 'Bronce', 
    bg: 'bg-gradient-to-br from-[#CD7F32] via-[#8B4513] to-[#4A2511]',
    border: 'border-[#F4A460]',
    text: 'text-orange-50',
    emptyText: 'text-[#CD7F32]/50',
    emptyBorder: 'border-[#8B4513]/50',
  },
  { 
    id: 'silver', 
    name: 'Plata', 
    bg: 'bg-gradient-to-br from-[#E2E8F0] via-[#94A3B8] to-[#475569]',
    border: 'border-white',
    text: 'text-slate-950', // Letra oscura para máximo contraste
    emptyText: 'text-slate-500/50',
    emptyBorder: 'border-slate-700/50',
  },
  { 
    id: 'gold', 
    name: 'Oro', 
    bg: 'bg-gradient-to-br from-[#FEF08A] via-[#EAB308] to-[#A16207]',
    border: 'border-[#FEF9C3]',
    text: 'text-yellow-950', // Letra oscura para máximo contraste
    emptyText: 'text-yellow-600/50',
    emptyBorder: 'border-yellow-900/50',
  }
];

const STORAGE_KEY = 'panini-26-extras-inventory';

export default function App() {
  const [inventory, setInventory] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); 
  const [isLoaded, setIsLoaded] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const savedInventory = localStorage.getItem(STORAGE_KEY);
    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (e) {
        console.error("Error parsing inventory");
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

  const stats = useMemo(() => {
    let unique = 0;
    let duplicates = 0;
    Object.values(inventory).forEach(count => {
      if (count > 0) {
        unique += 1;
        duplicates += (count - 1);
      }
    });
    return {
      unique,
      totalPossible: 80,
      duplicates,
      percentage: ((unique / 80) * 100).toFixed(1)
    };
  }, [inventory]);

  const filteredPlayers = useMemo(() => {
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const normalizedSearch = normalize(searchTerm);

    // Mapeamos los jugadores y filtramos sus variantes basándonos en la pestaña actual
    return PLAYERS.map(p => {
      const matchesSearch = normalize(p.name).includes(normalizedSearch) || normalize(p.country).includes(normalizedSearch);
      if (!matchesSearch) return null;

      let visibleVariants = [];

      if (filterTab === 'all') {
        visibleVariants = VARIANTS;
      } else if (filterTab === 'missing') {
        // En 'Faltantes', SOLO mostramos las que tienen cantidad = 0 o no existen
        visibleVariants = VARIANTS.filter(v => (inventory[`${p.id}_${v.id}`] || 0) === 0);
      } else if (filterTab === 'duplicates') {
        // En 'Repetidas', SOLO mostramos las que tienen cantidad > 1
        visibleVariants = VARIANTS.filter(v => (inventory[`${p.id}_${v.id}`] || 0) > 1);
      }

      // Si después del filtro, el jugador no tiene variantes visibles, no lo renderizamos
      if (visibleVariants.length === 0) return null;

      return { ...p, visibleVariants };
    }).filter(Boolean); // Eliminamos los nulos
  }, [searchTerm, inventory, filterTab]);

  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center"><RefreshCw className="animate-spin text-yellow-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-yellow-500 selection:text-yellow-950 pb-24 relative">
      
      {/* HEADER ULTRA COMPACTO */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex flex-col gap-2">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-zinc-500" />
              </div>
              <input 
                type="text" 
                placeholder="Nombre, letra o país..." 
                className="w-full bg-zinc-900 border border-zinc-800 text-[15px] font-medium rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition-all text-white placeholder:text-zinc-600 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4">
        
        {/* PROGRESS BAR COMPACTO */}
        <div className="px-3 mb-4 flex gap-3">
          <div className="flex-1 bg-zinc-900 rounded-2xl p-3 border border-zinc-800 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Avance</span>
              <span className="text-sm font-black text-yellow-500">{stats.unique}/80</span>
            </div>
            <div className="w-full bg-black rounded-full h-2 p-0.5 border border-zinc-800">
              <div 
                className="bg-yellow-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
          
          <div className="w-24 bg-zinc-900 rounded-2xl p-3 border border-zinc-800 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-emerald-500 leading-none">{stats.duplicates}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mt-1">Repes</span>
          </div>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="px-3 mb-5">
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'missing', label: 'Faltantes' },
              { id: 'duplicates', label: 'Repetidas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${
                  filterTab === tab.id 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300 active:scale-95'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE JUGADORES OPTIMIZADA */}
        <div className="px-3 flex flex-col gap-3">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                inventory={inventory} 
                updateCount={updateCount} 
                filterTab={filterTab}
              />
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-zinc-900/50 rounded-2xl border border-zinc-800/50 mx-1">
              <Trophy className="w-10 h-10 mb-2 opacity-20 text-yellow-500" />
              <p className="text-sm font-semibold text-zinc-500">
                {filterTab === 'missing' ? '¡Increíble! No te falta ninguna aquí.' : 
                 filterTab === 'duplicates' ? 'No tienes repetidas de esta búsqueda.' : 
                 'Ningún jugador coincide.'}
              </p>
            </div>
          )}
        </div>

        {/* Botón Reset */}
        <div className="mt-10 text-center pb-8">
          <button 
            onClick={() => setShowResetModal(true)}
            className="text-[11px] text-zinc-600 font-bold hover:text-red-500 uppercase tracking-widest px-4 py-2"
          >
            Reiniciar Inventario
          </button>
        </div>
      </main>

      {/* Modal de Reinicio (Igual) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white text-center mb-2">¿Borrar todo?</h3>
            <p className="text-sm text-zinc-400 text-center mb-6">
              Perderás el progreso de tus {stats.unique} cromos. No se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3 bg-zinc-800 text-white font-bold rounded-xl active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmReset}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl active:scale-95 transition-transform"
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

function PlayerCard({ player, inventory, updateCount, filterTab }) {
  const variantsOwned = VARIANTS.filter(v => (inventory[`${player.id}_${v.id}`] || 0) > 0).length;
  const isFullyComplete = variantsOwned === 4;
  const variantsToRender = player.visibleVariants;

  // Calculamos dinámicamente las columnas para optimizar espacio si faltan/sobran pocas
  const gridColsClass = 
    variantsToRender.length === 1 ? 'grid-cols-1' :
    variantsToRender.length === 2 ? 'grid-cols-2' :
    variantsToRender.length === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <div className={`relative flex flex-col rounded-2xl overflow-hidden transition-all p-3
      ${isFullyComplete && filterTab === 'all' ? 'border border-yellow-600/30 bg-yellow-900/10' : 'border border-zinc-800/80 bg-[#0a0a0a]'}
    `}>
      {/* Cabecera Ultra Compacta */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl drop-shadow-md leading-none">{player.flag}</span>
          <div className="flex flex-col">
            <h3 className="font-bold text-[15px] text-white tracking-tight leading-none mb-0.5">
              {player.name}
            </h3>
          </div>
        </div>
        
        {/* Status Badge - Solo en vista "Todos" */}
        {filterTab === 'all' && (
          <div>
             {isFullyComplete ? (
               <div className="text-yellow-500 bg-yellow-500/10 p-1 rounded-full">
                 <Check className="w-3.5 h-3.5 stroke-[4]" />
               </div>
             ) : variantsOwned > 0 ? (
               <div className="text-zinc-500 text-[10px] font-black px-1.5 py-0.5 bg-zinc-900 rounded-md">
                 {variantsOwned}/4
               </div>
             ) : null}
          </div>
        )}
      </div>

      {/* Grid Dinámico: Se adapta al número de cromos mostrados */}
      <div className={`grid gap-2 ${gridColsClass}`}>
        {variantsToRender.map(variant => {
          const key = `${player.id}_${variant.id}`;
          const count = inventory[key] || 0;
          const hasCard = count > 0;

          return (
            <div key={variant.id} className="relative group flex-1">
              {/* Botón Principal */}
              <button 
                onClick={() => updateCount(player.id, variant.id, 1)}
                className={`w-full h-14 flex flex-col items-center justify-center rounded-xl border transition-transform active:scale-[0.92]
                  ${hasCard 
                    ? `${variant.bg} ${variant.border} shadow-lg shadow-black` 
                    : `bg-transparent border-dashed border-2 ${variant.emptyBorder}`}
                `}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest mb-0.5
                  ${hasCard ? variant.text : variant.emptyText}
                `}>
                  {variant.name}
                </span>
                
                {/* En "Faltantes" el número siempre es 0, no lo mostramos para limpiar la vista. En "Repetidas" lo resaltamos */}
                {filterTab !== 'missing' && (
                  <span className={`text-lg font-black leading-none
                    ${hasCard ? variant.text : 'hidden'}
                  `}>
                    {count}
                  </span>
                )}
                {filterTab === 'missing' && (
                  <span className="text-xs font-black text-zinc-600 uppercase tracking-widest mt-1">+ Toca</span>
                )}
              </button>

              {/* Botón para Restar (Aparece en Todos y Repetidas si tienes al menos 1) */}
              {hasCard && filterTab !== 'missing' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCount(player.id, variant.id, -1);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-full flex items-center justify-center shadow-md active:scale-75 z-10"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}