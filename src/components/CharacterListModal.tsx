import React, { useState } from 'react';
import { CharacterProfile, ArchitectureType } from '../types';
import {
  X,
  Search,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  UserCheck,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CharacterListModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterProfile[];
  activeCharacterId: string;
  onSelectCharacter: (id: string) => void;
  onCreateNew: () => void;
  onDuplicateCharacter: (id: string) => void;
  onDeleteCharacter: (id: string) => void;
  onImportJSON: (jsonString: string) => void;
}

export const CharacterListModal: React.FC<CharacterListModalProps> = ({
  isOpen,
  onClose,
  characters,
  activeCharacterId,
  onSelectCharacter,
  onCreateNew,
  onDuplicateCharacter,
  onDeleteCharacter,
  onImportJSON,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterType === 'all' || c.architectureType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJSON(content);
      }
    };
    reader.readAsText(file);
  };

  const getArchitectureBadge = (type: ArchitectureType) => {
    switch (type) {
      case 'conflicted':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'hybrid':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'hedonic':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Character Database</h2>
              <p className="text-xs text-slate-400">
                Manage, search, clone, and export stored character profiles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search characters or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            >
              <option value="all">All Architecture Types</option>
              <option value="conflicted">Conflicted (Defensive)</option>
              <option value="hybrid">Hybrid (Oscillating)</option>
              <option value="hedonic">Hedonic (Pleasure-Forward)</option>
            </select>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <button
              onClick={() => {
                onCreateNew();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Character Cards List */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((char) => {
            const isActive = char.id === activeCharacterId;
            return (
              <div
                key={char.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={char.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                        alt={char.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          {char.name}
                          {isActive && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-normal">
                              <UserCheck className="w-3 h-3" /> Active
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-400 italic">{char.title || 'Untitled Profile'}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getArchitectureBadge(
                        char.architectureType
                      )}`}
                    >
                      {char.architectureType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {char.physicalDescription || 'No physical description added yet.'}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {char.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(char.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDuplicateCharacter(char.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="Clone character"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {characters.length > 1 && (
                      <button
                        onClick={() => onDeleteCharacter(char.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
                        title="Delete character"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSelectCharacter(char.id);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-600/30 border border-rose-500/50 text-rose-200'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      {isActive ? 'Loaded' : 'Load Character'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40 text-rose-400" />
              <p className="text-sm font-medium">No character profiles match your filter.</p>
              <button
                onClick={onCreateNew}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
