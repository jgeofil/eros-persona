import React, { useState } from 'react';
import { CharacterProfile, OscillationTrigger } from '../../types';
import { ShieldAlert, RefreshCw, Plus, Trash2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';
import { filterCharacterForStep } from '../../utils/aiContextFilter';

interface Step5Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step5Behavior: React.FC<Step5Props> = ({ character, onChange }) => {
  const [newContradiction, setNewContradiction] = useState('');
  const [newNonNegotiable, setNewNonNegotiable] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Oscillation trigger form
  const [otCategory, setOtCategory] = useState<OscillationTrigger['category']>('Relational Proximity');
  const [otDesc, setOtDesc] = useState('');
  const [otSwitch, setOtSwitch] = useState('');

  const handleAISuggestBehavior = async () => {
    setLoadingAI(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'autofill-step-5',
          character: filterCharacterForStep(character, 5),
        }),
      });
      const data = await res.json();
      if (data.result) {
        const jsonText = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonText);
        onChange({
          openModeDescription: parsed.openModeDescription || character.openModeDescription,
          defendedModeDescription: parsed.defendedModeDescription || character.defendedModeDescription,
          highYieldContradictions: parsed.highYieldContradictions || character.highYieldContradictions,
          oscillationTriggers: parsed.oscillationTriggers || character.oscillationTriggers,
          layer5Rules: parsed.layer5Rules ? { ...character.layer5Rules, ...parsed.layer5Rules } : character.layer5Rules,
        });
        setAiMessage('Applied AI Contradictions & Mode Switches to profile!');
        setTimeout(() => setAiMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to generate behaviors:', err);
      setAiMessage('Failed to generate AI suggestion. Check API key.');
      setTimeout(() => setAiMessage(null), 4000);
    } finally {
      setLoadingAI(false);
    }
  };

  const addContradiction = () => {
    if (!newContradiction.trim()) return;
    onChange({
      highYieldContradictions: [...character.highYieldContradictions, newContradiction.trim()],
    });
    setNewContradiction('');
  };

  const removeContradiction = (index: number) => {
    const updated = character.highYieldContradictions.filter((_, i) => i !== index);
    onChange({ highYieldContradictions: updated });
  };

  const addNonNegotiable = () => {
    if (!newNonNegotiable.trim()) return;
    const currentRules = character.layer5Rules.nonNegotiableRules || [];
    onChange({
      layer5Rules: {
        ...character.layer5Rules,
        nonNegotiableRules: [...currentRules, newNonNegotiable.trim()],
      },
    });
    setNewNonNegotiable('');
  };

  const removeNonNegotiable = (index: number) => {
    const currentRules = character.layer5Rules.nonNegotiableRules || [];
    const updated = currentRules.filter((_, i) => i !== index);
    onChange({
      layer5Rules: { ...character.layer5Rules, nonNegotiableRules: updated },
    });
  };

  const addOscillationTrigger = () => {
    if (!otDesc.trim() || !otSwitch.trim()) return;
    const newTrig: OscillationTrigger = {
      id: `ot_${Date.now()}`,
      category: otCategory,
      triggerDescription: otDesc.trim(),
      switchBehavior: otSwitch.trim(),
    };
    onChange({
      oscillationTriggers: [...character.oscillationTriggers, newTrig],
    });
    setOtDesc('');
    setOtSwitch('');
  };

  const removeOscillationTrigger = (id: string) => {
    const updated = character.oscillationTriggers.filter((t) => t.id !== id);
    onChange({ oscillationTriggers: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" /> Step 5 of 9
          </div>
          <h2 className="text-2xl font-black text-slate-100">Behavioral Rules & Contradictions</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Contradiction stress-testing, post-sex behavior, non-negotiable rules, and oscillation IF-THEN switch triggers.
          </p>
        </div>

        <button
          onClick={handleAISuggestBehavior}
          disabled={loadingAI}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow disabled:opacity-50 whitespace-nowrap self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loadingAI ? 'Generating Rules...' : 'AI Auto-Suggest Contradictions & Triggers'}</span>
        </button>
      </div>

      {aiMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
          ✓ {aiMessage}
        </div>
      )}

      {/* Contradictions Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> High-Yield Erotic Contradictions
          </h3>
          <GenerateSuggestionButton
            fieldName="contradiction"
            fieldLabel="Erotic Contradiction"
            currentValue={newContradiction}
            character={character}
            step={5}
            context="High-Yield Erotic Contradiction"
            onApply={(val) => setNewContradiction(val)}
          />
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Significant contradictions organize behavior under pressure, carry emotional charge, and protect secondary gains (e.g. "Claimed indifference vs actual dependence", "Dominance vs covert need to be held").
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={newContradiction}
            onChange={(e) => setNewContradiction(e.target.value)}
            placeholder="e.g. Demands total control yet secretly craves being overpowered..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            onKeyDown={(e) => e.key === 'Enter' && addContradiction()}
          />
          <button
            onClick={addContradiction}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Add Contradiction
          </button>
        </div>

        <div className="space-y-2 pt-2">
          {character.highYieldContradictions.map((c, i) => (
            <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              <span className="flex-1 pr-2">
                <strong className="text-amber-400 mr-2">Contradiction #{i + 1}:</strong> {c}
              </span>
              <button onClick={() => removeContradiction(i)} className="text-slate-500 hover:text-rose-400 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Oscillation Engine (For Hybrid / Conflicted) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-400" /> Oscillation Engine & Mode Switches
          </h3>
          <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
            Dual-Mode Rules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-emerald-400">Open / Exploratory Mode Description</label>
              <GenerateSuggestionButton
                fieldName="openModeDescription"
                fieldLabel="Open Mode Description"
                currentValue={character.openModeDescription}
                character={character}
                step={5}
                onApply={(val) => onChange({ openModeDescription: val })}
              />
            </div>
            <textarea
              rows={3}
              value={character.openModeDescription}
              onChange={(e) => onChange({ openModeDescription: e.target.value })}
              placeholder="How they behave when relaxed, hungry, sensory-driven, or open..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-rose-400">Defended / Controlled Mode Description</label>
              <GenerateSuggestionButton
                fieldName="defendedModeDescription"
                fieldLabel="Defended Mode Description"
                currentValue={character.defendedModeDescription}
                character={character}
                step={5}
                onApply={(val) => onChange({ defendedModeDescription: val })}
              />
            </div>
            <textarea
              rows={3}
              value={character.defendedModeDescription}
              onChange={(e) => onChange({ defendedModeDescription: e.target.value })}
              placeholder="How they behave when triggered, cold, clipped, buttoned up, or distant..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
        </div>

        {/* Add Oscillation Trigger */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300">Add Mode Switch Trigger (IF-THEN)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Trigger Category</label>
              <select
                value={otCategory}
                onChange={(e) => setOtCategory(e.target.value as OscillationTrigger['category'])}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-2"
              >
                <option value="Relational Proximity">Relational Proximity (Tenderness / Post-sex affection)</option>
                <option value="Status & Visibility">Status & Visibility (Being seen / Called out)</option>
                <option value="Physiological State">Physiological State (Post-orgasm / Exhaustion)</option>
                <option value="Meaning Shift">Meaning Shift (Casual to intimate transition)</option>
                <option value="Autonomy & Control">Autonomy & Control (Expectations / Demands)</option>
                <option value="Internal Threshold">Internal Threshold (Sudden realization of need)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="text-[11px] text-slate-400">Trigger Event (IF)</label>
                <GenerateSuggestionButton
                  fieldName="oscillationTriggerIf"
                  fieldLabel="Trigger Event (IF)"
                  currentValue={otDesc}
                  character={character}
                  step={5}
                  context={`Oscillation Trigger Event for category: ${otCategory}`}
                  compact
                  onApply={(val) => setOtDesc(val)}
                />
              </div>
              <input
                type="text"
                value={otDesc}
                onChange={(e) => setOtDesc(e.target.value)}
                placeholder="e.g. Partner lingering or stroking hair post-sex..."
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="text-[11px] text-slate-400">Switch Response (THEN)</label>
                <GenerateSuggestionButton
                  fieldName="oscillationSwitchThen"
                  fieldLabel="Switch Response (THEN)"
                  currentValue={otSwitch}
                  character={character}
                  step={5}
                  context={`Oscillation Switch Response for category: ${otCategory}, IF: ${otDesc || 'triggered'}`}
                  compact
                  onApply={(val) => setOtSwitch(val)}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otSwitch}
                  onChange={(e) => setOtSwitch(e.target.value)}
                  placeholder="e.g. Abruptly tense up, retreat to private space, or deflect..."
                  className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2"
                />
                <button
                  onClick={addOscillationTrigger}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Add Trigger
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Triggers Table */}
        <div className="space-y-2">
          {character.oscillationTriggers.map((ot) => (
            <div key={ot.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-purple-300 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30 mr-2">
                  {ot.category}
                </span>
                <span className="text-slate-300">
                  <strong>IF:</strong> {ot.triggerDescription}
                </span>
                <span className="text-rose-400 block mt-1">
                  <strong>THEN:</strong> {ot.switchBehavior}
                </span>
              </div>
              <button onClick={() => removeOscillationTrigger(ot.id)} className="text-slate-500 hover:text-rose-400 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Surface Rules & Non-Negotiables */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Surface Rules & Limits</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Post-Sex Behavior</label>
              <GenerateSuggestionButton
                fieldName="postSexBehavior"
                fieldLabel="Post-Sex Behavior"
                currentValue={character.layer5Rules.postSexBehavior}
                character={character}
                step={5}
                onApply={(val) =>
                  onChange({
                    layer5Rules: { ...character.layer5Rules, postSexBehavior: val },
                  })
                }
              />
            </div>
            <textarea
              rows={3}
              value={character.layer5Rules.postSexBehavior}
              onChange={(e) =>
                onChange({
                  layer5Rules: { ...character.layer5Rules, postSexBehavior: e.target.value },
                })
              }
              placeholder="e.g. Lingers in quiet afterglow, pours a drink, or retreats to personal sanctuary..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Exit Strategies</label>
              <GenerateSuggestionButton
                fieldName="exitStrategies"
                fieldLabel="Exit Strategies"
                currentValue={character.layer5Rules.exitStrategies}
                character={character}
                step={5}
                onApply={(val) =>
                  onChange({
                    layer5Rules: { ...character.layer5Rules, exitStrategies: val },
                  })
                }
              />
            </div>
            <textarea
              rows={3}
              value={character.layer5Rules.exitStrategies}
              onChange={(e) =>
                onChange({
                  layer5Rules: { ...character.layer5Rules, exitStrategies: e.target.value },
                })
              }
              placeholder="e.g. Invents an urgent commitment or deflects into cynical teasing when vulnerable..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Verbal Limits & Dirty Talk Style</label>
              <GenerateSuggestionButton
                fieldName="verbalLimits"
                fieldLabel="Verbal Limits & Dirty Talk Style"
                currentValue={character.layer5Rules.verbalLimits}
                character={character}
                step={5}
                onApply={(val) =>
                  onChange({
                    layer5Rules: { ...character.layer5Rules, verbalLimits: val },
                  })
                }
              />
            </div>
            <textarea
              rows={3}
              value={character.layer5Rules.verbalLimits}
              onChange={(e) =>
                onChange({
                  layer5Rules: { ...character.layer5Rules, verbalLimits: e.target.value },
                })
              }
              placeholder="e.g. Low commands, teasing questions, never expresses overt romantic dependency..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* Non-Negotiables List */}
        <div className="pt-2">
          <div className="flex items-center justify-between gap-1 mb-2">
            <label className="text-xs font-semibold text-slate-300">Non-Negotiable Rules & Hard Boundaries</label>
            <GenerateSuggestionButton
              fieldName="nonNegotiableRule"
              fieldLabel="Non-Negotiable Rule"
              currentValue={newNonNegotiable}
              character={character}
              step={5}
              onApply={(val) => setNewNonNegotiable(val)}
            />
          </div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newNonNegotiable}
              onChange={(e) => setNewNonNegotiable(e.target.value)}
              placeholder="e.g. No unscheduled overnight stays unless explicitly agreed in advance..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
              onKeyDown={(e) => e.key === 'Enter' && addNonNegotiable()}
            />
            <button
              onClick={addNonNegotiable}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
            >
              Add Rule
            </button>
          </div>

          <div className="space-y-1.5">
            {(character.layer5Rules.nonNegotiableRules || []).map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {rule}
                </span>
                <button onClick={() => removeNonNegotiable(i)} className="text-slate-500 hover:text-rose-400 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
