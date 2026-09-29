import React, { useState, useEffect } from 'react';
import { CharacterProfile } from './types';
import {
  getStoredCharacters,
  saveCharacters,
  getActiveCharacterId,
  setActiveCharacterId as saveActiveCharacterId,
} from './utils/storage';
import { createDefault15Dimensions, createEmpty15Dimensions, sampleCharacters } from './data/sampleCharacters';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { CharacterListModal } from './components/CharacterListModal';
import { AICoArchitectModal } from './components/AICoArchitectModal';

import { Step1Architecture } from './components/steps/Step1Architecture';
import { Step2Appearance } from './components/steps/Step2Appearance';
import { Step3Frameworks } from './components/steps/Step3Frameworks';
import { Step4Dimensions } from './components/steps/Step4Dimensions';
import { Step5Behavior } from './components/steps/Step5Behavior';
import { Step6Backstory } from './components/steps/Step6Backstory';
import { Step7Moodboard } from './components/steps/Step7Moodboard';
import { Step8Relationships } from './components/steps/Step8Relationships';
import { Step9SystemPrompt } from './components/steps/Step9SystemPrompt';

import { ArrowLeft, ArrowRight, Save, Sparkles } from 'lucide-react';

export default function App() {
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Modals
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const list = getStoredCharacters();
    setCharacters(list);

    const initialActiveId = getActiveCharacterId();
    if (list.some((c) => c.id === initialActiveId)) {
      setActiveId(initialActiveId);
    } else if (list.length > 0) {
      setActiveId(list[0].id);
    }
  }, []);

  // Sync to storage when characters state updates
  const updateCharactersState = (newList: CharacterProfile[]) => {
    setCharacters(newList);
    saveCharacters(newList);
  };

  const handleSelectCharacter = (id: string) => {
    setActiveId(id);
    saveActiveCharacterId(id);
  };

  const activeCharacter =
    characters.find((c) => c.id === activeId) || characters[0] || sampleCharacters[0];

  const handleUpdateActiveCharacter = (updatedFields: Partial<CharacterProfile>) => {
    if (!activeCharacter) return;
    const updatedChar: CharacterProfile = {
      ...activeCharacter,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    const newList = characters.map((c) => (c.id === activeCharacter.id ? updatedChar : c));
    updateCharactersState(newList);
  };

  const handleNewCharacter = () => {
    const newChar: CharacterProfile = {
      id: `char_${Date.now()}`,
      name: '',
      title: '',
      age: 18,
      gender: '',
      pronouns: '',
      avatarUrl: '',
      tags: [],
      updatedAt: new Date().toISOString(),

      architectureType: 'conflicted',
      primaryArchetype: 'avoidant_defender',

      physicalDescription: '',
      signatureScent: '',
      voiceMannerisms: '',
      shadowLeaksPhysical: '',
      styleAesthetic: '',

      sesExcitationScore: 5,
      sisInhibitionScore: 5,
      excitationTriggers: [],
      inhibitionBrakes: [],

      attachmentStyle: 'dismissive_avoidant',
      sexualProximityPattern: '',
      powerPosition: 'dominant_self',
      powerNotes: '',
      primaryBlueprint: 'kinky',
      secondaryBlueprint: 'sensual',
      blueprintShameDistortion: '',

      layer1Core: {
        coreWound: '',
        coreDesire: '',
        primaryDefense: '',
        sexDefenseFunction: '',
        integrationPath: '',
        secondaryGains: '',
      },
      layer2Shadow: {
        persona: '',
        shadow: '',
        selfPressure: '',
        livingTensions: '',
      },
      layer3Arc: {
        trajectory: '',
        currentStage: '',
      },
      highYieldContradictions: [],
      layer5Rules: {
        postSexBehavior: '',
        exitStrategies: '',
        verbalLimits: '',
        nonNegotiableRules: [],
      },

      sexualityDimensions: createEmpty15Dimensions(),

      openModeDescription: '',
      defendedModeDescription: '',
      oscillationTriggers: [],
      backstoryChapters: [],
      moodboard: [],
      relationships: [],
      customSystemPrompt: '',
    };

    const newList = [newChar, ...characters];
    updateCharactersState(newList);
    setActiveId(newChar.id);
    saveActiveCharacterId(newChar.id);
    setCurrentStep(1);
  };

  const handleDuplicateCharacter = (id: string) => {
    const source = characters.find((c) => c.id === id);
    if (!source) return;

    const clone: CharacterProfile = {
      ...JSON.parse(JSON.stringify(source)),
      id: `char_${Date.now()}`,
      name: `${source.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    };

    const newList = [clone, ...characters];
    updateCharactersState(newList);
    setActiveId(clone.id);
    saveActiveCharacterId(clone.id);
  };

  const handleDeleteCharacter = (id: string) => {
    if (characters.length <= 1) return;
    const newList = characters.filter((c) => c.id !== id);
    updateCharactersState(newList);
    if (activeId === id && newList.length > 0) {
      setActiveId(newList[0].id);
      saveActiveCharacterId(newList[0].id);
    }
  };

  const handleImportJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && parsed.name) {
        const importedChar: CharacterProfile = {
          ...parsed,
          id: `char_imp_${Date.now()}`,
          updatedAt: new Date().toISOString(),
          sexualityDimensions: parsed.sexualityDimensions || createDefault15Dimensions(),
          backstoryChapters: parsed.backstoryChapters || [],
          moodboard: parsed.moodboard || [],
          relationships: parsed.relationships || [],
          oscillationTriggers: parsed.oscillationTriggers || [],
          highYieldContradictions: parsed.highYieldContradictions || [],
        };

        const newList = [importedChar, ...characters];
        updateCharactersState(newList);
        setActiveId(importedChar.id);
        saveActiveCharacterId(importedChar.id);
        setIsLibraryOpen(false);
      }
    } catch (err) {
      console.error('Invalid JSON import:', err);
    }
  };

  const handleExportJSON = () => {
    if (!activeCharacter) return;
    const jsonStr = JSON.stringify(activeCharacter, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCharacter.name.toLowerCase().replace(/\s+/g, '_')}_profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Application Header */}
      <Header
        activeCharacter={activeCharacter}
        charactersList={characters}
        onSelectCharacter={handleSelectCharacter}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onNewCharacter={handleNewCharacter}
        onOpenAIModal={() => setIsAIOpen(true)}
        onExportJSON={handleExportJSON}
      />

      {/* Sticky 9-Step Process Bar */}
      <StepNavigation
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {currentStep === 1 && (
          <Step1Architecture
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {currentStep === 2 && (
          <Step2Appearance
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {currentStep === 3 && (
          <Step3Frameworks
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {currentStep === 4 && (
          <Step4Dimensions
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {currentStep === 5 && (
          <Step5Behavior
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {currentStep === 6 && (
          <Step6Backstory
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {currentStep === 7 && (
          <Step7Moodboard
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {currentStep === 8 && (
          <Step8Relationships
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {currentStep === 9 && (
          <Step9SystemPrompt
            character={activeCharacter}
            onChange={handleUpdateActiveCharacter}
          />
        )}

        {/* Bottom Step Pagination Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous Step
          </button>

          <span className="text-xs text-slate-500 font-mono">
            Step {currentStep} of 9
          </span>

          <button
            onClick={() => setCurrentStep((prev) => Math.min(9, prev + 1))}
            disabled={currentStep === 9}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-colors shadow-md shadow-rose-950/40"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Database Library Modal */}
      <CharacterListModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        characters={characters}
        activeCharacterId={activeCharacter.id}
        onSelectCharacter={handleSelectCharacter}
        onCreateNew={handleNewCharacter}
        onDuplicateCharacter={handleDuplicateCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        onImportJSON={handleImportJSON}
      />

      {/* AI Assistant Co-Architect Modal */}
      <AICoArchitectModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        character={activeCharacter}
        onUpdateCharacter={handleUpdateActiveCharacter}
      />
    </div>
  );
}
