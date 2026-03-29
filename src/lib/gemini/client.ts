import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { getGeminiApiKey } from '@/lib/config/env';

function getClient() {
  return new GoogleGenerativeAI(getGeminiApiKey());
}

export type Language = 'es' | 'en';
export type ImageRole = 'base' | 'character' | 'pose' | 'setting' | 'atmosphere';

export interface ImageInput {
  role: ImageRole;
  base64: string;
  mimeType: string;
}

export interface ImageAnalysis {
  character?: {
    ageAndGender: string;
    ethnicity: string;
    bodyType: string;
    hair: string;
    faceShape: string;
    eyesAndBrows: string;
    nose: string;
    mouthAndJaw: string;
    skinAndComplexion: string;
    celebrityAnchor: string;
    clothing: string;
    distinctiveTraits: string;
  };
  pose?: {
    bodyLanguage: string;
    action: string;
    cameraAngle: string;
    framing: string;
    interaction: string;
  };
  settingOverride?: {
    location: string;
    environment: string;
    timeOfDay: string;
    weather: string;
    backgroundElements: string;
  };
  composition: {
    mainSubject: string;
    secondaryElements: string;
    setting: string;
    framing: string;
    cameraAngle: string;
    perspective: string;
    compositionalRules: string;
    depthOfField: string;
    aspectRatio: string;
    negativeSpace: string;
  };
  lighting: {
    type: string;
    direction: string;
    quality: string;
    intensity: string;
    colorTemperature: string;
    timeOfDay: string;
    specialEffects: string;
    shadows: string;
    reflections: string;
  };
  colorPalette: {
    dominantColors: string[];
    colorScheme: string;
    saturation: string;
    contrast: string;
    temperature: string;
    colorAccents: string;
    emotionalConnection: string;
  };
  artisticStyle: {
    medium: string;
    artMovement: string;
    visualAesthetic: string;
    photographyStyle: string;
    visibleTechniques: string;
    artistInfluence: string;
    detailLevel: string;
    rendering: string;
  };
  mood: {
    primaryEmotion: string;
    energy: string;
    narrativeTone: string;
    ambientConditions: string;
    temporalFeeling: string;
    subjectExpression: string;
  };
  textures: {
    identifiedMaterials: string;
    surfaceProperties: string;
    materialState: string;
    patterns: string;
    microDetails: string;
    reflectivity: string;
  };
  technical: {
    apparentResolution: string;
    simulatedLens: string;
    estimatedAperture: string;
    grainNoise: string;
    postProcessing: string;
    motionBlur: string;
  };
  narrative: {
    impliedStory: string;
    symbolism: string;
    culturalContext: string;
    interaction: string;
    scale: string;
  };
  negativePrompt: string;
}

