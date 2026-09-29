import React, { useState, useEffect } from 'react';
import { CharacterProfile } from '../../types';
import { generateSystemPrompt } from '../../utils/promptGenerator';
import { FileCode2, Copy, Check, Download, Wand2, RefreshCw } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';

interface Step9Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step9SystemPrompt: React.FC<Step9Props> = ({ character, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // Auto-generate if customSystemPrompt is empty
  useEffect(() => {
    if (!character.customSystemPrompt) {
      const generated = generateSystemPrompt(character);
      onChange({ customSystemPrompt: generated });
    }
  }, [character.id]);

  const handleRegenerate = () => {
    const fresh = generateSystemPrompt(character);
    onChange({ customSystemPrompt: fresh });
  };

  const handleAIRefine = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'generate-system-prompt',
          character,
        }),
      });
      const data = await res.json();
      if (data.result) {
        onChange({ customSystemPrompt: data.result });
      }
    } catch (err) {
      console.error('Failed to refine system prompt:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(character.customSystemPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([character.customSystemPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.toLowerCase().replace(/\s+/g, '_')}_system_prompt.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(character, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.toLowerCase().replace(/\s+/g, '_')}_character_card.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCode2 className="w-4 h-4" /> Step 9 of 9
          </div>
          <h2 className="text-2xl font-black text-slate-100">System Prompt & Roleplay Export</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete ready-to-use System Prompt for AI roleplay and creative writing. Preserves 5-layer psychological tension, Dual Control brakes, and oscillation rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            title="Re-build prompt from raw character attributes"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Rebuild Prompt</span>
          </button>

          <button
            onClick={handleAIRefine}
            disabled={loadingAI}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            <span>{loadingAI ? 'Refining...' : 'AI Refine with Gemini'}</span>
          </button>
        </div>
      </div>

      {/* Main Prompt Box & Toolbar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              System Prompt Output for {character.name}
            </h3>
            <GenerateSuggestionButton
              fieldName="customSystemPrompt"
              fieldLabel="System Prompt"
              currentValue={character.customSystemPrompt}
              character={character}
              step={9}
              context="Full System Prompt for AI Roleplay and Literature"
              onApply={(val) => onChange({ customSystemPrompt: val })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-colors shadow"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download .md</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download .json Card</span>
            </button>
          </div>
        </div>

        {/* Textarea Editor */}
        <textarea
          rows={22}
          value={character.customSystemPrompt}
          onChange={(e) => onChange({ customSystemPrompt: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
        />
      </div>
    </div>
  );
};
