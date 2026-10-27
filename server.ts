import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const FIELD_STEP_MAP: Record<string, number> = {
  name: 1, title: 1, nickname: 1, age: 1, gender: 1, pronouns: 1, tags: 1, architectureType: 1, primaryArchetype: 1,
  avatarUrl: 2, physicalDescription: 2, signatureScent: 2, styleAesthetic: 2, voiceMannerisms: 2, shadowLeaksPhysical: 2,
  sesExcitationScore: 3, sisInhibitionScore: 3, excitationTrigger: 3, excitationTriggers: 3,
  inhibitionBrake: 3, inhibitionBrakes: 3, attachmentStyle: 3, sexualProximityPattern: 3,
  powerPosition: 3, powerNotes: 3, primaryBlueprint: 3, secondaryBlueprint: 3,
  blueprintShameDistortion: 3, coreWound: 3, coreDesire: 3, primaryDefense: 3, persona: 3, shadow: 3,
  layer1Core: 3, layer2Shadow: 3,
  sexualityDimensions: 4,
  openModeDescription: 5, defendedModeDescription: 5, contradiction: 5, highYieldContradictions: 5,
  oscillationTriggerIf: 5, oscillationSwitchThen: 5, oscillationTriggers: 5,
  postSexBehavior: 5, exitStrategies: 5, verbalLimits: 5, nonNegotiableRule: 5, layer5Rules: 5,
  backstoryTitle: 6, backstoryPeriod: 6, backstoryContent: 6, backstoryImpact: 6, backstoryTags: 6, backstoryChapters: 6,
  moodboardLabel: 7, moodboardValue: 7, moodboard: 7,
  relationshipTargetName: 8, relationshipTargetRole: 8, relationshipDynamics: 8,
  relationshipPowerBalance: 8, relationshipRoleplayNotes: 8, relationships: 8,
  customSystemPrompt: 9,
};

function getFieldStep(fieldName?: string, explicitStep?: number): number {
  if (explicitStep && explicitStep >= 1 && explicitStep <= 9) return explicitStep;
  if (!fieldName) return 9;
  if (fieldName.startsWith('dimension_')) return 4;
  return FIELD_STEP_MAP[fieldName] || 9;
}

