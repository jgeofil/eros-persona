import React, { useState } from 'react';
import { CharacterProfile, MoodboardItem } from '../../types';
import { Image as ImageIcon, Plus, Trash2, Wand2, Palette, Quote, Flame, Sparkles } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';

interface Step7Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step7Moodboard: React.FC<Step7Props> = ({ character, onChange }) => {
  const [type, setType] = useState<MoodboardItem['type']>('image');
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');

  const imagePresets = [
    { label: 'Bespoke Suit Detail', value: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80' },
    { label: 'Smoky Bourbon & Ice', value: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&auto=format&fit=crop&q=80' },
    { label: 'Marble Dust & Sculpture', value: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
    { label: 'Dark Perfume & Silk', value: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80' },
  ];

  const addItem = () => {
    if (!value.trim() || !label.trim()) return;
    const newItem: MoodboardItem = {
      id: `mb_${Date.now()}`,
      type,
      value: value.trim(),
      label: label.trim(),
    };

    onChange({ moodboard: [...character.moodboard, newItem] });
    setValue('');
    setLabel('');
  };

  const removeItem = (id: string) => {
    const updated = character.moodboard.filter((item) => item.id !== id);
    onChange({ moodboard: updated });
  };

  const suggestWithAI = async () => {
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'suggest-moodboard',
          character,
        }),
      });
      const data = await res.json();
      if (data.result) {
        // Parse lines or quotes
        const newItem: MoodboardItem = {
          id: `mb_ai_${Date.now()}`,
          type: 'quote',
          value: data.result.slice(0, 180),
          label: 'AI Sensory Mood Note',
        };
        onChange({ moodboard: [...character.moodboard, newItem] });
      }
    } catch (err) {
      console.error('Failed to suggest moodboard item:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" /> Step 7 of 9
          </div>
          <h2 className="text-2xl font-black text-slate-100">Visual & Sensory Mood Boarding Canvas</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Curate visual aesthetics, color swatches, tactile textures, signature scents, and defining quotes into an intuitive visual collage.
          </p>
        </div>

        <button
          onClick={suggestWithAI}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/40 cursor-pointer shadow-md self-start md:self-auto"
        >
          <Wand2 className="w-4 h-4 text-amber-300" />
          <span>AI Moodboard Suggestions</span>
        </button>
      </div>

      {/* Add Item Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Add Mood Board Asset</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Asset Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MoodboardItem['type'])}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2"
            >
              <option value="image">Image (URL)</option>
              <option value="color">Color Swatch (Hex code)</option>
              <option value="texture">Tactile Texture (Text description)</option>
              <option value="scent">Aromatic Scent Note</option>
              <option value="quote">Erotic Quote / Motto</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Label / Title *</label>
              <GenerateSuggestionButton
                fieldName="moodboardLabel"
                fieldLabel="Asset Label"
                currentValue={label}
                character={character}
                step={7}
                context={`Moodboard item of type '${type}'`}
                onApply={(val) => setLabel(val)}
              />
            </div>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Midnight Silk & Smoke"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Value (URL, Hex, or Text) *</label>
              <GenerateSuggestionButton
                fieldName="moodboardValue"
                fieldLabel={`Value for ${type}`}
                currentValue={value}
                character={character}
                step={7}
                context={`Moodboard value for type: '${type}', label: '${label}'`}
                prompt={
                  type === 'image'
                    ? 'Provide a direct URL to an aesthetic Unsplash photograph matching this character.'
                    : type === 'color'
                    ? 'Provide a hex code (e.g. #2e1065) matching this mood.'
                    : type === 'quote'
                    ? 'Provide a provocative, memorable literary or roleplay quote for this character.'
                    : `Provide evocative text for ${type}.`
                }
                onApply={(val) => setValue(val)}
              />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'color' ? '#1e293b' : 'Value string or image URL'}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
        </div>

        {/* Image presets */}
        {type === 'image' && (
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Quick image presets:</span>
            <div className="flex flex-wrap gap-2">
              {imagePresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLabel(preset.label);
                    setValue(preset.value);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset to Moodboard</span>
          </button>
        </div>
      </div>

      {/* Moodboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {character.moodboard.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl relative group"
          >
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors z-10 cursor-pointer"
              title="Remove asset"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div>
              {item.type === 'image' && (
                <div className="rounded-xl overflow-hidden mb-3 h-48 bg-slate-950 border border-slate-800">
                  <img
                    src={item.value}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {item.type === 'color' && (
                <div
                  className="w-full h-32 rounded-xl mb-3 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold shadow-inner"
                  style={{ backgroundColor: item.value, color: '#ffffff' }}
                >
                  {item.value}
                </div>
              )}

              {item.type === 'quote' && (
                <div className="p-4 rounded-xl mb-3 bg-purple-950/20 border border-purple-500/30 text-purple-200 italic text-xs leading-relaxed font-serif">
                  <Quote className="w-4 h-4 text-purple-400 mb-1" />
                  "{item.value}"
                </div>
              )}

              {(item.type === 'texture' || item.type === 'scent') && (
                <div className="p-4 rounded-xl mb-3 bg-slate-950 border border-slate-800 text-amber-200 text-xs font-medium">
                  <Flame className="w-4 h-4 text-amber-400 mb-1" />
                  {item.value}
                </div>
              )}

              <h4 className="text-xs font-bold text-slate-100 flex items-center justify-between">
                {item.label}
                <span className="text-[10px] text-slate-500 font-mono uppercase">{item.type}</span>
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
