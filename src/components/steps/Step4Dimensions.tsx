import React, { useState } from 'react';
import { CharacterProfile, SexualityDimensionsMap, DimensionItem } from '../../types';
import { BarChart2, Sliders, Wand2, RefreshCw, Eye } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';
import { filterCharacterForStep } from '../../utils/aiContextFilter';

interface Step4Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step4Dimensions: React.FC<Step4Props> = ({ character, onChange }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'radar'>('editor');
  const [loadingAI, setLoadingAI] = useState(false);

  const updateDimension = (key: keyof SexualityDimensionsMap, field: 'score' | 'description', value: any) => {
    const currentMap = { ...character.sexualityDimensions };
    const currentItem = currentMap[key];
    if (currentItem) {
      currentMap[key] = {
        ...currentItem,
        [field]: value,
      };
      onChange({ sexualityDimensions: currentMap });
    }
  };

  const generateWithAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'generate-15-dimensions',
          character: filterCharacterForStep(character, 4),
        }),
      });
      const data = await res.json();
      if (data.result) {
        // Try to parse JSON from AI text response
        const jsonMatch = data.result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.dimensions) {
            const updatedMap = { ...character.sexualityDimensions };
            Object.keys(parsed.dimensions).forEach((k) => {
              const key = k as keyof SexualityDimensionsMap;
              if (updatedMap[key]) {
                const item = parsed.dimensions[k];
                updatedMap[key] = {
                  ...updatedMap[key],
                  score: typeof item.score === 'number' ? item.score : updatedMap[key].score,
                  description: item.description || updatedMap[key].description,
                };
              }
            });
            onChange({ sexualityDimensions: updatedMap });
          }
        }
      }
    } catch (err) {
      console.error('Failed to generate 15 dimensions:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const dimensionsList = Object.values(character.sexualityDimensions || {});

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart2 className="w-4 h-4" /> Step 4 of 9
          </div>
          <h2 className="text-2xl font-black text-slate-100">15-Dimension Sexuality Profiling Matrix</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            A tight, comprehensive profile spanning motivational signatures, desire patterns, approach/avoidance balance, control themes, and values alignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateWithAI}
            disabled={loadingAI}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>{loadingAI ? 'AI Generating...' : 'Auto-Fill with Gemini'}</span>
          </button>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'editor' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sliders & Editor
            </button>
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'radar' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visual Breakdown
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dimensionsList.map((item: DimensionItem) => {
            const key = item.key as keyof SexualityDimensionsMap;
            return (
              <div key={item.key} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200">{item.label}</h3>
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md">
                    {item.score}/10
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={item.score}
                  onChange={(e) => updateDimension(key, 'score', Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />

                <div className="flex items-center justify-between gap-1 pt-1">
                  <span className="text-[11px] font-medium text-slate-400">Behavioral Expression</span>
                  <GenerateSuggestionButton
                    fieldName={`dimension_${key}`}
                    fieldLabel={item.label}
                    currentValue={item.description}
                    character={character}
                    step={4}
                    context={`15-Dimension Sexuality Profile: ${item.label} (Intensity Rating: ${item.score}/10)`}
                    onApply={(val) => updateDimension(key, 'description', val)}
                  />
                </div>

                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateDimension(key, 'description', e.target.value)}
                  placeholder="Describe how this dimension manifests in the character's behavior..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
                />
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'radar' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            15-Dimension Visual Intensity Bars
          </h3>
          <div className="space-y-3">
            {dimensionsList.map((item: DimensionItem) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>{item.label}</span>
                  <span className="font-mono text-rose-400 font-bold">{item.score}/10</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.score / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