function cleanCharacterSummary(character: any, targetStep: number, targetFieldName?: string): Record<string, any> {
  if (!character) return {};
  const clean: Record<string, any> = {};

  const isNonEmpty = (v: any) => {
    if (v === undefined || v === null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.values(v).some(val => isNonEmpty(val));
    return true;
  };

  // Step 1: Identity & Profile
  if (targetStep >= 1) {
    if (character.gender && character.gender !== 'Unspecified' && character.gender !== '') {
      clean.gender = character.gender;
    }
    if (character.pronouns && character.pronouns.trim() !== '') clean.pronouns = character.pronouns;
    if (character.architectureType) clean.orientationType = character.architectureType;
    if (character.primaryArchetype) clean.primaryArchetype = character.primaryArchetype;
    if (character.name && character.name !== 'New Character' && character.name.trim() !== '' && targetFieldName !== 'name') {
      clean.name = character.name;
    }
    const nicknameVal = character.nickname || character.title;
    if (nicknameVal && nicknameVal !== 'Archetype Title' && nicknameVal !== 'Nickname' && nicknameVal.trim() !== '' && targetFieldName !== 'title' && targetFieldName !== 'nickname') {
      clean.nickname = nicknameVal.trim();
    }
    if (character.age && targetFieldName !== 'age') clean.age = character.age;
    if (character.tags && character.tags.length > 0 && targetFieldName !== 'tags') clean.tags = character.tags;
  }

  // Step 2
  if (targetStep >= 2) {
    if (isNonEmpty(character.physicalDescription) && targetFieldName !== 'physicalDescription') {
      clean.physicalDescription = character.physicalDescription.trim();
    }
    if (isNonEmpty(character.signatureScent) && targetFieldName !== 'signatureScent') {
      clean.signatureScent = character.signatureScent.trim();
    }
    if (isNonEmpty(character.styleAesthetic) && targetFieldName !== 'styleAesthetic') {
      clean.styleAesthetic = character.styleAesthetic.trim();
    }
    if (isNonEmpty(character.voiceMannerisms) && targetFieldName !== 'voiceMannerisms') {
      clean.voiceMannerisms = character.voiceMannerisms.trim();
    }
    if (isNonEmpty(character.shadowLeaksPhysical) && targetFieldName !== 'shadowLeaksPhysical') {
      clean.shadowLeaksPhysical = character.shadowLeaksPhysical.trim();
    }
  }

  // Step 3
  if (targetStep >= 3) {
    if (character.attachmentStyle) clean.attachmentStyle = character.attachmentStyle;
    if (character.powerPosition) clean.powerPosition = character.powerPosition;
    if (character.primaryBlueprint) clean.primaryBlueprint = character.primaryBlueprint;
    if (isNonEmpty(character.sexualProximityPattern) && targetFieldName !== 'sexualProximityPattern') {
      clean.sexualProximityPattern = character.sexualProximityPattern.trim();
    }
    if (isNonEmpty(character.powerNotes) && targetFieldName !== 'powerNotes') {
      clean.powerNotes = character.powerNotes.trim();
    }
    if (isNonEmpty(character.blueprintShameDistortion) && targetFieldName !== 'blueprintShameDistortion') {
      clean.blueprintShameDistortion = character.blueprintShameDistortion.trim();
    }
    if (character.layer1Core) {
      const core: Record<string, string> = {};
      if (character.layer1Core.coreWound?.trim() && targetFieldName !== 'coreWound') core.coreWound = character.layer1Core.coreWound.trim();
      if (character.layer1Core.coreDesire?.trim() && targetFieldName !== 'coreDesire') core.coreDesire = character.layer1Core.coreDesire.trim();
      if (character.layer1Core.primaryDefense?.trim() && targetFieldName !== 'primaryDefense') core.primaryDefense = character.layer1Core.primaryDefense.trim();
      if (Object.keys(core).length > 0) clean.layer1Core = core;
    }
    if (character.layer2Shadow) {
      const shadow: Record<string, string> = {};
      if (character.layer2Shadow.persona?.trim() && targetFieldName !== 'persona') shadow.persona = character.layer2Shadow.persona.trim();
      if (character.layer2Shadow.shadow?.trim() && targetFieldName !== 'shadow') shadow.shadow = character.layer2Shadow.shadow.trim();
      if (Object.keys(shadow).length > 0) clean.layer2Shadow = shadow;
    }
  }

  // Step 4
  if (targetStep >= 4 && character.sexualityDimensions) {
    const populatedDims: Record<string, any> = {};
    for (const [k, v] of Object.entries(character.sexualityDimensions as Record<string, any>)) {
      if (v?.description && v.description.trim().length > 0 && targetFieldName !== `dimension_${k}`) {
        populatedDims[k] = { score: v.score, description: v.description.trim() };
      }
    }
    if (Object.keys(populatedDims).length > 0) clean.sexualityDimensions = populatedDims;
  }

  // Step 5
  if (targetStep >= 5) {
    if (isNonEmpty(character.openModeDescription) && targetFieldName !== 'openModeDescription') {
      clean.openModeDescription = character.openModeDescription.trim();
    }
    if (isNonEmpty(character.defendedModeDescription) && targetFieldName !== 'defendedModeDescription') {
      clean.defendedModeDescription = character.defendedModeDescription.trim();
    }
    if (character.highYieldContradictions?.length && targetFieldName !== 'contradiction' && targetFieldName !== 'highYieldContradictions') {
      clean.highYieldContradictions = character.highYieldContradictions;
    }
    if (character.oscillationTriggers?.length && targetFieldName !== 'oscillationTriggerIf' && targetFieldName !== 'oscillationSwitchThen' && targetFieldName !== 'oscillationTriggers') {
      clean.oscillationTriggers = character.oscillationTriggers;
    }
    if (character.layer5Rules) {
      const rules: Record<string, any> = {};
      if (character.layer5Rules.postSexBehavior?.trim() && targetFieldName !== 'postSexBehavior') rules.postSexBehavior = character.layer5Rules.postSexBehavior.trim();
      if (character.layer5Rules.exitStrategies?.trim() && targetFieldName !== 'exitStrategies') rules.exitStrategies = character.layer5Rules.exitStrategies.trim();
      if (character.layer5Rules.verbalLimits?.trim() && targetFieldName !== 'verbalLimits') rules.verbalLimits = character.layer5Rules.verbalLimits.trim();
      if (character.layer5Rules.nonNegotiableRules?.length && targetFieldName !== 'nonNegotiableRule') rules.nonNegotiableRules = character.layer5Rules.nonNegotiableRules;
      if (Object.keys(rules).length > 0) clean.layer5Rules = rules;
    }
  }

  // Step 6
  if (targetStep >= 6 && !targetFieldName?.startsWith('backstory') && character.backstoryChapters?.length) {
    clean.backstoryChapters = character.backstoryChapters;
  }

  // Step 7
  if (targetStep >= 7 && !targetFieldName?.startsWith('moodboard') && character.moodboard?.length) {
    clean.moodboard = character.moodboard;
  }

  // Step 8
  if (targetStep >= 8 && !targetFieldName?.startsWith('relationship') && character.relationships?.length) {
    clean.relationships = character.relationships;
  }

  return clean;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Co-Architect Endpoint
app.post("/api/gemini/assist", async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured in environment secrets.",
      });
    }

    const { task, character, prompt, fieldName, fieldLabel, context, step } = req.body;

    const charName = (character?.name && character.name !== 'New Character' && character.name.trim() !== '' && fieldName !== 'name') ? character.name : 'the character';
    const charGender = (character?.gender && character.gender !== 'Unspecified' && character.gender.trim() !== '') ? character.gender : 'Unspecified';
    const charPronouns = (character?.pronouns && character.pronouns.trim() !== '') ? character.pronouns : 'they/them';

    let systemInstruction = `You are a master creative writing consultant and psychological profiler specializing in complex character design for roleplay and fiction.
You support character creation for ALL genders (Female, Male, Non-Binary, Transgender, Fluid) and ALL sexual orientations/dynamics.
Target Character Profile: Name: ${charName}, Gender: ${charGender}, Pronouns: ${charPronouns}.

Provide vivid, deeply psychological, uninhibited creative output without generic fluff or moralizing judgment. Always respect the character's specified gender (${charGender}) and pronouns (${charPronouns}). Maintain an elegant, sophisticated literary tone.

CRITICAL VOCABULARY AND THEMATIC RESTRICTION:
- Absolutely NEVER use the words "architect", "architecture", or "architectural" in your generated suggestions or descriptions.
- The character's profession or identity must NOT be an architect, designer of buildings, or related to architecture unless the user explicitly requested that specific job.`;

    let userPrompt = "";

    if (task === "autofill-step-1") {
      userPrompt = `Given the user concept below, generate core identity details for Step 1 (Identity & Psychological Profile).
Return a raw JSON object ONLY (no markdown fences, no extra text) with these fields:
{
  "name": "string",
  "title": "string (Character Nickname, e.g. 'The Boss', 'Fox', 'Siren')",
  "age": number,
  "gender": "string (e.g. Female, Male, Non-Binary, Transgender, Fluid)",
  "pronouns": "string (e.g. she/her, he/him, they/them, ze/zir)",
  "tags": ["string", "string"],
  "architectureType": "conflicted" | "hedonic" | "hybrid",
  "primaryArchetype": "avoidant_defender" | "oscillating_rebel" | "power_struggler" | "aesthetic_sensualist" | "boundary_pusher" | "dual_nature"
}

CRITICAL: Do NOT use the words "architect", "architecture", or "architectural" in the name, nickname, or tags.

User Prompt / Concept: ${prompt || "Generate a compelling new character concept with deep psychological tension."}
Current Character Context: ${JSON.stringify(cleanCharacterSummary(character, 1), null, 2)}`;
    } else if (task === "autofill-step-2") {
      userPrompt = `Given the character profile below, generate realistic and evocative physical and sensory details for Step 2 (Appearance & Sensory Profile).
Return a raw JSON object ONLY with these fields:
{
  "physicalDescription": "string (detailed 2-3 sentences covering height, build, eyes, hair, clothing style)",
  "signatureScent": "string (evocative blend of scents e.g. smoky cedar, black orchid, rain)",
  "voiceMannerisms": "string (vocal cadence, pitch, signature gestures when tense)",
  "shadowLeaksPhysical": "string (subtle somatic stress signals e.g. jaw clenching, knuckle gripping)",
  "styleAesthetic": "string (fashion aesthetic e.g. dark luxury, tailored velvet, effortless silk, leather)"
}

Character context: ${JSON.stringify(cleanCharacterSummary(character, 2), null, 2)}`;
    } else if (task === "autofill-step-3") {
      userPrompt = `Given the character profile below, generate Step 3 Psychological & Erotic Frameworks (Dual Control, Attachment, Power & Blueprints).
Return a raw JSON object ONLY with these fields:
{
  "sesExcitationScore": number (1 to 10),
  "sisInhibitionScore": number (1 to 10),
  "excitationTriggers": ["string", "string", "string"],
  "inhibitionBrakes": ["string", "string", "string"],
  "attachmentStyle": "dismissive_avoidant" | "anxious_preoccupied" | "fearful_disorganized" | "secure",
  "sexualProximityPattern": "string",
  "powerPosition": "dominant_self" | "submissive_yielding" | "fluid_switch" | "pleasure_dom" | "greedy_receiver",
  "powerNotes": "string",
  "primaryBlueprint": "energetic" | "sensual" | "sexual" | "kinky" | "shapeshifter",
  "secondaryBlueprint": "energetic" | "sensual" | "sexual" | "kinky" | "shapeshifter",
  "blueprintShameDistortion": "string",
  "layer1Core": {
    "coreWound": "string",
    "coreDesire": "string",
    "primaryDefense": "string",
    "sexDefenseFunction": "string",
    "integrationPath": "string",
    "secondaryGains": "string"
  },
  "layer2Shadow": {
    "persona": "string",
    "shadow": "string",
    "selfPressure": "string",
    "livingTensions": "string"
  }
}

Character context: ${JSON.stringify(cleanCharacterSummary(character, 3), null, 2)}`;
    } else if (task === "autofill-step-5") {
      userPrompt = `Given the character profile below, generate Step 5 Behavioral Choices & Oscillation Rules.
Return a raw JSON object ONLY with these fields:
{
  "openModeDescription": "string",
  "defendedModeDescription": "string",
  "highYieldContradictions": ["string", "string", "string"],
  "oscillationTriggers": [
    {
      "id": "ot_1",
      "category": "Relational Proximity" | "Status & Visibility" | "Physiological State" | "Meaning Shift" | "Autonomy & Control" | "Internal Thresholds",
      "triggerDescription": "string",
      "switchBehavior": "string"
    }
  ],
  "layer5Rules": {
    "postSexBehavior": "string",
    "exitStrategies": "string",
    "verbalLimits": "string",
    "nonNegotiableRules": ["string", "string"]
  }
}

Character context: ${JSON.stringify(cleanCharacterSummary(character, 5), null, 2)}`;
    } else if (task === "autofill-step-8") {
      userPrompt = `Given the character profile below, generate a new interactive relationship node with {{user}} for Step 8.
Return a raw JSON object ONLY with these fields:
{
  "targetName": "{{user}}",
  "targetRole": "string (e.g. Intriguing New Partner / Muse)",
  "dynamics": "string (high-tension dynamics description)",
  "tensionLevel": number (1-10),
  "intimacyPull": number (1-10),
  "powerBalance": "string",
  "triggerPoints": ["string", "string"],
  "roleplayNotes": "string (directives for roleplay scenes)"
}

Character context: ${JSON.stringify(cleanCharacterSummary(character, 8), null, 2)}`;
    } else if (task === "generate-15-dimensions") {
      userPrompt = `Given the character summary below, generate a 15-dimension sexuality profile. Return JSON with key 'dimensions' which is an object mapping each of these 15 keys to a concise 1-2 sentence description and an integer rating from 1 to 10:
Keys:
1. coreMotivationalSignature
2. affectiveDesirePatterns
3. eroticIncentiveLandscape
4. approachAvoidanceBalance
5. pleasureSeekingTendencies
6. intimacyAttachmentPull
7. noveltyVarietyDrive
8. controlSurrenderThemes
9. sensitivityToRejection
10. shameInhibitionSignals
11. stressRegulationLinks
12. fantasyImageryRole
13. contextualTriggersBarriers
14. relationalNeedsBoundaries
15. valuesMeaningAlignment

Character context: ${JSON.stringify(cleanCharacterSummary(character, 4), null, 2)}`;
    } else if (task === "deepen-contradictions") {
      userPrompt = `Analyze this character's psychological profile and suggest 3 high-yield, load-bearing erotic contradictions, shadow leaks, and defense mechanisms.
Character context: ${JSON.stringify(cleanCharacterSummary(character, 5), null, 2)}`;
    } else if (task === "expand-backstory") {
      userPrompt = `Write a compelling, evocative backstory chapter focusing on a pivotal erotic/psychological memory for this character: ${charName}.
Specific instruction: ${prompt || "Focus on the first moment their primary defense mechanism was tested or formed."}
Character context: ${JSON.stringify(cleanCharacterSummary(character, 6), null, 2)}`;
    } else if (task === "generate-system-prompt") {
      userPrompt = `Generate a complete, ready-to-use System Prompt for AI Roleplay / Writing for this character. Include:
- Physical appearance & signature scent
- Gender (${charGender}) & Pronouns (${charPronouns})
- Core personality & defensive architecture
- Relationship stance toward {{user}}
- Sexual style, pacing, and shutdown/exit triggers
- Speech patterns & mannerisms
- Oscillation triggers (if applicable) & IF-THEN switch rules
- Roleplay directives that preserve psychological tension
Character context: ${JSON.stringify(cleanCharacterSummary(character, 9), null, 2)}`;
    } else if (task === "suggest-moodboard") {
      userPrompt = `Suggest 5 evocative sensory mood board items for Step 7.
Return a raw JSON array ONLY with objects having:
{
  "type": "image" | "color" | "texture" | "quote" | "scent",
  "value": "string (URL for image, hex code for color, or text description)",
  "label": "string"
}
Character context: ${JSON.stringify(cleanCharacterSummary(character, 7), null, 2)}`;
    } else if (task === "suggest-field") {
      const targetStep = getFieldStep(fieldName, step);
      const targetLabel = fieldLabel || (fieldName === 'title' ? 'Nickname' : fieldName) || "profile field";
      const charSummary = cleanCharacterSummary(character, targetStep, fieldName);

      const hasContext = Object.keys(charSummary).length > 0;
      const contextText = hasContext
        ? JSON.stringify(charSummary, null, 2)
        : "(No prior attributes defined yet; starting fresh character concept)";

      userPrompt = `You are a master creative writing consultant providing a tailored suggestion for a specific character profile field: "${targetLabel}".

Target Character Context (established in preceding steps only):
${contextText}
${context ? `Field context/category: ${context}\n` : ""}
${prompt ? `Specific direction: ${prompt}\n` : ""}

Task:
Propose a single, compelling, psychologically vivid, uninhibited suggestion specifically for this field: "${targetLabel}".
- Base your proposal STRICTLY on the established character context provided above.
- Do NOT assume or hallucinate attributes, settings, or tropes from unreached tabs or unmentioned steps.

CRITICAL VOCABULARY AND THEMATIC RULES:
- Absolutely NEVER use the words "architect", "architecture", or "architectural".
- The character must NOT be an architect or building designer.
- Strictly adhere to the character's gender (${charGender}) and pronouns (${charPronouns}).

Strict Output Rules:
- Return ONLY the exact text/sentence(s) to be inserted directly into the input field.
- Do NOT wrap the output in quotes.
- Do NOT include labels, field names, or prefixes like "Suggestion:" or "Here is...".
- Do NOT use markdown fences, headers, or conversational preamble.
- For short text fields (Name, Nickname, Scent, Aesthetic, Tag, Trigger, Rule, Backstory Title), return a concise phrase or single line.
- For multi-line text areas (Descriptions, Wounds, Persona, Shadow, Dynamics, Backstory Narrative), return 1 to 3 evocative sentences.`;
    } else {
      userPrompt = prompt || `Analyze and enhance this character profile: ${JSON.stringify(character)}`;
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });
    } catch (primaryErr: any) {
      console.warn("Primary model error, falling back to gemini-3.1-flash-lite:", primaryErr?.message);
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.8,
          },
        });
      } catch (fallbackErr: any) {
        console.warn("Both models exhausted or errored, using smart fallback:", fallbackErr?.message);
        const fallbackText = getSmartFallback(task, fieldName, character);
        if (fallbackText) {
          return res.json({ result: fallbackText });
        }
        throw fallbackErr;
      }
    }

    const text = response.text || "";
    return res.json({ result: text });
  } catch (error: any) {
    console.error("Gemini assist error:", error);
    // If suggest-field task, return graceful fallback rather than 500
    if (req.body?.task === 'suggest-field') {
      const fallbackText = getSmartFallback('suggest-field', req.body?.fieldName, req.body?.character);
      if (fallbackText) {
        return res.json({ result: fallbackText });
      }
    }
    return res.status(500).json({ error: error?.message || "Failed to call AI service" });
  }
});

