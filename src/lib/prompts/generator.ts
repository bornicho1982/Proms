import type { ImageAnalysis, Language } from '@/lib/gemini/client';

export interface PromptWeights {
  base: number;
  character: number;
  pose: number;
  setting: number;
  atmosphere: number;
}

export type TargetEngine = 'flow' | 'midjourney' | 'leonardo';

export interface PromptOptions {
  engine: TargetEngine;
  aspectRatio: string;
  stylePreset: string;
  weights: PromptWeights;
}

export const DEFAULT_OPTIONS: PromptOptions = {
  engine: 'flow',
  aspectRatio: '16:9',
  stylePreset: 'None',
  weights: { base: 1.0, character: 1.0, pose: 1.0, setting: 1.0, atmosphere: 1.0 }
};

const applyWeight = (text: string, weight: number) => {
  if (!text || text.trim() === 'Not applicable' || weight === 1.0) return text;
  return `(${text}:${weight.toFixed(1)})`;
};

const getStyleSuffix = (stylePreset: string) => {
  switch (stylePreset) {
    case 'Anime': return ', high quality anime aesthetic, 2d animation, studio ghibli style, vibrant flat colors';
    case 'Cinematic': return ', cinematic lighting, highly detailed, photorealistic, 8k resolution, award winning photography';
    case 'Oil Painting': return ', classic oil painting style, visible brushstrokes, canvas texture, masterpiece';
    case '3D Render': return ', 3d octane render, unreal engine 5, ray tracing, smooth 3d materials';
    case 'Cyberpunk': return ', cyberpunk aesthetic, neon lights, dark moody atmosphere, futuristic sci-fi city';
    case 'Watercolor': return ', watercolor painting, soft bleeding edges, translucent paint, artistic illustration';
    default: return '';
  }
};

/**
 * Generates engine-optimized prompts from an image analysis.
 * Supports Google Flow, Midjourney, and Leonardo AI.
 */
export function generateEnginePrompt(
  analysis: ImageAnalysis,
  options: PromptOptions = DEFAULT_OPTIONS
): string {
  const isMJ = options.engine === 'midjourney';

  let prefix = '';
  if (options.stylePreset && options.stylePreset !== 'None') {
    prefix = getStyleSuffix(options.stylePreset).replace(', ', '').toUpperCase() + " artwork of ";
  }

  // 1. Framing
  let framingArr: string[] = [];
  if (analysis.pose) {
    framingArr = [analysis.pose.framing, analysis.pose.cameraAngle].filter(v => v && !v.includes('Not applicable'));
  } else {
    framingArr = [analysis.composition.framing, analysis.composition.cameraAngle].filter(v => v && !v.includes('Not applicable'));
  }
  const framing = framingArr.join(isMJ ? ', ' : ' ');

  // 2. Character
  let charSent = '';
  let charDesc = '';
  if (analysis.character) {
    const c = analysis.character;
    const charTraits = [
      c.celebrityAnchor !== 'Not applicable' ? `face structure of ${c.celebrityAnchor}` : '', 
      c.ageAndGender, c.ethnicity, c.bodyType, c.hair, 
      c.faceShape, c.eyesAndBrows, c.nose, c.mouthAndJaw, c.skinAndComplexion, 
      c.clothing, c.distinctiveTraits
    ].filter(v => v && !v.includes('Not applicable') && v !== 'No aplicable');
    charDesc = charTraits.join(', ');
    
    charSent = charDesc ? (isMJ ? applyWeight(charDesc, options.weights.character) : `a ${applyWeight(charDesc, options.weights.character)}.`) : (isMJ ? 'a person' : 'a person.');
  } else {
    charSent = analysis.composition.mainSubject ? (isMJ ? applyWeight(analysis.composition.mainSubject, options.weights.base) : `a ${applyWeight(analysis.composition.mainSubject, options.weights.base)}.`) : (isMJ ? 'main subject' : 'the main subject.');
  }

  // 3. Pose & Action
  let poseSent = '';
  let poseDesc = '';
  if (analysis.pose) {
    const p = analysis.pose;
    poseDesc = [p.action, p.bodyLanguage, p.interaction].filter(v => v && !v.includes('Not applicable')).join(', ');
    if (poseDesc) poseSent = isMJ ? applyWeight(poseDesc, options.weights.pose) : `They are ${applyWeight(poseDesc, options.weights.pose)}.`;
  } else if (analysis.character && analysis.composition.mainSubject) {
    poseSent = isMJ ? applyWeight(analysis.composition.mainSubject, options.weights.base) : `They are performing the action: ${applyWeight(analysis.composition.mainSubject, options.weights.base)}.`;
  }

  // 4. Setting
  let settingSent = '';
  let settingText = '';
  const settingData = analysis.settingOverride || analysis.composition;
  if ('location' in settingData) {
    settingText = [settingData.location, settingData.environment, settingData.timeOfDay, settingData.weather, settingData.backgroundElements]
      .filter(v => v && !v.includes('Not applicable')).join(', ');
    if (settingText) settingSent = isMJ ? applyWeight(settingText, options.weights.setting) : `The setting is ${applyWeight(settingText, options.weights.setting)}.`;
  } else {
    settingText = settingData.setting || '';
    if (settingText && settingText !== 'Not applicable') settingSent = isMJ ? applyWeight(settingText, options.weights.base) : `The setting is ${applyWeight(settingText, options.weights.base)}.`;
  }

  // 5. Lighting & Style
  const styleTraits = [
    analysis.lighting.type, analysis.lighting.direction, analysis.lighting.colorTemperature,
    analysis.colorPalette.colorScheme,
    analysis.artisticStyle.visualAesthetic, analysis.artisticStyle.detailLevel,
    analysis.mood.primaryEmotion, analysis.mood.ambientConditions,
    analysis.textures.identifiedMaterials, analysis.composition.depthOfField
  ].filter(v => v && v !== 'Not applicable' && v !== 'No aplicable').join(', ');
  
  const atmosphereWeight = analysis.mood.narrativeTone ? options.weights.atmosphere : options.weights.base;
  const styleSent = styleTraits ? (isMJ ? applyWeight(styleTraits, atmosphereWeight) : `The scene features ${applyWeight(styleTraits, atmosphereWeight)}.`) : '';

  // Assembly
  let finalPrompt = '';

  if (isMJ) {
    // Midjourney prefers comma-separated dense tags
    const blocks = [
      options.stylePreset && options.stylePreset !== 'None' ? getStyleSuffix(options.stylePreset).replace(', ', '') : '',
      framing,
      charSent,
      poseSent,
      settingSent,
      styleSent
    ].filter(Boolean);
    finalPrompt = blocks.join(', ').replace(/\s+/g, ' ');
    
    // Append Midjourney specific parameters
    if (options.aspectRatio !== '1:1') {
      finalPrompt += ` --ar ${options.aspectRatio}`;
    }
    finalPrompt += ` --v 6.1 --style raw`;
  } else {
    // Flow & Leonardo prefer natural language paragraphs
    finalPrompt = `${prefix}${framing ? framing + ' ' : ''}${charSent} ${poseSent} ${settingSent} ${styleSent}`.trim().replace(/\s+/g, ' ');
    finalPrompt += getStyleSuffix(options.stylePreset);
    
    // Natural Language phrase for aspect ratio instead of technical --ar flags
    if (options.aspectRatio !== '1:1') {
      finalPrompt += `, in ${options.aspectRatio} aspect ratio format`;
    }
  }

  return finalPrompt;
}

