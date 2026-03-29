'use client';

import { useState, useCallback, useRef } from 'react';
import type { ImageAnalysis, Language, ImageRole, ImageInput } from '@/lib/gemini/client';
import { generateEnginePrompt, generateDetailedPrompt, DEFAULT_OPTIONS, type PromptOptions, type TargetEngine } from '@/lib/prompts/generator';
import { saveToHistory, type SavedCharacter } from '@/lib/db/history';
import HistoryPanel from '@/components/ui/HistoryPanel';
import CharacterManager from '@/components/ui/CharacterManager';
import BatchPanel from '@/components/ui/BatchPanel';

interface AnalysisResult {
  analysis: ImageAnalysis;
}

const ANALYSIS_CATEGORIES = [
  {
    key: 'character' as const,
    icon: '👤',
    titleEs: 'Personaje (Referencia)',
    titleEn: 'Character (Reference)',
    fields: [
      { key: 'celebrityAnchor', labelEs: 'Anclaje Facial', labelEn: 'Facial Anchor' },
      { key: 'ageAndGender', labelEs: 'Edad y Género', labelEn: 'Age and Gender' },
      { key: 'ethnicity', labelEs: 'Etnia/Fenotipo', labelEn: 'Ethnicity/Phenotype' },
      { key: 'faceShape', labelEs: 'Estructura Ósea', labelEn: 'Bone Structure' },
      { key: 'eyesAndBrows', labelEs: 'Ojos y Cejas', labelEn: 'Eyes and Brows' },
      { key: 'nose', labelEs: 'Nariz', labelEn: 'Nose' },
      { key: 'mouthAndJaw', labelEs: 'Boca y Mandíbula', labelEn: 'Mouth and Jaw' },
      { key: 'skinAndComplexion', labelEs: 'Textura de Piel', labelEn: 'Skin Texture' },
      { key: 'hair', labelEs: 'Pelo', labelEn: 'Hair' },
      { key: 'bodyType', labelEs: 'Constitución', labelEn: 'Body Type' },
      { key: 'clothing', labelEs: 'Ropa', labelEn: 'Clothing' },
      { key: 'distinctiveTraits', labelEs: 'Micro-Detalles', labelEn: 'Micro-Details' },
    ],
  },
  {
    key: 'pose' as const,
    icon: '🚶‍♂️',
    titleEs: 'Pose y Acción',
    titleEn: 'Pose & Action',
    fields: [
      { key: 'action', labelEs: 'Acción', labelEn: 'Action' },
      { key: 'bodyLanguage', labelEs: 'Lenguaje Corporal', labelEn: 'Body Language' },
      { key: 'interaction', labelEs: 'Interacción', labelEn: 'Interaction' },
      { key: 'framing', labelEs: 'Encuadre Original', labelEn: 'Original Framing' },
      { key: 'cameraAngle', labelEs: 'Ángulo Original', labelEn: 'Original Angle' },
    ],
  },
  {
    key: 'settingOverride' as const,
    icon: '🏞️',
    titleEs: 'Entorno (Referencia)',
    titleEn: 'Setting (Reference)',
    fields: [
      { key: 'location', labelEs: 'Ubicación', labelEn: 'Location' },
      { key: 'environment', labelEs: 'Entorno/Paisaje', labelEn: 'Environment' },
      { key: 'timeOfDay', labelEs: 'Hora del Día', labelEn: 'Time of Day' },
      { key: 'weather', labelEs: 'Clima', labelEn: 'Weather' },
      { key: 'backgroundElements', labelEs: 'Elementos de Fondo', labelEn: 'Background Elements' },
    ],
  },
  {
    key: 'composition' as const,
    icon: '📐',
    titleEs: 'Composición',
    titleEn: 'Composition',
    fields: [
      { key: 'mainSubject', labelEs: 'Sujeto Principal', labelEn: 'Main Subject' },
      { key: 'secondaryElements', labelEs: 'Elementos Secundarios', labelEn: 'Secondary Elements' },
      { key: 'setting', labelEs: 'Escenario', labelEn: 'Setting' },
      { key: 'framing', labelEs: 'Encuadre', labelEn: 'Framing' },
      { key: 'cameraAngle', labelEs: 'Ángulo de Cámara', labelEn: 'Camera Angle' },
      { key: 'perspective', labelEs: 'Perspectiva', labelEn: 'Perspective' },
      { key: 'compositionalRules', labelEs: 'Reglas Compositivas', labelEn: 'Compositional Rules' },
      { key: 'depthOfField', labelEs: 'Profundidad de Campo', labelEn: 'Depth of Field' },
      { key: 'aspectRatio', labelEs: 'Relación de Aspecto', labelEn: 'Aspect Ratio' },
      { key: 'negativeSpace', labelEs: 'Espacio Negativo', labelEn: 'Negative Space' },
    ],
  },
  {
    key: 'lighting' as const,
    icon: '💡',
    titleEs: 'Iluminación',
    titleEn: 'Lighting',
    fields: [
      { key: 'type', labelEs: 'Tipo', labelEn: 'Type' },
      { key: 'direction', labelEs: 'Dirección', labelEn: 'Direction' },
      { key: 'quality', labelEs: 'Calidad', labelEn: 'Quality' },
      { key: 'intensity', labelEs: 'Intensidad', labelEn: 'Intensity' },
      { key: 'colorTemperature', labelEs: 'Temperatura de Color', labelEn: 'Color Temperature' },
      { key: 'timeOfDay', labelEs: 'Hora del Día', labelEn: 'Time of Day' },
      { key: 'specialEffects', labelEs: 'Efectos Especiales', labelEn: 'Special Effects' },
      { key: 'shadows', labelEs: 'Sombras', labelEn: 'Shadows' },
      { key: 'reflections', labelEs: 'Reflejos', labelEn: 'Reflections' },
    ],
  },
  {
    key: 'colorPalette' as const,
    icon: '🎨',
    titleEs: 'Paleta de Colores',
    titleEn: 'Color Palette',
    fields: [
      { key: 'colorScheme', labelEs: 'Esquema Cromático', labelEn: 'Color Scheme' },
      { key: 'saturation', labelEs: 'Saturación', labelEn: 'Saturation' },
      { key: 'contrast', labelEs: 'Contraste', labelEn: 'Contrast' },
      { key: 'temperature', labelEs: 'Temperatura', labelEn: 'Temperature' },
      { key: 'colorAccents', labelEs: 'Acentos de Color', labelEn: 'Color Accents' },
      { key: 'emotionalConnection', labelEs: 'Conexión Emocional', labelEn: 'Emotional Connection' },
    ],
  },
  {
    key: 'artisticStyle' as const,
    icon: '🖌️',
    titleEs: 'Estilo Artístico',
    titleEn: 'Artistic Style',
    fields: [
      { key: 'medium', labelEs: 'Medio', labelEn: 'Medium' },
      { key: 'artMovement', labelEs: 'Movimiento Artístico', labelEn: 'Art Movement' },
      { key: 'visualAesthetic', labelEs: 'Estética Visual', labelEn: 'Visual Aesthetic' },
      { key: 'photographyStyle', labelEs: 'Estilo Fotográfico', labelEn: 'Photography Style' },
      { key: 'visibleTechniques', labelEs: 'Técnicas Visibles', labelEn: 'Visible Techniques' },
      { key: 'artistInfluence', labelEs: 'Influencia de Artista', labelEn: 'Artist Influence' },
      { key: 'detailLevel', labelEs: 'Nivel de Detalle', labelEn: 'Detail Level' },
      { key: 'rendering', labelEs: 'Renderizado', labelEn: 'Rendering' },
    ],
  },
  {
    key: 'mood' as const,
    icon: '🎭',
    titleEs: 'Atmósfera',
    titleEn: 'Mood',
    fields: [
      { key: 'primaryEmotion', labelEs: 'Emoción Principal', labelEn: 'Primary Emotion' },
      { key: 'energy', labelEs: 'Energía', labelEn: 'Energy' },
      { key: 'narrativeTone', labelEs: 'Tono Narrativo', labelEn: 'Narrative Tone' },
      { key: 'ambientConditions', labelEs: 'Condiciones Ambientales', labelEn: 'Ambient Conditions' },
      { key: 'temporalFeeling', labelEs: 'Sensación Temporal', labelEn: 'Temporal Feeling' },
      { key: 'subjectExpression', labelEs: 'Expresión del Sujeto', labelEn: 'Subject Expression' },
    ],
  },
  {
    key: 'textures' as const,
    icon: '🧱',
    titleEs: 'Texturas y Materiales',
    titleEn: 'Textures & Materials',
    fields: [
      { key: 'identifiedMaterials', labelEs: 'Materiales', labelEn: 'Materials' },
      { key: 'surfaceProperties', labelEs: 'Propiedades de Superficie', labelEn: 'Surface Properties' },
      { key: 'materialState', labelEs: 'Estado del Material', labelEn: 'Material State' },
      { key: 'patterns', labelEs: 'Patrones', labelEn: 'Patterns' },
      { key: 'microDetails', labelEs: 'Micro Detalles', labelEn: 'Micro Details' },
      { key: 'reflectivity', labelEs: 'Reflectividad', labelEn: 'Reflectivity' },
    ],
  },
  {
    key: 'technical' as const,
    icon: '📷',
    titleEs: 'Parámetros Técnicos',
    titleEn: 'Technical Parameters',
    fields: [
      { key: 'apparentResolution', labelEs: 'Resolución', labelEn: 'Resolution' },
      { key: 'simulatedLens', labelEs: 'Lente Simulado', labelEn: 'Simulated Lens' },
      { key: 'estimatedAperture', labelEs: 'Apertura Estimada', labelEn: 'Estimated Aperture' },
      { key: 'grainNoise', labelEs: 'Grano/Ruido', labelEn: 'Grain/Noise' },
      { key: 'postProcessing', labelEs: 'Post-Procesado', labelEn: 'Post-Processing' },
      { key: 'motionBlur', labelEs: 'Motion Blur', labelEn: 'Motion Blur' },
    ],
  },
  {
    key: 'narrative' as const,
    icon: '🏗️',
    titleEs: 'Elementos Narrativos',
    titleEn: 'Narrative Elements',
    fields: [
      { key: 'impliedStory', labelEs: 'Historia Implícita', labelEn: 'Implied Story' },
      { key: 'symbolism', labelEs: 'Simbolismo', labelEn: 'Symbolism' },
      { key: 'culturalContext', labelEs: 'Contexto Cultural', labelEn: 'Cultural Context' },
      { key: 'interaction', labelEs: 'Interacción', labelEn: 'Interaction' },
      { key: 'scale', labelEs: 'Escala', labelEn: 'Scale' },
    ],
  },
];