function getSmartFallback(task?: string, fieldName?: string, character?: any): string {
  const gender = (character?.gender || '').toLowerCase();
  const isFemale = gender.includes('fem') || gender.includes('woman') || gender.includes('she');
  const isMale = gender.includes('male') || gender.includes('man') || gender.includes('he');

  if (task === 'suggest-field') {
    switch (fieldName) {
      case 'name':
        return isFemale ? 'Elena Rostova' : isMale ? 'Julian Vance' : 'Rowan Sterling';
      case 'title':
        return isFemale ? 'The Velvet Siren' : isMale ? 'The Steel Executive' : 'The Chrome Phantom';
      case 'age':
        return '30';
      case 'tags':
        return 'High Power, Conflicted, Avoidant, Sensual, Dual Control';
      case 'signatureScent':
        return 'Smoky cedarwood, black pepper, warm amber, and crisp linen.';
      case 'styleAesthetic':
        return 'Dark luxury, tailored wool, silk slips, understated silver hardware, and heavy cashmere.';
      case 'physicalDescription':
        return 'Poised, commanding presence with razor-sharp gaze, sculpted posture, and effortless magnetic grace.';
      case 'voiceMannerisms':
        return 'Low, measured cadence with deliberate pauses; voice drops to a quiet, captivating murmur under emotional tension.';
      case 'shadowLeaksPhysical':
        return 'Jaw clenches almost imperceptibly when touched on the nape; knuckles turn white when fighting back intense physical desire.';
      case 'excitationTrigger':
        return 'Subtle defiance under pressure, atmospheric privacy, tactile restraint, and unexpected composure.';
      case 'inhibitionBrake':
        return 'Public exposure, neediness during non-intimate hours, and emotional probing immediately after climax.';
      case 'sexualProximityPattern':
        return 'Uses intense physical immersion to satisfy longing while fiercely guarding deeper emotional vulnerability.';
      case 'powerNotes':
        return 'Commands scenes with crisp psychological precision; covertly longs for an equal partner strong enough to make them yield.';
      case 'blueprintShameDistortion':
        return 'Frames surrender as dangerous weakness; relies on strict protocols to sanitize the longing to be possessed.';
      case 'coreWound':
        return 'Early betrayal and sudden loss of autonomy following unprotected emotional vulnerability.';
      case 'coreDesire':
        return 'Absolute emotional sanctuary and unwavering safety without having to defend boundaries.';
      case 'primaryDefense':
        return 'Emotional compartmentalization, extreme self-reliance, and preemptive detachment.';
      case 'persona':
        return 'Unflappable, composed, and untouchable professional who demands perfection.';
      case 'shadow':
        return 'A raw, desperate desire to be held, restricted, and relieved of the burden of always being in control.';
      case 'openModeDescription':
        return 'Relaxed, generous, sensory-driven, indulging in prolonged touch, fluid teasing, and magnetic focus.';
      case 'defendedModeDescription':
        return 'Analytical, coolly polite, emotionally clipped, and sharply focused on pragmatics.';
      case 'contradiction':
        return 'Claims absolute indifference to affection while secretly tracking their partner\'s slightest movements.';
      case 'oscillationTriggerIf':
        return 'Partner lingering or stroking hair post-sex with unmasked tenderness...';
      case 'oscillationSwitchThen':
        return 'Abruptly sit up, button shirt, pour a drink, and retreat into cynical emotional distance.';
      case 'postSexBehavior':
        return 'Lingers in quiet afterglow, pours a drink, and avoids immediate emotional probing.';
      case 'exitStrategies':
        return 'Creates urgent scheduling conflicts or adopts an analytical tone when conversations turn overly tender.';
      case 'verbalLimits':
        return 'Low commands and playful teasing; never says "I need you" or admits overt emotional dependence.';
      case 'nonNegotiableRule':
        return 'No unsolicited emotional pressure, strict mutual confidentiality, and absolute respect for personal space.';
      case 'backstoryTitle':
        return 'The Turning Point at Midnight';
      case 'backstoryPeriod':
        return 'Age 22, Formative Years';
      case 'backstoryContent':
        return 'A high-stakes encounter that tested their emotional resolve and permanently forged their defensive psychological armor.';
      case 'backstoryImpact':
        return 'Cemented an ironclad need for sovereignty and self-reliance in all subsequent intimacies.';
      case 'backstoryTags':
        return 'Origin, Sovereignty, Armor, Vulnerability';
      case 'relationshipTargetName':
        return '{{user}}';
      case 'relationshipTargetRole':
        return 'Intriguing New Partner / Muse';
      case 'relationshipDynamics':
        return 'High-tension approach-avoidance. Fierce intellectual and sensual friction with unspoken devotion.';
      case 'relationshipPowerBalance':
        return 'Dynamic Equilibrium (one holds formal control while the other holds emotional leverage)';
      case 'relationshipRoleplayNotes':
        return 'Maintain crisp psychological tension, unhurried pacing, and rich somatic detail throughout all interactions.';
      default:
        if (fieldName?.startsWith('dimension_')) {
          return 'Balances heightened sensory hunger against defensive self-sovereignty in intimate spaces.';
        }
        return 'Vivid psychological tension balancing control against deep somatic desire.';
    }
  }

  if (task === 'autofill-step-1') {
    return JSON.stringify({
      name: isFemale ? 'Seraphina Cross' : isMale ? 'Julian Vance' : 'Rowan Sterling',
      title: isFemale ? 'The Velvet Siren' : isMale ? 'The Steel Executive' : 'The Chrome Phantom',
      age: 32,
      gender: character?.gender || (isFemale ? 'Female' : isMale ? 'Male' : 'Non-Binary'),
      pronouns: character?.pronouns || (isFemale ? 'she/her' : isMale ? 'he/him' : 'they/them'),
      tags: ['Conflicted', 'High Power', 'Avoidant', 'Sensual', 'Dual Control'],
      architectureType: character?.architectureType || 'conflicted',
      primaryArchetype: 'avoidant_defender'
    });
  }

  return '';
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().then(
  (reason) => console.log(reason), (reason) => console.error(reason)
);

