function buildSystemPrompt(language: Language, roles: ImageRole[]): string {
  const lang = language === 'es' ? 'Spanish' : 'English';

  const hasCharacter = roles.includes('character');
  const hasPose = roles.includes('pose');
  const hasSetting = roles.includes('setting');
  const hasAtmosphere = roles.includes('atmosphere');

  // Build dynamic instructions based on uploaded roles
  let instructions = `You are receiving ${roles.length} image(s).\n\n`;
  instructions += `[IMAGE ROLE: BASE]: You MUST extract lighting, artistic style, colors, mood, textures, and global composition ONLY from this image. DO NOT extract character identity or setting if separate images are provided for them.\n`;
  
  if (hasCharacter) {
    instructions += `[IMAGE ROLE: CHARACTER]: You MUST IGNORE its background and lighting. Use it ONLY to extract physical traits, clothing, age, ethnicity, hair, and facial features.\n`;
  }
  if (hasPose) {
    instructions += `[IMAGE ROLE: POSE]: You MUST IGNORE its character identity, background, and lighting. Use it ONLY to extract the physical pose, body language, action, framing, and camera angle.\n`;
  }
  if (hasSetting) {
    instructions += `[IMAGE ROLE: SETTING]: You MUST IGNORE any characters in it. Use it ONLY to extract the environment, landscape, location, weather, and background elements.\n`;
  }
  if (hasAtmosphere) {
    instructions += `[IMAGE ROLE: ATMOSPHERE]: You MUST IGNORE characters, setting and composition. Use it ONLY to extract the COLOR GRADING, light temperature, shadows, tonal mood, and cinematic atmosphere. Apply this lighting/color feel to the final result.\n`;
  }

  instructions += `\nCRITICAL RULE: The final output must perfectly isolate and combine these elements as instructed.`;

  const characterJson = hasCharacter ? `
  "character": {
    "ageAndGender": "exact perceived age range (e.g. late 20s, precise 35 years old) and gender",
    "ethnicity": "hyper-specific ethnic phenotype and skin undertone (e.g. Nordic Caucasian, East Asian with olive undertones)",
    "bodyType": "precise build, shoulders, and muscularity/fat distribution",
    "hair": "exact length, color, texture, parting, volume, and hairline details",
    "faceShape": "precise facial structure (e.g. oval, square, diamond, diamond, high cheekbones, gaunt cheeks)",
    "eyesAndBrows": "eye color, hooded/almond/monolid shape, eyelash thickness, eyebrow thickness, shape, and arch",
    "nose": "nose bridge shape (straight, hooked, button), nostril flare, and tip shape",
    "mouthAndJaw": "lip fullness (upper vs lower), mouth width, jawline sharpness, and chin prominence",
    "skinAndComplexion": "exact skin texture, pores, freckles density, wrinkles, stubble, redness, or hyperpigmentation",
    "celebrityAnchor": "ONLY if the person looks almost exactly like a specific famous celebrity/actor, provide their name. Otherwise, MUST write 'Not applicable'. Do not guess.",
    "clothing": "micro-details of clothing: fabric types (denim, silk, knit), fit, colors, patterns, and stitching",
    "distinctiveTraits": "moles (exact location), scars, asymmetrical features, specific facial micro-expressions, makeup details"
  },` : ``;

  const poseJson = hasPose ? `
  "pose": {
    "bodyLanguage": "posture and stance from POSE image",
    "action": "what is the subject doing in POSE image",
    "cameraAngle": "eye level, low angle, high angle from POSE image",
    "framing": "close-up, medium shot, wide shot from POSE image",
    "interaction": "interaction with objects/space from POSE image"
  },` : ``;

  const settingJson = hasSetting ? `
  "settingOverride": {
    "location": "specific location (indoor/outdoor) from SETTING image",
    "environment": "biome, architecture, or landscape from SETTING image",
    "timeOfDay": "inferred time of day from SETTING image",
    "weather": "ambient weather/atmosphere from SETTING image",
    "backgroundElements": "specific objects, vegetation, or props in the background of SETTING image"
  },` : ``;

  return `You are an expert image analyst specialized in creating professional prompts for AI image generation, particularly for Flux.

${instructions}

YOUR TASK: Analyze the provided image(s) with extreme detail. Respond ONLY in ${lang}.

You MUST return a valid JSON object with this EXACT structure (no markdown, no code blocks, just raw JSON):

{${characterJson}${poseJson}${settingJson}
  "composition": {
    "mainSubject": "detailed description of the main subject (if character ref provided, describe how they fit into the base scene)",
    "secondaryElements": "supporting elements, relationships between subjects",
    "setting": "location, interior/exterior, era (omit if SETTING image provided)",
    "framing": "close-up, medium shot, wide shot, etc.",
    "cameraAngle": "eye level, low angle, high angle, dutch angle, bird's eye, etc.",
    "perspective": "linear, atmospheric, vanishing point",
    "compositionalRules": "rule of thirds, golden ratio, leading lines, symmetry, etc.",
    "depthOfField": "everything in focus vs shallow/bokeh",
    "aspectRatio": "estimated ratio like 1:1, 16:9, 4:3, 3:2, etc.",
    "negativeSpace": "use of empty space as compositional element"
  },
  "lighting": {
    "type": "natural (sun, moon, overcast) or artificial (studio, neon, candles, etc.)",
    "direction": "frontal, side, backlight, overhead, from below",
    "quality": "soft/diffused vs hard/high contrast",
    "intensity": "high-key (very bright) or low-key (dark, dramatic)",
    "colorTemperature": "warm (golden, amber) / cool (blue) / neutral",
    "timeOfDay": "golden hour, blue hour, midday, night, etc.",
    "specialEffects": "volumetric, god rays, lens flare, chiaroscuro",
    "shadows": "direction, hardness, length, color of shadows",
    "reflections": "specular, diffuse, ambient reflections"
  },
  "colorPalette": {
    "dominantColors": ["color1 with hex", "color2 with hex", "color3 with hex"],
    "colorScheme": "complementary, analogous, triadic, monochromatic, split-complementary",
    "saturation": "high vibrance, desaturated, pastel, neon",
    "contrast": "high contrast / low contrast / harmonious",
    "temperature": "warm palette, cool palette, or mixed",
    "colorAccents": "standout color that creates focal point",
    "emotionalConnection": "what emotions the colors evoke"
  },
  "artisticStyle": {
    "medium": "photography, oil painting, watercolor, digital illustration, 3D render, pixel art, etc.",
    "artMovement": "impressionism, baroque, pop art, surrealism, minimalism, art nouveau, etc.",
    "visualAesthetic": "photorealism, anime, cartoon, concept art, fantasy, cyberpunk, retro/vintage, etc.",
    "photographyStyle": "portrait, landscape, street, macro, editorial, product, documentary, cinematic",
    "visibleTechniques": "brushstrokes, digital textures, clean lines, splatter, collage",
    "artistInfluence": "reminiscent style of (specific artists if recognizable)",
    "detailLevel": "hyperrealistic, detailed, loose, minimalist, abstract",
    "rendering": "matte, glossy, flat, volumetric, cel-shading"
  },
  "mood": {
    "primaryEmotion": "joy, melancholy, mystery, epic, serene, tense, romantic, etc.",
    "energy": "dynamic/energetic vs static/contemplative",
    "narrativeTone": "optimistic, dark, nostalgic, dreamlike, surreal, dramatic",
    "ambientConditions": "fog, rain, snow, dust, smoke, particles",
    "temporalFeeling": "frozen moment, motion, passage of time",
    "subjectExpression": "facial emotions, body language if applicable"
  },
  "textures": {
    "identifiedMaterials": "metal, wood, fabric, glass, stone, water, skin, leather, etc.",
    "surfaceProperties": "smooth, rough, shiny, matte, translucent, opaque",
    "materialState": "new, aged, rusted, worn, polished",
    "patterns": "textile, geometric, organic, repetitive",
    "microDetails": "grain, pores, fibers, particles, bubbles",
    "reflectivity": "mirror, partial reflection, diffuse, non-reflective"
  },
  "technical": {
    "apparentResolution": "ultra HD, high, medium, lo-fi, pixelated",
    "simulatedLens": "wide angle, telephoto, macro, fisheye, tilt-shift",
    "estimatedAperture": "shallow DOF f/1.4 vs deep DOF f/16",
    "grainNoise": "film grain, digital noise, clean",
    "postProcessing": "HDR, vintage filter, partial desaturation, vignetting, split toning",
    "motionBlur": "subject or camera movement blur"
  },
  "narrative": {
    "impliedStory": "what is happening? what just happened or is about to happen?",
    "symbolism": "objects or elements with symbolic meaning",
    "culturalContext": "references to culture, era, religion, mythology",
    "interaction": "interaction between subjects/objects",
    "scale": "sense of scale"
  },
  "negativePrompt": "comma separated list of concepts, defects, or elements to explicitly avoid to keep the result clean, e.g. 'ugly, distorted, blurry, extra limbs, bad anatomy, text, watermark'"
}

RULES:
- Be extremely detailed and specific in every field
- If a category doesn't apply, write "Not applicable" instead of leaving empty
- Describe what you SEE, not what you assume
- Use professional art/photography terminology
- For dominantColors, always include hex color codes
- Respond in ${lang} for all descriptions`;
}

