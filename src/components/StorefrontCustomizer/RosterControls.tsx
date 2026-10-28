'use client';

import React, { useState } from 'react';
import { RosterElement, RosterPlayer } from '@/types/customizer';
import { Hash, Plus, Trash2, Users, CheckCircle2 } from 'lucide-react';

interface RosterControlsProps {
  selectedElement: RosterElement | null;
  productSizes: string[];
  onUpdateRoster: (updates: Partial<RosterElement>) => void;
  onAddRoster: (rosterData: {
    sampleName: string;
    sampleNumber: string;
    fontFamily: string;
    fill: string;
    rosterList: RosterPlayer[];
  }) => void;
}

export const RosterControls: React.FC<RosterControlsProps> = ({
  selectedElement,
  productSizes,
  onUpdateRoster,
  onAddRoster,
}) => {
  const [sampleName, setSampleName] = useState('PLAYER NAME');
  const [sampleNumber, setSampleNumber] = useState('07');
  const [fontFamily, setFontFamily] = useState("'Bebas Neue', sans-serif");
  const [fillColor, setFillColor] = useState('#ffffff');

  const [players, setPlayers] = useState<RosterPlayer[]>([
    { id: '1', name: 'MILLER', number: '07', size: 'L' },
    { id: '2', name: 'DAVIS', number: '10', size: 'M' },
    { id: '3', name: 'JOHNSON', number: '23', size: 'XL' },
  ]);

  const handleAddPlayer = () => {
    setPlayers([
      ...players,
      {
        id: String(Date.now()),
        name: `NAME ${players.length + 1}`,
        number: String(players.length + 1).padStart(2, '0'),
        size: productSizes[0] || 'M',
      },
    ]);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 1) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handlePlayerChange = (id: string, field: keyof RosterPlayer, value: string) => {
    const updated = players.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    setPlayers(updated);
    if (selectedElement) {
      onUpdateRoster({ rosterList: updated });
    }
  };

  const handleApply = () => {
    onAddRoster({
      sampleName: players[0]?.name || sampleName,
      sampleNumber: players[0]?.number || sampleNumber,
      fontFamily,
      fill: fillColor,
      rosterList: players,
    });
  };

  return (
    <div className="space-y-4 p-4 text-zinc-800">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
        <Users className="w-4 h-4 text-emerald-700" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
          Team Names &amp; Numbers Roster
        </h3>
      </div>

      <p className="text-[11px] text-zinc-500 leading-relaxed">
        Customize individual names, numbers, and sizes for jerseys, sports teams, and staff uniforms.
      </p>

      {/* Font & Color Styling */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1">Jersey Font</label>
          <select
            value={selectedElement ? selectedElement.fontFamily : fontFamily}
            onChange={(e) => {
              if (selectedElement) onUpdateRoster({ fontFamily: e.target.value });
              else setFontFamily(e.target.value);
            }}
            className="w-full px-2 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg"
          >
            <option value="'Bebas Neue', sans-serif">Bebas Athletic Block</option>
            <option value="'Oswald', sans-serif">Oswald Varsity</option>
            <option value="'Montserrat', sans-serif">Montserrat Bold</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1">Print Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedElement ? selectedElement.fill : fillColor}
              onChange={(e) => {
                if (selectedElement) onUpdateRoster({ fill: e.target.value });
                else setFillColor(e.target.value);
              }}
              className="w-8 h-7 rounded cursor-pointer p-0"
            />
            <span className="text-xs font-mono text-zinc-500">
              {selectedElement ? selectedElement.fill : fillColor}
            </span>
          </div>
        </div>
      </div>

      {/* Player List Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700">Roster Members ({players.length})</span>
          <button
            onClick={handleAddPlayer}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Player
          </button>
        </div>

        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className="p-2 bg-zinc-50 border border-zinc-200/80 rounded-lg flex items-center gap-2 text-xs"
            >
              <span className="text-zinc-400 font-mono w-4">{idx + 1}.</span>
              <input
                type="text"
                placeholder="NAME"
                value={p.name}
                onChange={(e) => handlePlayerChange(p.id, 'name', e.target.value.toUpperCase())}
                className="w-24 px-2 py-1 bg-white border border-zinc-300 rounded text-xs uppercase font-bold"
              />
              <input
                type="text"
                placeholder="#"
                value={p.number}
                onChange={(e) => handlePlayerChange(p.id, 'number', e.target.value)}
                className="w-12 px-2 py-1 bg-white border border-zinc-300 rounded text-xs text-center font-bold font-mono"
              />
              <select
                value={p.size}
                onChange={(e) => handlePlayerChange(p.id, 'size', e.target.value)}
                className="px-2 py-1 bg-white border border-zinc-300 rounded text-xs"
              >
                {productSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleRemovePlayer(p.id)}
                className="p-1 text-zinc-400 hover:text-red-600 transition"
                title="Remove player"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {!selectedElement && (
        <button
          onClick={handleApply}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Hash className="w-4 h-4" />
          <span>Apply Name &amp; Number to Jersey</span>
        </button>
      )}
    </div>
  );
};
