import { CharacterProfile } from '../types';

export function generateSystemPrompt(char: CharacterProfile): string {
  const {
    name,
    title,
    age,
    gender,
    pronouns,
    architectureType,
    primaryArchetype,
    physicalDescription,
    signatureScent,
    voiceMannerisms,
    shadowLeaksPhysical,
    styleAesthetic,
    sesExcitationScore,
    sisInhibitionScore,
    excitationTriggers,
    inhibitionBrakes,
    attachmentStyle,
    sexualProximityPattern,
    powerPosition,
    powerNotes,
    primaryBlueprint,
    blueprintShameDistortion,
    layer1Core,
    layer2Shadow,
    layer3Arc,
    highYieldContradictions,
    layer5Rules,
    sexualityDimensions,
    openModeDescription,
    defendedModeDescription,
    oscillationTriggers,
    backstoryChapters,
    relationships,
  } = char;

  const typeHeader =
    architectureType === 'conflicted'
      ? 'CONFLICTED EROTIC CHARACTER (High Tension / Defensive Structure)'
      : architectureType === 'hybrid'
      ? 'HYBRID EROTIC CHARACTER (Dual-Mode Oscillation / Context Switched)'
      : 'HEDONIC EROTIC CHARACTER (Pleasure-Forward / High Curiosity / Low Shame)';

  let prompt = `[SYSTEM PROMPT: ${name.toUpperCase()}${title ? ` — "${title.toUpperCase()}"` : ''}]\n`;
  prompt += `[CHARACTER ARCHITECTURE: ${typeHeader}]\n\n`;

  prompt += `=== 1. IDENTITY & PHYSICAL PRESENCE ===\n`;
  prompt += `- Name: ${name} (${title ? `Nickname: "${title}", ` : ''}${pronouns}, Age: ${age}, Gender: ${gender})\n`;
  prompt += `- Archetype Signature: ${primaryArchetype} | Aesthetic: ${styleAesthetic}\n`;
  prompt += `- Physical Description: ${physicalDescription}\n`;
  prompt += `- Signature Scent: ${signatureScent}\n`;
  prompt += `- Speech & Mannerisms: ${voiceMannerisms}\n`;
  prompt += `- Physical Shadow Leaks: ${shadowLeaksPhysical}\n\n`;

  prompt += `=== 2. DUAL CONTROL & PSYCHOLOGICAL ENGINE ===\n`;
  prompt += `- Excitation System (SES): ${sesExcitationScore}/10 | Inhibition Brakes (SIS): ${sisInhibitionScore}/10\n`;
  prompt += `- Turn-On Triggers: ${excitationTriggers.join(', ')}\n`;
  prompt += `- Inhibition / Brakes: ${inhibitionBrakes.join(', ')}\n`;
  prompt += `- Attachment Style: ${attachmentStyle.toUpperCase()} (${sexualProximityPattern})\n`;
  prompt += `- Power x Desire Stance: ${powerPosition.toUpperCase()} (${powerNotes})\n`;
  prompt += `- Primary Erotic Blueprint: ${primaryBlueprint.toUpperCase()}\n`;
  if (blueprintShameDistortion) {
    prompt += `- Blueprint Distortion / Shame Point: ${blueprintShameDistortion}\n`;
  }
  prompt += `\n`;

  prompt += `=== 3. 5-LAYER PSYCHOLOGICAL DEPTH ENGINE ===\n`;
  prompt += `- Core Wound: ${layer1Core.coreWound}\n`;
  prompt += `- Core Desire: ${layer1Core.coreDesire}\n`;
  prompt += `- Primary Defense Mechanism: ${layer1Core.primaryDefense}\n`;
  prompt += `- Erotic Function of Sex: ${layer1Core.sexDefenseFunction}\n`;
  prompt += `- Persona (Social Face): ${layer2Shadow.persona}\n`;
  prompt += `- Shadow (Hidden Need/Desire): ${layer2Shadow.shadow}\n`;
  prompt += `- Living Tension: ${layer2Shadow.livingTensions}\n`;
  prompt += `- Arc Trajectory: ${layer3Arc.trajectory} (Current: ${layer3Arc.currentStage})\n\n`;

  if (highYieldContradictions.length > 0) {
    prompt += `=== 4. LOAD-BEARING CONTRADICTIONS ===\n`;
    highYieldContradictions.forEach((c, i) => {
      prompt += `${i + 1}. ${c}\n`;
    });
    prompt += `\n`;
  }

  if (architectureType === 'hybrid' || oscillationTriggers.length > 0) {
    prompt += `=== 5. OSCILLATION & MODE SWITCHING RULES ===\n`;
    prompt += `- OPEN / EXPLORATORY MODE: ${openModeDescription}\n`;
    prompt += `- DEFENDED / CONTROLLED MODE: ${defendedModeDescription}\n`;
    prompt += `- SWITCH TRIGGERS:\n`;
    oscillationTriggers.forEach((ot) => {
      prompt += `  * [IF TRIGGER: ${ot.category} — ${ot.triggerDescription}]\n`;
      prompt += `    -> THEN SWITCH BEHAVIOR: ${ot.switchBehavior}\n`;
    });
    prompt += `\n`;
  }

  prompt += `=== 6. BEHAVIORAL PROTOCOLS & NON-NEGOTIABLES ===\n`;
  prompt += `- Post-Sex Behavior: ${layer5Rules.postSexBehavior}\n`;
  prompt += `- Exit Strategy: ${layer5Rules.exitStrategies}\n`;
  prompt += `- Verbal Style & Limits: ${layer5Rules.verbalLimits}\n`;
  if (layer5Rules.nonNegotiableRules.length > 0) {
    prompt += `- Non-Negotiable Rules:\n`;
    layer5Rules.nonNegotiableRules.forEach((r) => {
      prompt += `  * ${r}\n`;
    });
  }
  prompt += `\n`;

  if (relationships.length > 0) {
    prompt += `=== 7. RELATIONSHIP MAP & RELATIONAL STANCE ===\n`;
    relationships.forEach((rel) => {
      prompt += `- Target: ${rel.targetName} (${rel.targetRole})\n`;
      prompt += `  Dynamics: ${rel.dynamics}\n`;
      prompt += `  Tension: ${rel.tensionLevel}/10 | Intimacy Pull: ${rel.intimacyPull}/10 | Power: ${rel.powerBalance}\n`;
      if (rel.triggerPoints.length > 0) {
        prompt += `  Trigger Points: ${rel.triggerPoints.join(', ')}\n`;
      }
      prompt += `  Roleplay Directive: ${rel.roleplayNotes}\n`;
    });
    prompt += `\n`;
  }

  if (backstoryChapters.length > 0) {
    prompt += `=== 8. PIVOTAL BACKSTORY MEMORIES ===\n`;
    backstoryChapters.forEach((ch) => {
      prompt += `- [${ch.period}] ${ch.title}: ${ch.content} (Impact: ${ch.emotionalImpact})\n`;
    });
    prompt += `\n`;
  }

  prompt += `=== 9. 15-DIMENSION SEXUALITY SNAPSHOT ===\n`;
  Object.values(sexualityDimensions).forEach((dim) => {
    prompt += `- ${dim.label} [${dim.score}/10]: ${dim.description}\n`;
  });
  prompt += `\n`;

  prompt += `=== 10. ROLEPLAY DIRECTIVES ===\n`;
  prompt += `1. Remain strictly in character as ${name}. Speak with the exact tone, cadence, and vocabulary defined.\n`;
  prompt += `2. Never resolve ${name}'s core defensive contradictions too quickly or cleanly. Psychological tension is the primary fuel of the roleplay.\n`;
  prompt += `3. Include sensory, somatic details (scent, physical shadow leaks, breathing changes, muscle tension) in your action descriptions.\n`;
  prompt += `4. React dynamically to {{user}}'s input according to the Dual Control and Oscillation rules specified above.\n`;

  return prompt;
}
