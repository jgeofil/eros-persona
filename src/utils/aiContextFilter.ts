import { CharacterProfile, SexualityDimensionsMap } from '../types';

export const FIELD_STEP_MAP: Record<string, number> = {
  // Step 1
  name: 1,
  title: 1,
  age: 1,
  gender: 1,
  pronouns: 1,
  tags: 1,
  architectureType: 1,
  primaryArchetype: 1,

  // Step 2
  avatarUrl: 2,
  physicalDescription: 2,
  signatureScent: 2,
  styleAesthetic: 2,
  voiceMannerisms: 2,
  shadowLeaksPhysical: 2,

  // Step 3
  sesExcitationScore: 3,
  sisInhibitionScore: 3,
  excitationTrigger: 3,
  excitationTriggers: 3,
  inhibitionBrake: 3,
  inhibitionBrakes: 3,
  attachmentStyle: 3,
  sexualProximityPattern: 3,
  powerPosition: 3,
  powerNotes: 3,
  primaryBlueprint: 3,
  secondaryBlueprint: 3,
  blueprintShameDistortion: 3,
  coreWound: 3,
  coreDesire: 3,
  primaryDefense: 3,
  persona: 3,
  shadow: 3,
  layer1Core: 3,
  layer2Shadow: 3,

  // Step 4
  sexualityDimensions: 4,

  // Step 5
  openModeDescription: 5,
  defendedModeDescription: 5,
  contradiction: 5,
  highYieldContradictions: 5,
  oscillationTriggerIf: 5,
  oscillationSwitchThen: 5,
  oscillationTriggers: 5,
  postSexBehavior: 5,
  exitStrategies: 5,
  verbalLimits: 5,
  nonNegotiableRule: 5,
  layer5Rules: 5,

  // Step 6
  backstoryTitle: 6,
  backstoryPeriod: 6,
  backstoryContent: 6,
  backstoryImpact: 6,
  backstoryTags: 6,
  backstoryChapters: 6,

  // Step 7
  moodboardLabel: 7,
  moodboardValue: 7,
  moodboard: 7,

  // Step 8
  relationshipTargetName: 8,
  relationshipTargetRole: 8,
  relationshipDynamics: 8,
  relationshipPowerBalance: 8,
  relationshipRoleplayNotes: 8,
  relationships: 8,

  // Step 9
  customSystemPrompt: 9,
};

export function getTargetStepForField(fieldName?: string, explicitStep?: number): number {
  if (explicitStep && explicitStep >= 1 && explicitStep <= 9) {
    return explicitStep;
  }
  if (!fieldName) return 9;
  if (fieldName.startsWith('dimension_')) return 4;
  return FIELD_STEP_MAP[fieldName] || 9;
}

/**
 * Filters the character context so that:
 * 1. ONLY fields belonging to steps <= targetStep are included.
 * 2. Unreached tabs are NEVER included.
 * 3. Empty fields or placeholder boilerplate are completely omitted.
 * 4. The field currently being suggested is excluded so it doesn't anchor the suggestion.
 */
