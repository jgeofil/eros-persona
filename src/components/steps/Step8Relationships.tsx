import React, { useState } from 'react';
import { CharacterProfile, RelationshipNode } from '../../types';
import { Users, Plus, Trash2, HeartHandshake, ShieldAlert, Zap, Sparkles } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';
import { filterCharacterForStep } from '../../utils/aiContextFilter';

interface Step8Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step8Relationships: React.FC<Step8Props> = ({ character, onChange }) => {
  const [targetName, setTargetName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [dynamics, setDynamics] = useState('');
  const [tensionLevel, setTensionLevel] = useState<number>(8);
  const [intimacyPull, setIntimacyPull] = useState<number>(7);
  const [powerBalance, setPowerBalance] = useState('');
  const [roleplayNotes, setRoleplayNotes] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const handleAISuggestRelationship = async () => {
    setLoadingAI(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'autofill-step-8',
          character: filterCharacterForStep(character, 8),
        }),
      });
      const data = await res.json();
      if (data.result) {
        const jsonText = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonText);
        const newRel: RelationshipNode = {
          id: `rel_${Date.now()}`,
          targetName: parsed.targetName || '{{user}}',
          targetRole: parsed.targetRole || 'Primary Partner',
          dynamics: parsed.dynamics || 'High-tension approach-avoidance.',
          tensionLevel: parsed.tensionLevel || 8,
          intimacyPull: parsed.intimacyPull || 7,
          powerBalance: parsed.powerBalance || 'Dynamic Equilibrium',
          triggerPoints: parsed.triggerPoints || [],
          roleplayNotes: parsed.roleplayNotes || 'Maintain heavy subtext.',
        };

        onChange({
          relationships: [...character.relationships, newRel],
        });
        setAiMessage(`Added AI-generated relationship dynamics node for ${newRel.targetName}!`);
        setTimeout(() => setAiMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to generate relationship:', err);
      setAiMessage('Failed to generate AI suggestion. Check API key.');
      setTimeout(() => setAiMessage(null), 4000);
    } finally {
      setLoadingAI(false);
    }
  };

  const addRelationship = () => {
    if (!targetName.trim()) return;
    const newRel: RelationshipNode = {
      id: `rel_${Date.now()}`,
      targetName: targetName.trim(),
      targetRole: targetRole.trim() || 'Partner',
      dynamics: dynamics.trim() || 'Complex relational pull',
      tensionLevel,
      intimacyPull,
      powerBalance: powerBalance.trim() || 'Dynamic Equilibrium',
      triggerPoints: [],
      roleplayNotes: roleplayNotes.trim() || 'Maintain high psychological subtext during scenes.',
    };

    onChange({
      relationships: [...character.relationships, newRel],
    });

    setTargetName('');
    setTargetRole('');
    setDynamics('');
    setPowerBalance('');
    setRoleplayNotes('');
  };

  const removeRelationship = (id: string) => {
    const updated = character.relationships.filter((r) => r.id !== id);
    onChange({ relationships: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Step 8 of 9
          </div>
          <h2 className="text-2xl font-black text-slate-100">Interactive Relationship Tracking</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Track power dynamics, erotic tension metrics, intimacy pull, and roleplay directives between {character.name} and key partners (including {"{{user}}"}).
          </p>
        </div>

        <button
          onClick={handleAISuggestRelationship}
          disabled={loadingAI}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow disabled:opacity-50 whitespace-nowrap self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loadingAI ? 'Generating Dynamics...' : 'AI Auto-Suggest {{user}} Dynamics'}</span>
        </button>
      </div>

      {aiMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
          ✓ {aiMessage}
        </div>
      )}

      {/* Add New Relationship */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Track New Partner / Relational Link</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Partner Name / Identifier *</label>
              <GenerateSuggestionButton
                fieldName="relationshipTargetName"
                fieldLabel="Partner Name / Identifier"
                currentValue={targetName}
                character={character}
                step={8}
                context="Partner or counterpart name"
                prompt="Suggest a partner name (e.g. '{{user}}' or a provocative NPC name)"
                onApply={(val) => setTargetName(val)}
              />
            </div>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g. {{user}} or Soren Brandt"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Relational Role</label>
              <GenerateSuggestionButton
                fieldName="relationshipTargetRole"
                fieldLabel="Relational Role"
                currentValue={targetRole}
                character={character}
                step={8}
                context={`Partner: ${targetName || 'counterpart'}`}
                onApply={(val) => setTargetRole(val)}
              />
            </div>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Intensely Intriguing New Partner / Muse"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-rose-300">Erotic Tension Level</label>
              <span className="text-xs font-mono font-bold text-rose-400">{tensionLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={tensionLevel}
              onChange={(e) => setTensionLevel(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-purple-300">Intimacy & Attachment Pull</label>
              <span className="text-xs font-mono font-bold text-purple-400">{intimacyPull}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intimacyPull}
              onChange={(e) => setIntimacyPull(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="text-xs font-semibold text-slate-400">Dynamics Summary</label>
            <GenerateSuggestionButton
              fieldName="relationshipDynamics"
              fieldLabel="Dynamics Summary"
              currentValue={dynamics}
              character={character}
              step={8}
              context={`Partner: ${targetName || 'counterpart'} (${targetRole || 'Role'}), Tension: ${tensionLevel}/10, Intimacy: ${intimacyPull}/10`}
              onApply={(val) => setDynamics(val)}
            />
          </div>
          <input
            type="text"
            value={dynamics}
            onChange={(e) => setDynamics(e.target.value)}
            placeholder="e.g. High-tension approach-avoidance; unexpressed longing masked by sharp wit..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="text-xs font-semibold text-slate-400">Power Balance Description</label>
            <GenerateSuggestionButton
              fieldName="relationshipPowerBalance"
              fieldLabel="Power Balance Description"
              currentValue={powerBalance}
              character={character}
              step={8}
              context={`Partner: ${targetName || 'counterpart'}, Dynamics: ${dynamics || 'Tension'}`}
              onApply={(val) => setPowerBalance(val)}
            />
          </div>
          <input
            type="text"
            value={powerBalance}
            onChange={(e) => setPowerBalance(e.target.value)}
            placeholder="e.g. Dynamic Equilibrium (one holds formal control while the other holds emotional leverage)"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="text-xs font-semibold text-slate-400">Roleplay Directives & Subtext Notes</label>
            <GenerateSuggestionButton
              fieldName="relationshipRoleplayNotes"
              fieldLabel="Roleplay Directives"
              currentValue={roleplayNotes}
              character={character}
              step={8}
              context={`Directives for scenes with ${targetName || 'counterpart'}`}
              onApply={(val) => setRoleplayNotes(val)}
            />
          </div>
          <textarea
            rows={2}
            value={roleplayNotes}
            onChange={(e) => setRoleplayNotes(e.target.value)}
            placeholder="Specific directives for roleplay scenes involving this partner..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={addRelationship}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Track Relationship</span>
          </button>
        </div>
      </div>

      {/* Relationship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {character.relationships.map((rel) => (
          <div key={rel.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="text-sm font-bold text-slate-100">{rel.targetName}</h4>
                <p className="text-xs text-slate-400 italic">{rel.targetRole}</p>
              </div>

              <button
                onClick={() => removeRelationship(rel.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{rel.dynamics}</p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Erotic Tension</span>
                <span className="text-xs font-mono font-bold text-rose-400">{rel.tensionLevel}/10</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Intimacy Pull</span>
                <span className="text-xs font-mono font-bold text-purple-400">{rel.intimacyPull}/10</span>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              <strong className="text-slate-300 block mb-0.5">Power Balance:</strong>
              {rel.powerBalance}
            </div>

            <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
              <strong className="text-amber-400 block mb-0.5">Roleplay Directive:</strong>
              {rel.roleplayNotes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
