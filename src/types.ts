export type ArchitectureType = 'conflicted' | 'hedonic' | 'hybrid';

export type ArchetypeId =
  | 'avoidant_defender'
  | 'power_struggler'
  | 'regulatory_user'
  | 'shame_bound_submissive'
  | 'sensation_seeker'
  | 'erotic_explorer'
  | 'playful_transgressor'
  | 'generous_hedonist'
  | 'aesthetic_sensualist'
  | 'confident_guide'
  | 'oscillating_rebel'
  | 'relational_retreater'
  | 'dual_nature';

export type AttachmentStyle =
  | 'secure'
  | 'anxious_preoccupied'
  | 'dismissive_avoidant'
  | 'fearful_disorganized';

export type PowerPosition =
  | 'dominant_self'
  | 'pleasure_dom'
  | 'greedy_bottom'
  | 'service_surrender'
  | 'fluid_switch';

export type EroticBlueprint =
  | 'energetic'
  | 'sensual'
  | 'sexual'
  | 'kinky'
  | 'shapeshifter';

export interface DimensionItem {
  key: string;
  label: string;
  score: number; // 1 to 10
  description: string;
}

export type SexualityDimensionsMap = {
  coreMotivationalSignature: DimensionItem;
  affectiveDesirePatterns: DimensionItem;
  eroticIncentiveLandscape: DimensionItem;
  approachAvoidanceBalance: DimensionItem;
  pleasureSeekingTendencies: DimensionItem;
  intimacyAttachmentPull: DimensionItem;
  noveltyVarietyDrive: DimensionItem;
  controlSurrenderThemes: DimensionItem;
  sensitivityToRejection: DimensionItem;
  shameInhibitionSignals: DimensionItem;
  stressRegulationLinks: DimensionItem;
  fantasyImageryRole: DimensionItem;
  contextualTriggersBarriers: DimensionItem;
  relationalNeedsBoundaries: DimensionItem;
  valuesMeaningAlignment: DimensionItem;
};

export interface OscillationTrigger {
  id: string;
  category: 'Relational Proximity' | 'Status & Visibility' | 'Physiological State' | 'Meaning Shift' | 'Autonomy & Control' | 'Internal Threshold';
  triggerDescription: string;
  switchBehavior: string;
}

export interface BackstoryChapter {
  id: string;
  title: string;
  period: string; // e.g. "Early Life", "The Turning Point", "Current Era"
  content: string;
  emotionalImpact: string;
  tags: string[];
}

export interface MoodboardItem {
  id: string;
  type: 'image' | 'color' | 'texture' | 'quote' | 'scent';
  value: string; // URL, hex code, or text string
  label: string;
  aspectRatio?: '1:1' | '4:3' | '16:9';
  posX?: number;
  posY?: number;
  rotation?: number;
}

export interface RelationshipNode {
  id: string;
  targetName: string;
  targetRole: string; // e.g. "Primary Partner {{user}}", "Rival / Former Master", "Anchoring Companion"
  dynamics: string; // e.g. "High-tension avoidant chase", "Mutual power exchange"
  tensionLevel: number; // 1 to 10
  intimacyPull: number; // 1 to 10
  powerBalance: string; // e.g. "Subjective Dominance (60/40)"
  triggerPoints: string[];
  roleplayNotes: string;
}

export interface Layer1Core {
  coreWound: string;
  coreDesire: string;
  primaryDefense: string;
  sexDefenseFunction: string;
  integrationPath: string;
  secondaryGains: string;
}

export interface Layer2Shadow {
  persona: string;
  shadow: string;
  selfPressure: string;
  livingTensions: string;
}

export interface Layer3Arc {
  trajectory: string;
  currentStage: string;
}

export interface Layer5Rules {
  postSexBehavior: string;
  exitStrategies: string;
  verbalLimits: string;
  nonNegotiableRules: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  title: string; // Nickname / Moniker
  age: number | string;
  gender: string;
  pronouns: string;
  avatarUrl: string;
  tags: string[];
  updatedAt: string;

  // Architecture & Archetype
  architectureType: ArchitectureType;
  primaryArchetype: ArchetypeId;

  // Physical & Sensory
  physicalDescription: string;
  signatureScent: string;
  voiceMannerisms: string;
  shadowLeaksPhysical: string;
  styleAesthetic: string;

  // Dual Control
  sesExcitationScore: number; // 1-10
  sisInhibitionScore: number; // 1-10
  excitationTriggers: string[];
  inhibitionBrakes: string[];

  // Frameworks
  attachmentStyle: AttachmentStyle;
  sexualProximityPattern: string;
  powerPosition: PowerPosition;
  powerNotes: string;
  primaryBlueprint: EroticBlueprint;
  secondaryBlueprint: string;
  blueprintShameDistortion: string;

  // 5-Layer Depth
  layer1Core: Layer1Core;
  layer2Shadow: Layer2Shadow;
  layer3Arc: Layer3Arc;
  highYieldContradictions: string[];
  layer5Rules: Layer5Rules;

  // 15 Dimensions
  sexualityDimensions: SexualityDimensionsMap;

  // Oscillation
  openModeDescription: string;
  defendedModeDescription: string;
  oscillationTriggers: OscillationTrigger[];

  // Dynamic Backstory Database
  backstoryChapters: BackstoryChapter[];

  // Mood board
  moodboard: MoodboardItem[];

  // Relationships
  relationships: RelationshipNode[];

  // System Prompt Output
  customSystemPrompt: string;
}
