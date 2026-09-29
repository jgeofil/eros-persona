import React, { useState } from 'react';
import { CharacterProfile, SexualityDimensionsMap } from '../types';
import {
  Wand2,
  X,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Brain,
  Zap,
  BookOpen,
  FileText,
  Sliders,
} from 'lucide-react';

interface AICoArchitectModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterProfile;
  onUpdateCharacter: (updated: Partial<CharacterProfile>) => void;
}

export const AICoArchitectModal: React.FC<AICoArchitectModalProps> = ({
  isOpen,
  onClose,
  character,
  onUpdateCharacter,
}) => {
  const [selectedTask, setSelectedTask] = useState<string>('generate-15-dimensions');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleRunTask = async (taskName: string) => {
    setSelectedTask(taskName);
    setLoading(true);
    setErrorMsg('');
    setResultText('');
    setApplied(false);

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskName,
          character,
          prompt: customPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI generation failed');
      }

      setResultText(data.result || 'No response returned from AI.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error connecting to Gemini AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [appliedMsg, setAppliedMsg] = useState<string | null>(null);

  const handleApplyToCharacter = () => {
    if (!resultText) return;

    if (selectedTask === 'generate-15-dimensions') {
      try {
        const jsonText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonText);
        onUpdateCharacter({
          sexualityDimensions: {
            ...character.sexualityDimensions,
            ...parsed,
          },
        });
        setAppliedMsg('Updated 15 Sexual Personality Dimensions in Step 4!');
      } catch (err) {
        console.error('Failed to parse 15 dimensions JSON:', err);
        setAppliedMsg('Could not auto-parse 15 dimensions JSON. Try copying manually.');
      }
    } else if (selectedTask === 'generate-system-prompt') {
      onUpdateCharacter({ customSystemPrompt: resultText });
      setAppliedMsg('Applied custom System Prompt to Step 9!');
    } else if (selectedTask === 'expand-backstory') {
      const newChapter = {
        id: `bs_ai_${Date.now()}`,
        title: 'AI Generated Memory',
        period: 'Key Moment',
        content: resultText,
        emotionalImpact: 'Deepened psychological structure.',
        tags: ['AI Co-Architect', 'Backstory'],
      };
      onUpdateCharacter({
        backstoryChapters: [...character.backstoryChapters, newChapter],
      });
      setAppliedMsg('Added new backstory chapter in Step 7 Dynamic Database!');
    } else if (selectedTask === 'deepen-contradictions') {
      const lines = resultText
        .split('\n')
        .map((l) => l.trim().replace(/^[-*0-9.]+\s*/, ''))
        .filter((l) => l.length > 10)
        .slice(0, 3);

      onUpdateCharacter({
        highYieldContradictions: [
          ...character.highYieldContradictions,
          ...lines,
        ],
      });
      setAppliedMsg(`Added ${lines.length} new high-yield contradictions to Step 5!`);
    }

    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setAppliedMsg(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/60 to-rose-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Wand2 className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Gemini AI Co-Architect
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  gemini-3.6-flash
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Co-create psychological depth, 15-dimension matrices, memory chapters, and system prompts for {character.name}.
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

        {/* Action Preset Chips */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex flex-wrap gap-2">
          <button
            onClick={() => handleRunTask('generate-15-dimensions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              selectedTask === 'generate-15-dimensions'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-950/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-rose-300" />
            <span>Generate 15 Dimensions</span>
          </button>

          <button
            onClick={() => handleRunTask('deepen-contradictions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              selectedTask === 'deepen-contradictions'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-950/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-300" />
            <span>Deepen Contradictions</span>
          </button>

          <button
            onClick={() => handleRunTask('expand-backstory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              selectedTask === 'expand-backstory'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-950/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>Expand Memory Chapter</span>
          </button>

          <button
            onClick={() => handleRunTask('generate-system-prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              selectedTask === 'generate-system-prompt'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-950/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-300" />
            <span>Generate System Prompt</span>
          </button>
        </div>

        {/* Custom Prompt Input */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Optional: Add specific guidance (e.g. 'Focus on how his early career betrayal affected his post-sex shutdown')..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={() => handleRunTask(selectedTask)}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{loading ? 'Generating...' : 'Run Task'}</span>
            </button>
          </div>
        </div>

        {/* Output View */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-950/80">
          {loading && (
            <div className="py-16 text-center text-purple-300 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-sm font-medium">
                Gemini is synthesizing psychological analysis and erotic depth...
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs leading-relaxed">
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          {!loading && !errorMsg && resultText && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  AI Output Result
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyToCharacter}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow"
                  >
                    {applied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{applied ? 'Applied!' : 'Apply to Profile'}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {appliedMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold animate-fadeIn">
                  ✓ {appliedMsg}
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[350px] overflow-y-auto">
                {resultText}
              </div>
            </div>
          )}

          {!loading && !errorMsg && !resultText && (
            <div className="py-16 text-center text-slate-500">
              <Wand2 className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-400" />
              <p className="text-sm font-medium text-slate-300">
                Select an AI task above or enter custom guidance to start.
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Gemini uses the 5-layer depth model, Dual Control excitation/inhibition, and 15-dimension sexuality framework to generate precise literary insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