export async function analyzeImage(
  images: ImageInput[],
  language: Language
): Promise<ImageAnalysis> {
  const model = getClient().getGenerativeModel({
    model: 'gemini-flash-lite-latest',
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: 8192,
      temperature: 0.2,
    }
  });

  const roles = images.map(img => img.role);
  const systemPrompt = buildSystemPrompt(language, roles);

  const parts: Part[] = [
    { text: systemPrompt },
  ];

  for (const img of images) {
    parts.push({ text: `\n--- [IMAGE ROLE: ${img.role.toUpperCase()}] ---\n` });
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64,
      },
    });
  }

  parts.push({ text: 'Analyze the image(s) in extreme detail. Return ONLY valid JSON, no markdown formatting.' });

  // Retry logic for rate limits (429/503)
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent(parts);
      const response = result.response;
      const text = response.text();

      // Extract JSON from the response (handle potential markdown wrapping)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse analysis response as JSON');
      }

      const analysis: ImageAnalysis = JSON.parse(jsonMatch[0]);
      return analysis;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const msg = lastError.message;
      const isRateLimit = msg.includes('429') || msg.includes('503') || msg.includes('quota') || msg.includes('Too Many');
      
      if (isRateLimit && attempt < 2) {
        const waitMs = (attempt + 1) * 10000; // 10s, 20s
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }
      throw lastError;
    }
  }
  throw lastError || new Error('Max retries exceeded');
}
