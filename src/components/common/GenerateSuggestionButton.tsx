import React, { useState } from 'react';
import { CharacterProfile } from '../../types';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { filterCharacterForStep, getTargetStepForField } from '../../utils/aiContextFilter';

interface GenerateSuggestionButtonProps {
  fieldName: string;
  fieldLabel: string;
  currentValue?: string | number;
  character: CharacterProfile;
  step?: number;
  context?: string;
  prompt?: string;
  onApply: (suggestion: string) => void;
  className?: string;
  compact?: boolean;
}

export const GenerateSuggestionButton: React.FC<GenerateSuggestionButtonProps> = ({
  fieldName,
  fieldLabel,
  currentValue,
  character,
  step,
  context,
  prompt,
  onApply,
  className = '',
  compact = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const targetStep = getTargetStepForField(fieldName, step);
      // Cleanly filter character so placeholders or fields from unreached steps are NEVER included in prompt
      const filteredCharacter = filterCharacterForStep(character, targetStep, fieldName);

      const bodyData = JSON.stringify({
        task: 'suggest-field',
        fieldName,
        fieldLabel,
        step: targetStep,
        character: filteredCharacter,
        context,
        prompt,
      });

      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyData,
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate suggestion');
      }

      let suggestion = data.result ? String(data.result).trim() : '';
      // Strip leading and trailing quotes if any
      suggestion = suggestion.replace(/^["'`]|["'`]$/g, '').trim();

      if (suggestion) {
        onApply(suggestion);
        setJustApplied(true);
        setTimeout(() => setJustApplied(false), 2200);
      }
    } catch (err) {
      console.error(`Error generating suggestion for ${fieldLabel}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      title={`Ask AI to propose a suggestion for ${fieldLabel}`}
      className={`group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap border select-none disabled:opacity-50 disabled:cursor-not-allowed ${
        justApplied
          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-950/40'
          : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 hover:text-purple-100 border-purple-500/30 hover:border-purple-400/50 shadow-sm shadow-purple-950/30'
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 text-amber-300 animate-spin" />
      ) : justApplied ? (
        <Check className="w-3 h-3 text-emerald-400" />
      ) : (
        <Sparkles className="w-3 h-3 text-amber-300 group-hover:scale-110 transition-transform" />
      )}
      <span>
        {loading
          ? 'Generating...'
          : justApplied
          ? 'Suggested!'
          : compact
          ? 'Suggest'
          : 'Generate Suggestion'}
      </span>
    </button>
  );
};
