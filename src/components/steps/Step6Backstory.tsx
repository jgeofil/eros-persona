import React, { useState } from 'react';
import { CharacterProfile, BackstoryChapter } from '../../types';
import { BookOpen, Plus, Trash2, Wand2, Tag, Calendar, Edit3, Check } from 'lucide-react';
import { GenerateSuggestionButton } from '../common/GenerateSuggestionButton';

interface Step6Props {
  character: CharacterProfile;
  onChange: (updated: Partial<CharacterProfile>) => void;
}

export const Step6Backstory: React.FC<Step6Props> = ({ character, onChange }) => {
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [content, setContent] = useState('');
  const [impact, setImpact] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [expandingIndex, setExpandingIndex] = useState<number | null>(null);

  const addChapter = () => {
    if (!title.trim() || !content.trim()) return;
    const newChapter: BackstoryChapter = {
      id: `bs_${Date.now()}`,
      title: title.trim(),
      period: period.trim() || 'Key Memory',
      content: content.trim(),
      emotionalImpact: impact.trim() || 'Forms core psychological structure.',
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onChange({
      backstoryChapters: [...character.backstoryChapters, newChapter],
    });

    setTitle('');
    setPeriod('');
    setContent('');
    setImpact('');
    setTagsStr('');
  };

  const removeChapter = (id: string) => {
    const updated = character.backstoryChapters.filter((ch) => ch.id !== id);
    onChange({ backstoryChapters: updated });
  };

  const expandWithAI = async (chapter: BackstoryChapter, index: number) => {
    setExpandingIndex(index);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'expand-backstory',
          character,
          prompt: `Expand the backstory memory chapter '${chapter.title}' (${chapter.period}): ${chapter.content}`,
        }),
      });
      const data = await res.json();
      if (data.result) {
        const updatedChapters = [...character.backstoryChapters];
        updatedChapters[index] = {
          ...chapter,
          content: data.result,
        };
        onChange({ backstoryChapters: updatedChapters });
      }
    } catch (err) {
      console.error('Failed to expand backstory with AI:', err);
    } finally {
      setExpandingIndex(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" /> Step 6 of 9
        </div>
        <h2 className="text-2xl font-black text-slate-100">Dynamic Backstory Chapter Database</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Store, tag, and organize complex character histories, pivotal formative memories, and erotic turning points that explain their present defenses.
        </p>
      </div>

      {/* Add New Chapter Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Add Backstory Memory Chapter</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Chapter Title *</label>
              <GenerateSuggestionButton
                fieldName="backstoryTitle"
                fieldLabel="Chapter Title"
                currentValue={title}
                character={character}
                step={6}
                context="Formative erotic or psychological memory title"
                onApply={(val) => setTitle(val)}
              />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Turning Point, Midnight in Berlin, The Awakening"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Time Period / Era</label>
              <GenerateSuggestionButton
                fieldName="backstoryPeriod"
                fieldLabel="Time Period / Era"
                currentValue={period}
                character={character}
                step={6}
                context="Memory Era or Age"
                onApply={(val) => setPeriod(val)}
              />
            </div>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. Age 17, College Era, 3 Years Ago"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="text-xs font-semibold text-slate-400">Memory Narrative & Event Details *</label>
            <GenerateSuggestionButton
              fieldName="backstoryContent"
              fieldLabel="Memory Narrative"
              currentValue={content}
              character={character}
              step={6}
              context={`Chapter: ${title || 'Formative Memory'}, Period: ${period || 'Past'}`}
              onApply={(val) => setContent(val)}
            />
          </div>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the narrative details of this pivotal chapter..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Psychological & Erotic Impact</label>
              <GenerateSuggestionButton
                fieldName="backstoryImpact"
                fieldLabel="Psychological & Erotic Impact"
                currentValue={impact}
                character={character}
                step={6}
                context={`Narrative: ${content ? content.slice(0, 100) : 'Pivotal scene'}`}
                onApply={(val) => setImpact(val)}
              />
            </div>
            <input
              type="text"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="e.g. Forged their impenetrable emotional shield and obsession with control."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="text-xs font-semibold text-slate-400">Tags (Comma-separated)</label>
              <GenerateSuggestionButton
                fieldName="backstoryTags"
                fieldLabel="Backstory Tags"
                currentValue={tagsStr}
                character={character}
                step={6}
                context="Memory thematic tags"
                onApply={(val) => setTagsStr(val)}
              />
            </div>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="Origin, Trust, Kink, Betrayal"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={addChapter}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Save Chapter to Database</span>
          </button>
        </div>
      </div>

      {/* Chapters Database View */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Stored Backstory Chapters ({character.backstoryChapters.length})</h3>

        {character.backstoryChapters.map((ch, index) => (
          <div key={ch.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                  {ch.period}
                </span>
                <h4 className="text-sm font-bold text-slate-100">{ch.title}</h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => expandWithAI(ch, index)}
                  disabled={expandingIndex === index}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-medium border border-purple-500/40 cursor-pointer disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>{expandingIndex === index ? 'Expanding...' : 'AI Expand'}</span>
                </button>

                <button
                  onClick={() => removeChapter(ch.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{ch.content}</p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>
                <strong className="text-amber-400">Emotional Impact:</strong> {ch.emotionalImpact}
              </span>

              <div className="flex flex-wrap gap-1">
                {ch.tags.map((t, i) => (
                  <span key={i} className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
