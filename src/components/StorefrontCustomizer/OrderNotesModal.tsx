'use client';

import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';

interface OrderNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: string;
  onSaveNote: (note: string) => void;
}

export const OrderNotesModal: React.FC<OrderNotesModalProps> = ({
  isOpen,
  onClose,
  note,
  onSaveNote,
}) => {
  const [currentNote, setCurrentNote] = useState(note);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveNote(currentNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">Add Production / Order Note</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          Provide specific instructions for the printing facility (e.g., specific placement offset, Pantone color match, packaging instructions).
        </p>

        <textarea
          rows={4}
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="e.g. Please position chest print 2.5 inches below collar seam..."
          className="w-full p-3 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-50 text-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  );
};
