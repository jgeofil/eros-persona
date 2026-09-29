import React, { useState } from 'react';
import { CharacterProfile, ArchitectureType, ArchetypeId } from '../../types';
import { Compass, Flame, ShieldAlert, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';
import { filterCharacterForStep } from '../../utils/aiContextFilter';

interface Step1Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step1Architecture: React.FC<Step1Props> = ({ character, onChange }) => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [q1, setQ1] = useState<number>(5); // Heat source: 1 = pure conflict/shame, 10 = pure pleasure/curiosity
  const [q2, setQ2] = useState<number>(5); // Oscillation: 1 = static mode, 10 = frequent mode switching
  const [q3, setQ3] = useState<number>(5); // Brakes: 1 = high brakes/shame, 10 = low brakes/uninhibited
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const genderOptions = ['Female', 'Male', 'Non-Binary', 'Transgender', 'Agender', 'Genderfluid'];
  const pronounOptions = ['she/her', 'he/him', 'they/them', 'ze/zir'];

  const handleAIAutoSuggest = async () => {
    setLoadingAI(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'autofill-step-1',
          character: filterCharacterForStep(character, 1),
          prompt: `Generate an intriguing identity for a ${character.gender || 'diverse'} character with ${character.architectureType || 'hybrid'} sexual affect.`,
        }),
      });
      const data = await res.json();
      if (data.result) {
        // Strip code fences if present
        const jsonText = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonText);
        onChange({
          name: parsed.name || character.name,
          title: parsed.title || character.title,
          age: parsed.age || character.age,
          gender: parsed.gender || character.gender,
          pronouns: parsed.pronouns || character.pronouns,
          tags: parsed.tags || character.tags,
          architectureType: parsed.architectureType || character.architectureType,
          primaryArchetype: parsed.primaryArchetype || character.primaryArchetype,
        });
        setAiMessage('Applied AI Architecture & Identity updates to profile!');
        setTimeout(() => setAiMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to auto-suggest Step 1:', err);
      setAiMessage('Failed to generate AI suggestion. Please check API key.');
      setTimeout(() => setAiMessage(null), 4000);
    } finally {
      setLoadingAI(false);
    }
  };

  const applyDiagnosticResult = () => {
    let recType: ArchitectureType = 'hybrid';
    if (q1 <= 4 && q3 <= 5) {
      recType = 'conflicted';
    } else if (q1 >= 7 && q3 >= 6) {
      recType = 'hedonic';
    } else {
      recType = 'hybrid';
    }

    onChange({ architectureType: recType });
    setShowDiagnostic(false);
  };

  const getArchetypesForType = (type: ArchitectureType): { id: ArchetypeId; name: string; desc: string }[] => {
    switch (type) {
      case 'conflicted':
        return [
          { id: 'avoidant_defender', name: 'Avoidant Defender', desc: 'Passionate in scene work, retreats cold when emotional vulnerability threatens.' },
          { id: 'power_struggler', name: 'Power Struggler', desc: 'Uses dominance defensively to protect against neediness and surrender.' },
          { id: 'regulatory_user', name: 'Regulatory User', desc: 'Uses sex as an emotional container and stress release valve.' },
          { id: 'shame_bound_submissive', name: 'Shame-Bound Submissive', desc: 'Craves surrender, but struggles with post-orgasm guilt.' },
        ];
      case 'hybrid':
        return [
          { id: 'oscillating_rebel', name: 'Oscillating Rebel', desc: 'Moves rapidly between intense intimacy and sudden artistic or physical withdrawal.' },
          { id: 'relational_retreater', name: 'Relational Retreater', desc: 'Open and warm with casual partners; guarded with those who matter.' },
          { id: 'dual_nature', name: 'Dual Nature', desc: 'Holds authentic pleasure appetite alongside deep protective boundaries.' },
        ];
      case 'hedonic':
        return [
          { id: 'aesthetic_sensualist', name: 'Aesthetic Sensualist', desc: 'Elevates explicit acts into rich sensory and atmospheric art.' },
          { id: 'sensation_seeker', name: 'Sensation Seeker', desc: 'Driven by high intensity, variety, and physical restlessness.' },
          { id: 'erotic_explorer', name: 'Erotic Explorer', desc: 'Curious mapper of pleasure; skilled at warming hesitant partners.' },
          { id: 'playful_transgressor', name: 'Playful Transgressor', desc: 'Mischievous rule-breaker making taboo feel conspiratorial and fun.' },
          { id: 'generous_hedonist', name: 'Generous Hedonist', desc: 'Turned on by partner pleasure; attentive, inventive, high stamina.' },
          { id: 'confident_guide', name: 'Confident Guide', desc: 'Experienced, reassuring guide who expands boundaries smoothly.' },
        ];
    }
  };

  const currentArchetypes = getArchetypesForType(character.architectureType);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" /> Step 1 of 9
          </div>
          <h2 className="text-2xl font-black text-slate-100">Architecture Orientation & Archetype</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Select the primary motivational engine. Does the heat come from internal conflict and defense (Conflicted), rapid mode switching (Hybrid), or uninhibited pleasure exploration (Hedonic)?
          </p>
        </div>

        <button
          onClick={() => setShowDiagnostic(!showDiagnostic)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>Quick Diagnostic Quiz</span>
        </button>
      </div>

      {/* Diagnostic Helper Drawer */}
      {showDiagnostic && (
        <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" /> Quick Architecture Diagnostic
            </h3>
            <button
              onClick={() => setShowDiagnostic(false)}
              className="text-xs text-purple-400 hover:text-purple-200"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="text-xs font-medium text-slate-300 flex justify-between">
                <span>Primary Heat Source</span>
                <span className="text-rose-400 font-bold">{q1 <= 4 ? 'Conflict & Shame' : q1 >= 7 ? 'Appetite & Curiosity' : 'Balanced'}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={q1}
                onChange={(e) => setQ1(Number(e.target.value))}
                className="w-full mt-2 accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 flex justify-between">
                <span>Mode Oscillation</span>
                <span className="text-amber-400 font-bold">{q2 <= 4 ? 'Consistent Register' : 'Frequent Mode Switch'}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={q2}
                onChange={(e) => setQ2(Number(e.target.value))}
                className="w-full mt-2 accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 flex justify-between">
                <span>Sexual Brakes (SIS)</span>
                <span className="text-purple-400 font-bold">{q3 <= 4 ? 'High Inhibition / Rules' : 'Low Brakes / Free'}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={q3}
                onChange={(e) => setQ3(Number(e.target.value))}
                className="w-full mt-2 accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={applyDiagnosticResult}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Apply Recommended Architecture
            </button>
          </div>
        </div>
      )}

      {/* Basic Identity Inputs */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200">Basic Character Identity & Gender Metadata</h3>
          
          <button
            onClick={handleAIAutoSuggest}
            disabled={loadingAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{loadingAI ? 'Generating Concept...' : 'AI Auto-Suggest Identity'}</span>
          </button>
        </div>

        {aiMessage && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
            ✓ {aiMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Character Name *</label>
              <GenerateSuggestionButton
                fieldName="name"
                fieldLabel="Character Name"
                currentValue={character.name}
                character={character}
                step={1}
                onApply={(val) => onChange({ name: val })}
              />
            </div>
            <input
              type="text"
              value={character.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Julian, Nadia, Soren, Elena"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Nickname</label>
              <GenerateSuggestionButton
                fieldName="title"
                fieldLabel="Nickname"
                currentValue={character.title}
                character={character}
                step={1}
                onApply={(val) => onChange({ title: val })}
              />
            </div>
            <input
              type="text"
              value={character.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. The Boss, Siren, Fox, The Shadow"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Age</label>
              <GenerateSuggestionButton
                fieldName="age"
                fieldLabel="Age"
                currentValue={character.age}
                character={character}
                step={1}
                onApply={(val) => onChange({ age: parseInt(val, 10) || 30 })}
              />
            </div>
            <input
              type="text"
              value={character.age}
              onChange={(e) => onChange({ age: e.target.value })}
              placeholder="Age (e.g. 28)"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Gender *</label>
            <input
              type="text"
              value={character.gender}
              onChange={(e) => onChange({ gender: e.target.value })}
              placeholder="e.g. Female, Non-Binary, Male"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 mb-1.5"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1">
              {genderOptions.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChange({ gender: g })}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    character.gender === g
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Pronouns *</label>
            <input
              type="text"
              value={character.pronouns}
              onChange={(e) => onChange({ pronouns: e.target.value })}
              placeholder="e.g. she/her, they/them, he/him"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 mb-1.5"
            />
            <div className="flex flex-wrap gap-1">
              {pronounOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange({ pronouns: p })}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    character.pronouns === p
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Tags / Descriptors (Comma separated)</label>
              <GenerateSuggestionButton
                fieldName="tags"
                fieldLabel="Character Tags"
                currentValue={character.tags.join(', ')}
                character={character}
                step={1}
                onApply={(val) => {
                  const items = val.split(',').map((t) => t.trim()).filter(Boolean);
                  onChange({ tags: items });
                }}
              />
            </div>
            <input
              type="text"
              value={character.tags.join(', ')}
              onChange={(e) =>
                onChange({
                  tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                })
              }
              placeholder="Conflicted, Femme Fatale, High Power, Sapphic"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
        </div>
      </div>

      {/* 3 Main Architecture Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">Select Core Architecture Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Conflicted Card */}
          <div
            onClick={() => onChange({ architectureType: 'conflicted' })}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              character.architectureType === 'conflicted'
                ? 'bg-rose-950/30 border-rose-500 shadow-xl shadow-rose-950/40 ring-1 ring-rose-500/50'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-semibold">
                  Skill: conflicted
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100">Conflicted Erotic</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Heat emerges from internal conflict, shame, avoidance, and power struggles. Uses sex for emotional regulation or control.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-300 font-medium">
              Signature: High Excitation + High Inhibition Brakes
            </div>
          </div>

          {/* Hybrid Card */}
          <div
            onClick={() => onChange({ architectureType: 'hybrid' })}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              character.architectureType === 'hybrid'
                ? 'bg-amber-950/30 border-amber-500 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/50'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <RefreshCw className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
                  Skill: hybrid
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100">Hybrid Erotic</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Contains both authentic pleasure appetite AND defensive boundaries. Moves dynamically between Open Mode and Defended Mode via oscillation triggers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300 font-medium">
              Signature: Dual-Mode Trigger Switch Rules
            </div>
          </div>

          {/* Hedonic Card */}
          <div
            onClick={() => onChange({ architectureType: 'hedonic' })}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              character.architectureType === 'hedonic'
                ? 'bg-emerald-950/30 border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Flame className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  Skill: hedonic
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100">Hedonic Erotic</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pleasure-forward, novelty-seeking, low shame. Treats taboo as shared play and discovery rather than conflict or threat.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-300 font-medium">
              Signature: High Excitation + Low Brakes
            </div>
          </div>
        </div>
      </div>

      {/* Specific Archetype Selection */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">
          Select Primary Archetype ({character.architectureType.toUpperCase()})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentArchetypes.map((arch) => {
            const isSelected = character.primaryArchetype === arch.id;
            return (
              <div
                key={arch.id}
                onClick={() => onChange({ primaryArchetype: arch.id })}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-950/20 border-rose-500/60 text-slate-100 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  {arch.name}
                  {isSelected && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">{arch.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
