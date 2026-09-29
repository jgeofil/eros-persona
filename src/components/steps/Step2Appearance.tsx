import React, { useState } from 'react';
import { CharacterProfile } from '../../types';
import { User, Eye, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';
import { filterCharacterForStep } from '../../utils/aiContextFilter';

interface Step2Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step2Appearance: React.FC<Step2Props> = ({ character, onChange }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const avatarPresets = [
    { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80' },
    { label: 'Femme Fatale', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
    { label: 'Non-Binary Cyber', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80' },
    { label: 'Artisan Sculptor', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80' },
    { label: 'Sensual Perfumer', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80' },
    { label: 'Dark Romantic', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
  ];

  const handleAISuggestAppearance = async () => {
    setLoadingAI(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'autofill-step-2',
          character: filterCharacterForStep(character, 2),
        }),
      });
      const data = await res.json();
      if (data.result) {
        const jsonText = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonText);
        onChange({
          physicalDescription: parsed.physicalDescription || character.physicalDescription,
          signatureScent: parsed.signatureScent || character.signatureScent,
          voiceMannerisms: parsed.voiceMannerisms || character.voiceMannerisms,
          shadowLeaksPhysical: parsed.shadowLeaksPhysical || character.shadowLeaksPhysical,
          styleAesthetic: parsed.styleAesthetic || character.styleAesthetic,
        });
        setAiMessage('Applied AI Physical & Sensory details to profile!');
        setTimeout(() => setAiMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to generate appearance:', err);
      setAiMessage('Failed to generate AI suggestion. Check API key.');
      setTimeout(() => setAiMessage(null), 4000);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <User className="w-4 h-4" /> Step 2 of 9
          </div>
          <h2 className="text-2xl font-black text-slate-100">Appearance & Physical Traits</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Erotic charge begins with somatic presence: physical features, signature scent, vocal cadence, and involuntary physical shadow leaks.
          </p>
        </div>

        <button
          onClick={handleAISuggestAppearance}
          disabled={loadingAI}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow disabled:opacity-50 whitespace-nowrap self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loadingAI ? 'Generating Profile...' : 'AI Auto-Suggest Sensory Profile'}</span>
        </button>
      </div>

      {aiMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
          ✓ {aiMessage}
        </div>
      )}

      {/* Avatar Selection */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Avatar Image & Visual Anchor</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={character.avatarUrl || avatarPresets[0].url}
            alt={character.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-3 flex-1 w-full">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="text-xs font-semibold text-slate-400">Avatar Image URL</label>
                <GenerateSuggestionButton
                  fieldName="avatarUrl"
                  fieldLabel="Avatar Image URL"
                  currentValue={character.avatarUrl}
                  character={character}
                  step={2}
                  prompt="Provide a direct URL to a high quality portrait photograph on Unsplash that suits this character aesthetic."
                  onApply={(val) => onChange({ avatarUrl: val })}
                />
              </div>
              <input
                type="text"
                value={character.avatarUrl}
                onChange={(e) => onChange({ avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Or choose a preset visual anchor:</span>
              <div className="flex flex-wrap gap-2">
                {avatarPresets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => onChange({ avatarUrl: preset.url })}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 cursor-pointer transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trait Textfields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Physical & Sensory Profile</h3>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Detailed Physical Description</label>
              <GenerateSuggestionButton
                fieldName="physicalDescription"
                fieldLabel="Detailed Physical Description"
                currentValue={character.physicalDescription}
                character={character}
                step={2}
                onApply={(val) => onChange({ physicalDescription: val })}
              />
            </div>
            <textarea
              rows={4}
              value={character.physicalDescription}
              onChange={(e) => onChange({ physicalDescription: e.target.value })}
              placeholder="Describe height, build, jawline, eye color, skin texture, tattoos, or distinctive physical markers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Signature Scent</label>
              <GenerateSuggestionButton
                fieldName="signatureScent"
                fieldLabel="Signature Scent"
                currentValue={character.signatureScent}
                character={character}
                step={2}
                onApply={(val) => onChange({ signatureScent: val })}
              />
            </div>
            <input
              type="text"
              value={character.signatureScent}
              onChange={(e) => onChange({ signatureScent: e.target.value })}
              placeholder="e.g. Smoky cedarwood, jasmine, warm amber, sea salt, or aged bourbon"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Wardrobe & Style Aesthetic</label>
              <GenerateSuggestionButton
                fieldName="styleAesthetic"
                fieldLabel="Wardrobe & Style Aesthetic"
                currentValue={character.styleAesthetic}
                character={character}
                step={2}
                onApply={(val) => onChange({ styleAesthetic: val })}
              />
            </div>
            <input
              type="text"
              value={character.styleAesthetic}
              onChange={(e) => onChange({ styleAesthetic: e.target.value })}
              placeholder="e.g. Dark luxury, tailored wool, silk slips, or distressed leather"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Voice & Somatic Leaks</h3>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Voice & Speech Mannerisms</label>
              <GenerateSuggestionButton
                fieldName="voiceMannerisms"
                fieldLabel="Voice & Speech Mannerisms"
                currentValue={character.voiceMannerisms}
                character={character}
                step={2}
                onApply={(val) => onChange({ voiceMannerisms: val })}
              />
            </div>
            <textarea
              rows={3}
              value={character.voiceMannerisms}
              onChange={(e) => onChange({ voiceMannerisms: e.target.value })}
              placeholder="e.g. Low gravelly baritone; deliberate pauses; adjusts cufflinks when under tension..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Physical Shadow Leaks (Involuntary Micro-Behaviors)</span>
              </label>
              <GenerateSuggestionButton
                fieldName="shadowLeaksPhysical"
                fieldLabel="Physical Shadow Leaks"
                currentValue={character.shadowLeaksPhysical}
                character={character}
                step={2}
                onApply={(val) => onChange({ shadowLeaksPhysical: val })}
              />
            </div>
            <textarea
              rows={4}
              value={character.shadowLeaksPhysical}
              onChange={(e) => onChange({ shadowLeaksPhysical: e.target.value })}
              placeholder="What reveals their true hidden emotional/sexual state when they try to mask it? (e.g. Jaw clenches when touched on the nape; dilated pupils when helpless; biting lower lip when suppressing intense desire)"
              className="w-full bg-slate-950 border border-amber-500/30 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
