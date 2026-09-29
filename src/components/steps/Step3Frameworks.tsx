import React, { useState } from 'react';
import {
  CharacterProfile,
  AttachmentStyle,
  PowerPosition,
  EroticBlueprint,
} from '../../types';
import { Sliders, Zap, Shield, Heart, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';
import { filterCharacterForStep } from '../../utils/aiContextFilter';

interface Step3Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step3Frameworks: React.FC<Step3Props> = ({ character, onChange }) => {
  const [newTurnOn, setNewTurnOn] = useState('');
  const [newBrake, setNewBrake] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const handleAISuggestFrameworks = async () => {
    setLoadingAI(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'autofill-step-3',
          character: filterCharacterForStep(character, 3),
        }),
      });
      const data = await res.json();
      if (data.result) {
        const jsonText = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonText);
        onChange({
          sesExcitationScore: parsed.sesExcitationScore ?? character.sesExcitationScore,
          sisInhibitionScore: parsed.sisInhibitionScore ?? character.sisInhibitionScore,
          excitationTriggers: parsed.excitationTriggers || character.excitationTriggers,
          inhibitionBrakes: parsed.inhibitionBrakes || character.inhibitionBrakes,
          attachmentStyle: parsed.attachmentStyle || character.attachmentStyle,
          sexualProximityPattern: parsed.sexualProximityPattern || character.sexualProximityPattern,
          powerPosition: parsed.powerPosition || character.powerPosition,
          powerNotes: parsed.powerNotes || character.powerNotes,
          primaryBlueprint: parsed.primaryBlueprint || character.primaryBlueprint,
          secondaryBlueprint: parsed.secondaryBlueprint || character.secondaryBlueprint,
          blueprintShameDistortion: parsed.blueprintShameDistortion || character.blueprintShameDistortion,
          layer1Core: parsed.layer1Core ? { ...character.layer1Core, ...parsed.layer1Core } : character.layer1Core,
          layer2Shadow: parsed.layer2Shadow ? { ...character.layer2Shadow, ...parsed.layer2Shadow } : character.layer2Shadow,
        });
        setAiMessage('Applied AI Psychological & Dual Control Frameworks!');
        setTimeout(() => setAiMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to generate frameworks:', err);
      setAiMessage('Failed to generate AI suggestion. Check API key.');
      setTimeout(() => setAiMessage(null), 4000);
    } finally {
      setLoadingAI(false);
    }
  };

  const addTurnOn = () => {
    if (!newTurnOn.trim()) return;
    onChange({ excitationTriggers: [...character.excitationTriggers, newTurnOn.trim()] });
    setNewTurnOn('');
  };

  const removeTurnOn = (index: number) => {
    const updated = character.excitationTriggers.filter((_, i) => i !== index);
    onChange({ excitationTriggers: updated });
  };

  const addBrake = () => {
    if (!newBrake.trim()) return;
    onChange({ inhibitionBrakes: [...character.inhibitionBrakes, newBrake.trim()] });
    setNewBrake('');
  };

  const removeBrake = (index: number) => {
    const updated = character.inhibitionBrakes.filter((_, i) => i !== index);
    onChange({ inhibitionBrakes: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" /> Step 3 of 9
          </div>
          <h2 className="text-2xl font-black text-slate-100">Psychological Frameworks & 5-Layer Depth</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Apply Dual Control principles (Excitation SES vs Inhibition SIS brakes), Attachment dynamics, Power x Desire matrix, Erotic Blueprints, and the 5-Layer Depth Engine.
          </p>
        </div>

        <button
          onClick={handleAISuggestFrameworks}
          disabled={loadingAI}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow disabled:opacity-50 whitespace-nowrap self-start md:self-auto"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>{loadingAI ? 'Generating Frameworks...' : 'AI Auto-Suggest Dual Control & Depth'}</span>
        </button>
      </div>

      {aiMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
          ✓ {aiMessage}
        </div>
      )}

      {/* Dual Control Model Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Dual Control Model (SES / SIS Balance)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            SES: {character.sesExcitationScore}/10 | SIS: {character.sisInhibitionScore}/10
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SES Excitation Slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-amber-300">
                Sexual Excitation System (SES) — Turn-On Acceleration
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">{character.sesExcitationScore}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={character.sesExcitationScore}
              onChange={(e) => onChange({ sesExcitationScore: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              How readily physical, psychological, or sensory stimuli ignite arousal.
            </p>
          </div>

          {/* SIS Inhibition Slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-rose-300">
                Sexual Inhibition System (SIS) — Sexual Brakes
              </label>
              <span className="text-xs font-mono font-bold text-rose-400">{character.sisInhibitionScore}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={character.sisInhibitionScore}
              onChange={(e) => onChange({ sisInhibitionScore: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Propensity to turn off due to threat, shame, emotional exposure, or loss of control.
            </p>
          </div>
        </div>

        {/* Triggers vs Brakes Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Turn-Ons */}
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <label className="text-xs font-semibold text-amber-300">Excitation Triggers (Turn-Ons)</label>
              <GenerateSuggestionButton
                fieldName="excitationTrigger"
                fieldLabel="Turn-On Trigger"
                currentValue={newTurnOn}
                character={character}
                step={3}
                context="SES Excitation Turn-On trigger"
                onApply={(val) => setNewTurnOn(val)}
              />
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTurnOn}
                onChange={(e) => setNewTurnOn(e.target.value)}
                placeholder="Add turn-on trigger..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                onKeyDown={(e) => e.key === 'Enter' && addTurnOn()}
              />
              <button
                onClick={addTurnOn}
                className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {character.excitationTriggers.map((trig, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  <span>{trig}</span>
                  <button onClick={() => removeTurnOn(i)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Brakes */}
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <label className="text-xs font-semibold text-rose-300">Inhibition Brakes (Shutdown Triggers)</label>
              <GenerateSuggestionButton
                fieldName="inhibitionBrake"
                fieldLabel="Inhibition Brake"
                currentValue={newBrake}
                character={character}
                step={3}
                context="SIS Inhibition Brake shutdown trigger"
                onApply={(val) => setNewBrake(val)}
              />
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newBrake}
                onChange={(e) => setNewBrake(e.target.value)}
                placeholder="Add brake trigger..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                onKeyDown={(e) => e.key === 'Enter' && addBrake()}
              />
              <button
                onClick={addBrake}
                className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {character.inhibitionBrakes.map((brk, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  <span>{brk}</span>
                  <button onClick={() => removeBrake(i)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Attachment & Power x Desire Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attachment Style */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400" /> Attachment Style
          </h3>
          <select
            value={character.attachmentStyle}
            onChange={(e) => onChange({ attachmentStyle: e.target.value as AttachmentStyle })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
          >
            <option value="dismissive_avoidant">Dismissive Avoidant (Independence as Armor)</option>
            <option value="fearful_disorganized">Fearful Disorganized (Craves closeness, fears engulfment)</option>
            <option value="anxious_preoccupied">Anxious Preoccupied (Seeks constant reassurance)</option>
            <option value="secure">Secure (Grounded, low relationship anxiety)</option>
          </select>
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-[11px] font-medium text-slate-400">Proximity Pattern</label>
              <GenerateSuggestionButton
                fieldName="sexualProximityPattern"
                fieldLabel="Sexual Proximity Pattern"
                currentValue={character.sexualProximityPattern}
                character={character}
                step={3}
                onApply={(val) => onChange({ sexualProximityPattern: val })}
              />
            </div>
            <textarea
              rows={2}
              value={character.sexualProximityPattern}
              onChange={(e) => onChange({ sexualProximityPattern: e.target.value })}
              placeholder="How attachment manifests in bedroom proximity..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
            />
          </div>
        </div>

        {/* Power x Desire Matrix */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-400" /> Power x Desire Matrix
          </h3>
          <select
            value={character.powerPosition}
            onChange={(e) => onChange({ powerPosition: e.target.value as PowerPosition })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
          >
            <option value="dominant_self">Dominant + Self-Focused (Defensive Control)</option>
            <option value="pleasure_dom">Pleasure Dom / Guide (Partner-Focused Control)</option>
            <option value="greedy_bottom">Greedy Receptive / Bottom (Self-Focused Surrender)</option>
            <option value="service_surrender">Service Surrender (Partner-Focused Surrender)</option>
            <option value="fluid_switch">Fluid Switch (Context-dependent movement)</option>
          </select>
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-[11px] font-medium text-slate-400">Power Notes</label>
              <GenerateSuggestionButton
                fieldName="powerNotes"
                fieldLabel="Power Notes"
                currentValue={character.powerNotes}
                character={character}
                step={3}
                onApply={(val) => onChange({ powerNotes: val })}
              />
            </div>
            <textarea
              rows={2}
              value={character.powerNotes}
              onChange={(e) => onChange({ powerNotes: e.target.value })}
              placeholder="Is power used defensively or for pure mutual pleasure?"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
            />
          </div>
        </div>

        {/* Erotic Blueprints */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Erotic Blueprint
          </h3>
          <select
            value={character.primaryBlueprint}
            onChange={(e) => onChange({ primaryBlueprint: e.target.value as EroticBlueprint })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
          >
            <option value="kinky">Kinky (Power, taboo, psychological edge)</option>
            <option value="sensual">Sensual (Smell, taste, texture, atmosphere)</option>
            <option value="sexual">Sexual (Genitals, nudity, direct sex)</option>
            <option value="energetic">Energetic (Tease, space, anticipation)</option>
            <option value="shapeshifter">Shapeshifter (Fluid across all blueprints)</option>
          </select>
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-[11px] font-medium text-slate-400">Blueprint Shame Distortion</label>
              <GenerateSuggestionButton
                fieldName="blueprintShameDistortion"
                fieldLabel="Blueprint Shame Distortion"
                currentValue={character.blueprintShameDistortion}
                character={character}
                step={3}
                onApply={(val) => onChange({ blueprintShameDistortion: val })}
              />
            </div>
            <input
              type="text"
              value={character.blueprintShameDistortion}
              onChange={(e) => onChange({ blueprintShameDistortion: e.target.value })}
              placeholder="Blueprint shame point or defense distortion..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* 5-Layer Depth Engine inputs */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
          The 5-Layer Psychological Depth Engine
        </h3>

        {/* Layer 1 */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Layer 1 — Core Motivational Engine</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="text-xs text-slate-400">Core Wound</label>
                <GenerateSuggestionButton
                  fieldName="coreWound"
                  fieldLabel="Core Wound"
                  currentValue={character.layer1Core.coreWound}
                  character={character}
                  step={3}
                  onApply={(val) =>
                    onChange({
                      layer1Core: { ...character.layer1Core, coreWound: val },
                    })
                  }
                />
              </div>
              <textarea
                rows={2}
                value={character.layer1Core.coreWound}
                onChange={(e) =>
                  onChange({
                    layer1Core: { ...character.layer1Core, coreWound: e.target.value },
                  })
                }
                placeholder="Early trauma, betrayal, loss of control, or emotional abandonment..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="text-xs text-slate-400">Core Desire</label>
                <GenerateSuggestionButton
                  fieldName="coreDesire"
                  fieldLabel="Core Desire"
                  currentValue={character.layer1Core.coreDesire}
                  character={character}
                  step={3}
                  onApply={(val) =>
                    onChange({
                      layer1Core: { ...character.layer1Core, coreDesire: val },
                    })
                  }
                />
              </div>
              <textarea
                rows={2}
                value={character.layer1Core.coreDesire}
                onChange={(e) =>
                  onChange({
                    layer1Core: { ...character.layer1Core, coreDesire: e.target.value },
                  })
                }
                placeholder="What they crave above all (safety, total devotion, unmasked intimacy)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="text-xs text-slate-400">Primary Defense Mechanism</label>
                <GenerateSuggestionButton
                  fieldName="primaryDefense"
                  fieldLabel="Primary Defense Mechanism"
                  currentValue={character.layer1Core.primaryDefense}
                  character={character}
                  step={3}
                  onApply={(val) =>
                    onChange({
                      layer1Core: { ...character.layer1Core, primaryDefense: val },
                    })
                  }
                />
              </div>
              <textarea
                rows={2}
                value={character.layer1Core.primaryDefense}
                onChange={(e) =>
                  onChange({
                    layer1Core: { ...character.layer1Core, primaryDefense: e.target.value },
                  })
                }
                placeholder="Compartmentalization, detachment, pre-emptive rejection, or sarcasm..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Layer 2 */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Layer 2 — Shadow / Persona / Self Tension</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="text-xs text-slate-400">Persona (Social / Sexual Face)</label>
                <GenerateSuggestionButton
                  fieldName="persona"
                  fieldLabel="Persona"
                  currentValue={character.layer2Shadow.persona}
                  character={character}
                  step={3}
                  onApply={(val) =>
                    onChange({
                      layer2Shadow: { ...character.layer2Shadow, persona: val },
                    })
                  }
                />
              </div>
              <textarea
                rows={2}
                value={character.layer2Shadow.persona}
                onChange={(e) =>
                  onChange({
                    layer2Shadow: { ...character.layer2Shadow, persona: e.target.value },
                  })
                }
                placeholder="e.g. Composed, unflappable, charismatic, or guarded protector..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="text-xs text-slate-400">Shadow (Hidden Receptivity / Shame / Softness)</label>
                <GenerateSuggestionButton
                  fieldName="shadow"
                  fieldLabel="Shadow"
                  currentValue={character.layer2Shadow.shadow}
                  character={character}
                  step={3}
                  onApply={(val) =>
                    onChange({
                      layer2Shadow: { ...character.layer2Shadow, shadow: val },
                    })
                  }
                />
              </div>
              <textarea
                rows={2}
                value={character.layer2Shadow.shadow}
                onChange={(e) =>
                  onChange({
                    layer2Shadow: { ...character.layer2Shadow, shadow: e.target.value },
                  })
                }
                placeholder="e.g. Longing to surrender control, deep somatic hunger, or fear of emotional exposure..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