function extractHexColors(colors: string[] | undefined | null): { text: string; hex: string | null }[] {
  if (!colors || !Array.isArray(colors)) return [];
  return colors.map(c => {
    if (typeof c !== 'string') return { text: String(c), hex: null };
    const hexMatch = c.match(/#[0-9a-fA-F]{6}/);
    return { text: c, hex: hexMatch ? hexMatch[0] : null };
  });
}

type SlotsState = Record<ImageRole, { file: File; preview: string } | null>;

const ROLES_CONFIG: { role: ImageRole; icon: string; titleEs: string; titleEn: string; descEs: string; descEn: string; required: boolean }[] = [
  { role: 'base', icon: '🎨', titleEs: '1. Estilo / Escena Base', titleEn: '1. Base Style / Scene', descEs: 'Obligatorio. Define la luz, fondo y estilo global.', descEn: 'Required. Defines lighting, background and global style.', required: true },
  { role: 'character', icon: '👤', titleEs: '2. Personaje (Opcional)', titleEn: '2. Character (Optional)', descEs: 'Extrae cara, pelo y ropa.', descEn: 'Extracts face, hair and clothing.', required: false },
  { role: 'pose', icon: '🏃‍♂️', titleEs: '3. Pose (Opcional)', titleEn: '3. Pose (Optional)', descEs: 'Extrae postura, acción y encuadre.', descEn: 'Extracts posture, action and framing.', required: false },
  { role: 'setting', icon: '🏞️', titleEs: '4. Entorno (Opcional)', titleEn: '4. Setting (Optional)', descEs: 'Sustituye el paisaje o fondo base.', descEn: 'Replaces the base landscape or background.', required: false },
  { role: 'atmosphere', icon: '🎬', titleEs: '5. Atmósfera / Color (Opcional)', titleEn: '5. Atmosphere / Color (Optional)', descEs: 'Extrae la luz, color grading y tono cinemático.', descEn: 'Extracts lighting, color grading and cinematic tone.', required: false },
];

export default function Home() {
  const [language, setLanguage] = useState<Language>('es');
  const [slots, setSlots] = useState<SlotsState>({ base: null, character: null, pose: null, setting: null, atmosphere: null });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [draggingRole, setDraggingRole] = useState<ImageRole | null>(null);
  const [options, setOptions] = useState<PromptOptions>(DEFAULT_OPTIONS);
  const [loadedCharName, setLoadedCharName] = useState<string | null>(null);
  const [showMicroscope, setShowMicroscope] = useState(false);

  const enginePromptText = result ? generateEnginePrompt(result.analysis, language, options) : '';
  const detailedPromptText = result ? generateDetailedPrompt(result.analysis, language) : '';

  const handleLoadSavedCharacter = (char: SavedCharacter) => {
    if (result) {
      setResult({
        analysis: { ...result.analysis, character: char.characterData }
      });
    } else {
      setResult({
        analysis: {
          character: char.characterData,
          composition: { mainSubject: '', secondaryElements: '', setting: '', framing: '', cameraAngle: '', perspective: '', compositionalRules: '', depthOfField: '', aspectRatio: '', negativeSpace: '' },
          lighting: { type: '', direction: '', quality: '', intensity: '', colorTemperature: '', timeOfDay: '', specialEffects: '', shadows: '', reflections: '' },
          colorPalette: { dominantColors: [], colorScheme: '', saturation: '', contrast: '', temperature: '', colorAccents: '', emotionalConnection: '' },
          artisticStyle: { medium: '', artMovement: '', visualAesthetic: '', photographyStyle: '', visibleTechniques: '', artistInfluence: '', detailLevel: '', rendering: '' },
          mood: { primaryEmotion: '', energy: '', narrativeTone: '', ambientConditions: '', temporalFeeling: '', subjectExpression: '' },
          textures: { identifiedMaterials: '', surfaceProperties: '', materialState: '', patterns: '', microDetails: '', reflectivity: '' },
          technical: { apparentResolution: '', simulatedLens: '', estimatedAperture: '', grainNoise: '', postProcessing: '', motionBlur: '' },
          narrative: { impliedStory: '', symbolism: '', culturalContext: '', interaction: '', scale: '' },
          negativePrompt: ''
        }
      });
    }
    setLoadedCharName(char.name);
  };

  const fileInputRefs = {
    base: useRef<HTMLInputElement>(null),
    character: useRef<HTMLInputElement>(null),
    pose: useRef<HTMLInputElement>(null),
    setting: useRef<HTMLInputElement>(null),
    atmosphere: useRef<HTMLInputElement>(null),
  };

  const handleFileSelect = useCallback((file: File, role: ImageRole) => {
    if (!file.type.startsWith('image/')) {
      setError(language === 'es' ? 'Por favor, sube un archivo de imagen válido.' : 'Please upload a valid image file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError(language === 'es' ? 'La imagen es demasiado grande (máx 20MB).' : 'Image is too large (max 20MB).');
      return;
    }
    
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSlots(prev => ({
        ...prev,
        [role]: { file, preview: e.target?.result as string }
      }));
    };
    reader.readAsDataURL(file);
  }, [language]);

  const handleDrop = useCallback((e: React.DragEvent, role: ImageRole) => {
    e.preventDefault();
    setDraggingRole(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file, role);
  }, [handleFileSelect]);

  const removeSlot = (e: React.MouseEvent, role: ImageRole) => {
    e.stopPropagation();
    setSlots(prev => ({ ...prev, [role]: null }));
    if (fileInputRefs[role].current) {
      fileInputRefs[role].current!.value = '';
    }
  };

  const fileToBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        resolve((reader.result as string).split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Client-side Image Resizing for Gemini Optimization
   * Reduces payload size and prevents 10MB JSON truncation
   */
  const resizeImage = (file: File, maxDim: number = 1024): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file); // Fallback to original
            }
          }, 'image/jpeg', 0.85); // High quality JPEG reduction
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!slots.base) {
      setError(language === 'es' ? 'La imagen Base es obligatoria.' : 'Base image is required.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const imagesPayload: ImageInput[] = [];

      for (const role of ['base', 'character', 'pose', 'setting', 'atmosphere'] as ImageRole[]) {
        if (slots[role]) {
          const resizedFile = await resizeImage(slots[role]!.file);
          const b64 = await fileToBase64(resizedFile);
          imagesPayload.push({
            role,
            mimeType: 'image/jpeg', // Always jpeg after resize
            base64: b64,
          });
        }
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesPayload,
          language,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult({ analysis: data.analysis });
      
      // Compute prompts and save to history
      const computedPrompt = generateEnginePrompt(data.analysis, language, options);
      const computedDetailed = generateDetailedPrompt(data.analysis, language);

      await saveToHistory({
        date: Date.now(),
        images: imagesPayload,
        fluxPrompt: computedPrompt, 
        detailedPrompt: computedDetailed,
        negativePrompt: data.analysis.negativePrompt,
        aspectRatio: options.aspectRatio,
        stylePreset: options.stylePreset,
        weights: options.weights
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isEs = language === 'es';
  const hasBase = !!slots.base;

  return (
    <div className="studio-container dots-bg" style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      <header className="studio-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
        <div className="studio-title-group">
          <h1 style={{ fontSize: '1.5rem', letterSpacing: '-0.04em' }}>
            {isEs ? 'Estudio de Producción' : 'Production Studio'}
            <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)', padding: '2px 8px', borderRadius: '4px', verticalAlign: 'middle' }}>PRO</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="language-toggle" style={{ margin: 0 }}>
            <button className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
          </div>
        </div>
      </header>

      <div className="studio-workbench">
        <div className="workbench-main">
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#666', letterSpacing: '0.05em' }}>
              References <span style={{ color: 'var(--accent-primary)' }}>/</span> {isEs ? 'Módulos de Entrada' : 'Input Modules'}
            </h2>
          </div>

          <div className="reference-dock">
            {ROLES_CONFIG.map(config => {
              const slot = slots[config.role];
              const isEnabled = config.role === 'base' || hasBase;

              return (
                <div key={config.role} className={`reference-module ${slot ? 'active' : ''} ${!isEnabled ? 'disabled' : ''}`} style={{ opacity: isEnabled ? 1 : 0.3 }}>
                  <div className="module-header">
                    <span className="module-title">{config.role}</span>
                    <span style={{ fontSize: '1rem' }}>{config.icon}</span>
                  </div>
                  
                  {!slot ? (
                    <div
                      className={`upload-zone ${draggingRole === config.role ? 'dragging' : ''}`}
                      style={{ padding: '24px 10px', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgba(255,255,255,0.05)' }}
                      onClick={() => isEnabled && fileInputRefs[config.role].current?.click()}
                      onDragOver={(e) => { if (isEnabled) { e.preventDefault(); setDraggingRole(config.role); } }}
                      onDragLeave={() => setDraggingRole(null)}
                      onDrop={(e) => isEnabled && handleDrop(e, config.role)}
                    >
                      <p style={{ fontSize: '0.65rem', color: '#555', fontWeight: 600 }}>{isEs ? 'AÑADIR' : 'ADD'}</p>
                      <input
                        ref={fileInputRefs[config.role]}
                        type="file"
                        accept="image/*"
                        className="upload-input"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file, config.role);
                        }}
                        disabled={!isEnabled}
                      />
                    </div>
                  ) : (
                    <div className="image-preview-container" style={{ margin: 0, height: '140px', background: '#000' }}>
                      <img src={slot.preview} alt={config.role} className="image-preview" style={{ height: '100%', objectFit: 'cover' }} />
                      <div className="image-preview-overlay">
                        <button className="btn-icon" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }} onClick={(e) => removeSlot(e, config.role)}>✕</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {result && !isAnalyzing && (
            <div className="prompt-section animation-fadeInUp" style={{ marginTop: '20px' }}>
              <div className="prompt-card" style={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="prompt-card-header" style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['flow', 'midjourney', 'leonardo'] as TargetEngine[]).map((eng) => (
                      <button
                        key={eng}
                        className={`engine-pill ${options.engine === eng ? 'active' : ''}`}
                        onClick={() => setOptions({ ...options, engine: eng })}
                      >
                        {eng.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <button
                    className={`copy-btn ${copiedKey === 'engine' ? 'copied' : ''}`}
                    onClick={() => handleCopy(enginePromptText, 'engine')}
                    style={{ background: '#fff', color: '#000', fontWeight: 600, border: 'none' }}
                  >
                    {copiedKey === 'engine' ? '✓' : 'Copy Prompt'}
                  </button>
                </div>
                <div className="prompt-card-body" style={{ padding: '32px' }}>
                  <div className="prompt-text-flux" style={{ fontSize: '1.2rem', lineHeight: 1.5, color: '#fff', letterSpacing: '-0.01em' }}>
                    {enginePromptText}
                  </div>
                </div>
                <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => setShowMicroscope(true)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        🔬 {isEs ? 'Ver ADN Visual' : 'View Visual DNA'}
                      </button>
                      <a href="https://labs.google/fx/es/tools/flow" target="_blank" className="btn-secondary-modern" style={{ fontSize: '0.8rem' }}>
                        Flow Labs 🚀
                      </a>
                   </div>
                   <span style={{ fontSize: '0.7rem', color: '#444' }}>{enginePromptText.length} chars</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="workbench-side">
           <div className="workbench-panel">
              <h2 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#666', marginBottom: '20px', letterSpacing: '0.05em' }}>
                Director Control <span style={{ color: 'var(--accent-primary)' }}>/</span> {isEs ? 'Ajustes' : 'Settings'}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <CharacterManager
                  currentCharacterData={result?.analysis.character}
                  currentThumbnail={slots.character?.preview}
                  onLoadCharacter={handleLoadSavedCharacter}
                  isEs={isEs}
                />

                {loadedCharName && (
                  <div style={{ padding: '8px', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', borderRadius: '8px', textAlign: 'center', color: '#c4b5fd', fontSize: '0.85rem' }}>
                    🎭 {isEs ? `Personaje: "${loadedCharName}"` : `Character: "${loadedCharName}"`}
                  </div>
                )}

                <div className="tweaker-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div className="tweaker-control" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '8px', display: 'block' }}>Aspect Ratio</label>
                    <select className="tweaker-select" style={{ width: '100%', background: '#111' }} value={options.aspectRatio} onChange={e => setOptions({...options, aspectRatio: e.target.value})}>
                      <option value="1:1">1:1 Square</option>
                      <option value="16:9">16:9 Landscape</option>
                      <option value="9:16">9:16 Portrait</option>
                      <option value="21:9">21:9 Cinematic</option>
                    </select>
                  </div>

                  <div className="tweaker-control" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '8px', display: 'block' }}>{isEs ? 'Filtro de Estilo' : 'Style Filter'}</label>
                    <select className="tweaker-select" style={{ width: '100%', background: '#111' }} value={options.stylePreset} onChange={e => setOptions({...options, stylePreset: e.target.value})}>
                      <option value="None">{isEs ? 'Ninguno (Original)' : 'None (Raw)'}</option>
                      <option value="Anime">Anime</option>
                      <option value="Cinematic">Cinematic 35mm</option>
                      <option value="Oil Painting">Oil Painting</option>
                      <option value="3D Render">3D Render (Unreal)</option>
                      <option value="Cyberpunk">Cyberpunk</option>
                      <option value="Watercolor">Watercolor</option>
                    </select>
                  </div>

                  <div className="tweaker-control">
                    <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '8px', display: 'block' }}>{isEs ? 'Peso Personaje' : 'Char Weight'}: {options.weights.character.toFixed(1)}</label>
                    <input type="range" className="tweaker-range" min="0.5" max="1.5" step="0.1" value={options.weights.character} onChange={e => setOptions({...options, weights: {...options.weights, character: parseFloat(e.target.value)}})} />
                  </div>

                  <div className="tweaker-control">
                    <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '8px', display: 'block' }}>{isEs ? 'Peso Entorno' : 'Env Weight'}: {options.weights.setting.toFixed(1)}</label>
                    <input type="range" className="tweaker-range" min="0.5" max="1.5" step="0.1" value={options.weights.setting} onChange={e => setOptions({...options, weights: {...options.weights, setting: parseFloat(e.target.value)}})} />
                  </div>

                  <div className="tweaker-control">
                    <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '8px', display: 'block' }}>{isEs ? 'Peso Atmósfera' : 'Atmos Weight'}: {options.weights.atmosphere.toFixed(1)}</label>
                    <input type="range" className="tweaker-range" min="0.5" max="1.5" step="0.1" value={options.weights.atmosphere} onChange={e => setOptions({...options, weights: {...options.weights, atmosphere: parseFloat(e.target.value)}})} />
                  </div>
                </div>

                {!isAnalyzing ? (
                  <button
                    className="analyze-btn"
                    onClick={handleAnalyze}
                    disabled={!hasBase}
                    style={{ marginTop: '20px', padding: '16px', borderRadius: '8px' }}
                  >
                    <span>✨ {isEs ? 'Ejecutar Análisis' : 'Run Analysis'}</span>
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div className="loading-spinner" style={{ width: '24px', height: '24px', margin: '0 auto 10px' }} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{isEs ? 'Analizando...' : 'Processing...'}</p>
                  </div>
                )}
              </div>
           </div>

           <BatchPanel
            isEs={isEs}
            baseSlotFile={slots.base?.file || null}
            characterSlotFile={slots.character?.file || null}
            language={language}
            targetEngine={options.engine}
            onBatchResult={() => {}}
          />

           <HistoryPanel />
        </div>
      </div>

      {error && (
        <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '12px 24px', borderRadius: '100px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 2000 }}>
          {error}
        </div>
      )}

      {showMicroscope && result && (
        <div className="microscope-overlay" onClick={() => setShowMicroscope(false)}>
          <div className="microscope-content" onClick={e => e.stopPropagation()}>
            <div className="microscope-header">
              <h2 className="microscope-title">Visual DNA <span style={{ color: 'var(--accent-primary)' }}>Microscope</span></h2>
              <button className="close-microscope" onClick={() => setShowMicroscope(false)}>✕ Close</button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Detailed Technical Prompt */}
              <div className="microscope-card" style={{ border: '1px solid rgba(139, 92, 246, 0.2)', background: 'rgba(139, 92, 246, 0.02)' }}>
                <p className="microscope-label">Macro-Prompt Structure</p>
                <div style={{ marginTop: '12px', maxHeight: '150px', overflowY: 'auto' }}>
                   <pre style={{ fontSize: '0.8rem', color: '#a78bfa', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{detailedPromptText}</pre>
                </div>
              </div>

              {/* Character Details in Microscope */}
              {result.analysis.character && (
                <div className="microscope-card" style={{ borderLeft: '2px solid var(--accent-primary)' }}>
                  <p className="microscope-label">Identity Core</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    {Object.entries(result.analysis.character).map(([key, value]) => (
                      value && value !== 'Not applicable' ? (
                        <div key={key}>
                           <p style={{ fontSize: '0.65rem', color: '#555', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</p>
                           <p style={{ fontSize: '0.85rem', color: '#ccc' }}>{String(value)}</p>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}

              {/* Other Categories */}
              {ANALYSIS_CATEGORIES.map(cat => {
                if (cat.key === 'character') return null;
                const data = (result.analysis as any)[cat.key];
                if (!data) return null;

                return (
                  <div key={cat.key} className="microscope-card">
                    <p className="microscope-label">{cat.titleEn}</p>
                    <div style={{ marginTop: '8px' }}>
                      {/* Special handling for color palette */}
                      {cat.key === 'colorPalette' && 'dominantColors' in data && (
                        <div style={{ marginBottom: '12px' }}>
                           <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                             {extractHexColors(data.dominantColors).map((c, i) => (
                               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#888' }}>
                                 {c.hex && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.hex }} />}
                                 {c.text}
                               </div>
                             ))}
                           </div>
                        </div>
                      )}
                      
                      {Object.entries(data).map(([key, value]) => (
                        value && value !== 'Not applicable' && key !== 'dominantColors' ? (
                          <div key={key} style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#555', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{String(value)}</span>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <footer className="footer-bottom" style={{ marginTop: '80px', opacity: 0.3 }}>
        <p>Proms SaaS Suite v2.0 • Digital Studio • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