export function filterCharacterForStep(
  character: CharacterProfile | undefined | null,
  targetStep: number,
  targetFieldName?: string
): Record<string, any> {
  if (!character) return {};

  const clean: Record<string, any> = {};

  // Step 1: Identity & Architecture
  if (targetStep >= 1) {
    if (character.gender && character.gender !== 'Unspecified') clean.gender = character.gender;
    if (character.pronouns) clean.pronouns = character.pronouns;
    if (character.architectureType) clean.architectureType = character.architectureType;
    if (character.primaryArchetype) clean.primaryArchetype = character.primaryArchetype;
    if (character.name && character.name !== 'New Character' && targetFieldName !== 'name') {
      clean.name = character.name;
    }
    if (character.title && character.title !== 'Archetype Title' && character.title !== 'Nickname' && character.title.trim() !== '' && targetFieldName !== 'title') {
      clean.nickname = character.title.trim();
    }
    if (character.age && targetFieldName !== 'age') clean.age = character.age;
    if (character.tags && character.tags.length > 0 && targetFieldName !== 'tags') {
      clean.tags = character.tags;
    }
  }

  // Step 2: Appearance & Physical Traits
  if (targetStep >= 2) {
    if (character.physicalDescription?.trim() && targetFieldName !== 'physicalDescription') {
      clean.physicalDescription = character.physicalDescription.trim();
    }
    if (character.signatureScent?.trim() && targetFieldName !== 'signatureScent') {
      clean.signatureScent = character.signatureScent.trim();
    }
    if (character.styleAesthetic?.trim() && targetFieldName !== 'styleAesthetic') {
      clean.styleAesthetic = character.styleAesthetic.trim();
    }
    if (character.voiceMannerisms?.trim() && targetFieldName !== 'voiceMannerisms') {
      clean.voiceMannerisms = character.voiceMannerisms.trim();
    }
    if (character.shadowLeaksPhysical?.trim() && targetFieldName !== 'shadowLeaksPhysical') {
      clean.shadowLeaksPhysical = character.shadowLeaksPhysical.trim();
    }
  }

  // Step 3: Psychological Frameworks & 5-Layer Engine
  if (targetStep >= 3) {
    if (character.attachmentStyle) clean.attachmentStyle = character.attachmentStyle;
    if (character.powerPosition) clean.powerPosition = character.powerPosition;
    if (character.primaryBlueprint) clean.primaryBlueprint = character.primaryBlueprint;
    if (character.sesExcitationScore) clean.sesExcitationScore = character.sesExcitationScore;
    if (character.sisInhibitionScore) clean.sisInhibitionScore = character.sisInhibitionScore;
    if (character.excitationTriggers?.length) clean.excitationTriggers = character.excitationTriggers;
    if (character.inhibitionBrakes?.length) clean.inhibitionBrakes = character.inhibitionBrakes;

    if (character.sexualProximityPattern?.trim() && targetFieldName !== 'sexualProximityPattern') {
      clean.sexualProximityPattern = character.sexualProximityPattern.trim();
    }
    if (character.powerNotes?.trim() && targetFieldName !== 'powerNotes') {
      clean.powerNotes = character.powerNotes.trim();
    }
    if (character.blueprintShameDistortion?.trim() && targetFieldName !== 'blueprintShameDistortion') {
      clean.blueprintShameDistortion = character.blueprintShameDistortion.trim();
    }

    // 5-Layer depth: only include non-empty values
    if (character.layer1Core) {
      const core: Record<string, string> = {};
      if (character.layer1Core.coreWound?.trim() && targetFieldName !== 'coreWound') {
        core.coreWound = character.layer1Core.coreWound.trim();
      }
      if (character.layer1Core.coreDesire?.trim() && targetFieldName !== 'coreDesire') {
        core.coreDesire = character.layer1Core.coreDesire.trim();
      }
      if (character.layer1Core.primaryDefense?.trim() && targetFieldName !== 'primaryDefense') {
        core.primaryDefense = character.layer1Core.primaryDefense.trim();
      }
      if (Object.keys(core).length > 0) clean.layer1Core = core;
    }

    if (character.layer2Shadow) {
      const shadow: Record<string, string> = {};
      if (character.layer2Shadow.persona?.trim() && targetFieldName !== 'persona') {
        shadow.persona = character.layer2Shadow.persona.trim();
      }
      if (character.layer2Shadow.shadow?.trim() && targetFieldName !== 'shadow') {
        shadow.shadow = character.layer2Shadow.shadow.trim();
      }
      if (Object.keys(shadow).length > 0) clean.layer2Shadow = shadow;
    }
  }

  // Step 4: 15 Dimensions
  if (targetStep >= 4 && character.sexualityDimensions) {
    const populatedDims: Record<string, { score: number; description: string }> = {};
    for (const [k, v] of Object.entries(character.sexualityDimensions)) {
      if (v?.description && v.description.trim().length > 0 && targetFieldName !== `dimension_${k}`) {
        populatedDims[k] = { score: v.score, description: v.description.trim() };
      }
    }
    if (Object.keys(populatedDims).length > 0) {
      clean.sexualityDimensions = populatedDims;
    }
  }

  // Step 5: Behavioral Rules & Contradictions
  if (targetStep >= 5) {
    if (character.openModeDescription?.trim() && targetFieldName !== 'openModeDescription') {
      clean.openModeDescription = character.openModeDescription.trim();
    }
    if (character.defendedModeDescription?.trim() && targetFieldName !== 'defendedModeDescription') {
      clean.defendedModeDescription = character.defendedModeDescription.trim();
    }
    if (character.highYieldContradictions && character.highYieldContradictions.length > 0) {
      clean.highYieldContradictions = character.highYieldContradictions;
    }
    if (character.oscillationTriggers && character.oscillationTriggers.length > 0) {
      clean.oscillationTriggers = character.oscillationTriggers;
    }
    if (character.layer5Rules) {
      const rules: Record<string, any> = {};
      if (character.layer5Rules.postSexBehavior?.trim() && targetFieldName !== 'postSexBehavior') {
        rules.postSexBehavior = character.layer5Rules.postSexBehavior.trim();
      }
      if (character.layer5Rules.exitStrategies?.trim() && targetFieldName !== 'exitStrategies') {
        rules.exitStrategies = character.layer5Rules.exitStrategies.trim();
      }
      if (character.layer5Rules.verbalLimits?.trim() && targetFieldName !== 'verbalLimits') {
        rules.verbalLimits = character.layer5Rules.verbalLimits.trim();
      }
      if (character.layer5Rules.nonNegotiableRules?.length) {
        rules.nonNegotiableRules = character.layer5Rules.nonNegotiableRules;
      }
      if (Object.keys(rules).length > 0) clean.layer5Rules = rules;
    }
  }

  // Step 6: Backstory Chapters
  if (targetStep >= 6 && character.backstoryChapters && character.backstoryChapters.length > 0) {
    clean.backstoryChapters = character.backstoryChapters.map((ch) => ({
      title: ch.title,
      period: ch.period,
      content: ch.content,
      impact: ch.emotionalImpact,
    }));
  }

  // Step 7: Moodboard
  if (targetStep >= 7 && character.moodboard && character.moodboard.length > 0) {
    clean.moodboard = character.moodboard.map((m) => ({
      type: m.type,
      label: m.label,
      value: m.value,
    }));
  }

  // Step 8: Relationships
  if (targetStep >= 8 && character.relationships && character.relationships.length > 0) {
    clean.relationships = character.relationships.map((r) => ({
      targetName: r.targetName,
      targetRole: r.targetRole,
      dynamics: r.dynamics,
      tensionLevel: r.tensionLevel,
      powerBalance: r.powerBalance,
    }));
  }

  return clean;
}
