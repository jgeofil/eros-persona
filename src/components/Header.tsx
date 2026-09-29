import React from 'react';
import { CharacterProfile } from '../types';
import {
  Sparkles,
  Database,
  PlusCircle,
  Download,
  Flame,
  Wand2,
  Share2,
} from 'lucide-react';

interface HeaderProps {
  activeCharacter: CharacterProfile;
  charactersList: CharacterProfile[];
  onSelectCharacter: (id: string) => void;
  onOpenLibrary: () => void;
  onNewCharacter: () => void;
  onOpenAIModal: () => void;
  onExportJSON: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCharacter,
  charactersList,
  onSelectCharacter,
  onOpenLibrary,
  onNewCharacter,
  onOpenAIModal,
  onExportJSON,
}) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'conflicted':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'hybrid':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'hedonic':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Active Character */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-purple-600 to-amber-600 p-0.5 shadow-lg shadow-rose-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-rose-200 via-amber-200 to-purple-200 bg-clip-text text-transparent leading-tight tracking-wide">
                Erotic Character Architect
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Psychological Depth & Roleplay System Builder
              </p>
            </div>
          </div>

          {/* Quick Character Select Mobile/Desktop */}
          <div className="flex items-center gap-2">
            <select
              value={activeCharacter.id}
              onChange={(e) => onSelectCharacter(e.target.value)}
              className="bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-medium cursor-pointer max-w-[160px] sm:max-w-[220px] truncate"
            >
              {charactersList.map((char) => (
                <option key={char.id} value={char.id} className="bg-slate-900 text-slate-200">
                  {char.name} ({char.architectureType})
                </option>
              ))}
            </select>

            <span
              className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider hidden lg:inline-block ${getBadgeColor(
                activeCharacter.architectureType
              )}`}
            >
              {activeCharacter.architectureType}
            </span>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto py-1 sm:py-0">
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-purple-950/40 transition-all cursor-pointer whitespace-nowrap"
            title="Ask Gemini AI to enhance character details"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-200" />
            <span>AI Co-Architect</span>
          </button>

          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
            title="Open Character Database & Library"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Database ({charactersList.length})</span>
          </button>

          <button
            onClick={onNewCharacter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
            title="Create a new character profile"
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">New Profile</span>
          </button>

          <button
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
            title="Export Profile as JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