/**
 * Generates a structured, detailed prompt with sections.
 */
export function generateDetailedPrompt(analysis: ImageAnalysis, language: Language): string {
  const isEs = language === 'es';

  const sections = [];

  // Add character section first if present
  if (analysis.character) {
    sections.push({
      title: isEs ? '👤 Personaje (Asombrosamente Exacto)' : '👤 Character (Forensic Analysis)',
      items: [
        { label: isEs ? 'Anclajes Faciales' : 'Celebrity Anchor', value: analysis.character.celebrityAnchor },
        { label: isEs ? 'Edad/Género' : 'Age/Gender', value: analysis.character.ageAndGender },
        { label: isEs ? 'Etnia/Rasgos' : 'Ethnicity/Phenotype', value: analysis.character.ethnicity },
        { label: isEs ? 'Estructura Ósea' : 'Bone Structure', value: analysis.character.faceShape },
        { label: isEs ? 'Ojos y Cejas' : 'Eyes & Brows', value: analysis.character.eyesAndBrows },
        { label: isEs ? 'Nariz' : 'Nose', value: analysis.character.nose },
        { label: isEs ? 'Boca y Mandíbula' : 'Mouth & Jaw', value: analysis.character.mouthAndJaw },
        { label: isEs ? 'Pelo' : 'Hair', value: analysis.character.hair },
        { label: isEs ? 'Testura de Piel' : 'Skin Texture', value: analysis.character.skinAndComplexion },
        { label: isEs ? 'Constitución' : 'Body Type', value: analysis.character.bodyType },
        { label: isEs ? 'Ropa' : 'Clothing', value: analysis.character.clothing },
        { label: isEs ? 'Micro-Detalles' : 'Micro-Traits', value: analysis.character.distinctiveTraits },
      ]
    });
  }

  // Add Pose section if present
  if (analysis.pose) {
    sections.push({
      title: isEs ? '🚶‍♂️ Pose y Acción (Referencia)' : '🚶‍♂️ Pose & Action (Reference)',
      items: [
        { label: isEs ? 'Acción' : 'Action', value: analysis.pose.action },
        { label: isEs ? 'Lenguaje Corporal' : 'Body Language', value: analysis.pose.bodyLanguage },
        { label: isEs ? 'Interacción' : 'Interaction', value: analysis.pose.interaction },
        { label: isEs ? 'Encuadre' : 'Framing', value: analysis.pose.framing },
        { label: isEs ? 'Ángulo' : 'Camera Angle', value: analysis.pose.cameraAngle },
      ]
    });
  }

  // Add Setting section if present
  if (analysis.settingOverride) {
    sections.push({
      title: isEs ? '🏞️ Entorno (Referencia)' : '🏞️ Setting (Reference)',
      items: [
        { label: isEs ? 'Ubicación' : 'Location', value: analysis.settingOverride.location },
        { label: isEs ? 'Entorno' : 'Environment', value: analysis.settingOverride.environment },
        { label: isEs ? 'Hora del Día' : 'Time of Day', value: analysis.settingOverride.timeOfDay },
        { label: isEs ? 'Clima/Atmósfera' : 'Weather/Mood', value: analysis.settingOverride.weather },
        { label: isEs ? 'Detalles de Fondo' : 'Background Elements', value: analysis.settingOverride.backgroundElements },
      ]
    });
  }

  sections.push(
    {
      title: isEs ? '📐 Composición (Base)' : '📐 Composition (Base)',
      items: [
        { label: isEs ? 'Sujeto' : 'Subject', value: analysis.composition.mainSubject },
        { label: isEs ? 'Escenario' : 'Setting', value: analysis.composition.setting },
        { label: isEs ? 'Encuadre' : 'Framing', value: analysis.composition.framing },
        { label: isEs ? 'Ángulo' : 'Angle', value: analysis.composition.cameraAngle },
        { label: isEs ? 'Profundidad' : 'DoF', value: analysis.composition.depthOfField },
      ],
    },
    {
      title: isEs ? '💡 Iluminación' : '💡 Lighting',
      items: [
        { label: isEs ? 'Tipo' : 'Type', value: analysis.lighting.type },
        { label: isEs ? 'Dirección' : 'Direction', value: analysis.lighting.direction },
        { label: isEs ? 'Calidad' : 'Quality', value: analysis.lighting.quality },
        { label: isEs ? 'Temperatura' : 'Temperature', value: analysis.lighting.colorTemperature },
        { label: isEs ? 'Efectos' : 'Effects', value: analysis.lighting.specialEffects },
      ],
    },
    {
      title: isEs ? '🎨 Paleta de Colores' : '🎨 Color Palette',
      items: [
        { label: isEs ? 'Colores' : 'Colors', value: analysis.colorPalette.dominantColors?.join(', ') },
        { label: isEs ? 'Esquema' : 'Scheme', value: analysis.colorPalette.colorScheme },
        { label: isEs ? 'Saturación' : 'Saturation', value: analysis.colorPalette.saturation },
      ],
    },
    {
      title: isEs ? '🖌️ Estilo' : '🖌️ Style',
      items: [
        { label: isEs ? 'Medio' : 'Medium', value: analysis.artisticStyle.medium },
        { label: isEs ? 'Estética' : 'Aesthetic', value: analysis.artisticStyle.visualAesthetic },
        { label: isEs ? 'Detalle' : 'Detail', value: analysis.artisticStyle.detailLevel },
        { label: isEs ? 'Influencia' : 'Influence', value: analysis.artisticStyle.artistInfluence },
      ],
    },
    {
      title: isEs ? '🎭 Atmósfera' : '🎭 Mood',
      items: [
        { label: isEs ? 'Emoción' : 'Emotion', value: analysis.mood.primaryEmotion },
        { label: isEs ? 'Tono' : 'Tone', value: analysis.mood.narrativeTone },
        { label: isEs ? 'Energía' : 'Energy', value: analysis.mood.energy },
      ],
    },
    {
      title: isEs ? '🧱 Texturas' : '🧱 Textures',
      items: [
        { label: isEs ? 'Materiales' : 'Materials', value: analysis.textures.identifiedMaterials },
        { label: isEs ? 'Superficie' : 'Surface', value: analysis.textures.surfaceProperties },
      ],
    },
    {
      title: isEs ? '📷 Técnico' : '📷 Technical',
      items: [
        { label: isEs ? 'Resolución' : 'Resolution', value: analysis.technical.apparentResolution },
        { label: isEs ? 'Lente' : 'Lens', value: analysis.technical.simulatedLens },
        { label: isEs ? 'Post-proceso' : 'Post-process', value: analysis.technical.postProcessing },
      ],
    },
    {
      title: isEs ? '🏗️ Narrativa' : '🏗️ Narrative',
      items: [
        { label: isEs ? 'Historia' : 'Story', value: analysis.narrative.impliedStory },
        { label: isEs ? 'Simbolismo' : 'Symbolism', value: analysis.narrative.symbolism },
      ],
    },
  );

  return sections
    .map(section => {
      const items = section.items
        .filter(item => item.value && item.value !== 'Not applicable' && item.value !== 'No aplicable')
        .map(item => `  ${item.label}: ${item.value}`)
        .join('\n');
      return items ? `${section.title}\n${items}` : '';
    })
    .filter(Boolean)
    .join('\n\n');
}
