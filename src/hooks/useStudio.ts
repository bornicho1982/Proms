'use client';

import { useState, useCallback, useRef } from 'react';
import type { 
  Language, 
  ImageRole, 
  SlotsState, 
  AnalysisResult, 
  PromptOptions, 
  ImageInput 
} from '@/types';
import { DEFAULT_OPTIONS, generateEnginePrompt, generateDetailedPrompt } from '@/lib/prompts/generator';
import { saveToHistory, type SavedCharacter } from '@/lib/db/history';
import { fileToBase64, resizeImage } from '@/lib/utils/image';

import { useLanguage } from '@/context/LanguageContext';

export function useStudio() {
  const { language, setLanguage } = useLanguage();
  const [slots, setSlots] = useState<SlotsState>({ 
    base: null, 
    character: null, 
    pose: null, 
    setting: null, 
    atmosphere: null 
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [draggingRole, setDraggingRole] = useState<ImageRole | null>(null);
  const [options, setOptions] = useState<PromptOptions>(DEFAULT_OPTIONS);
  const [loadedCharName, setLoadedCharName] = useState<string | null>(null);
  const [showMicroscope, setShowMicroscope] = useState(false);

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

  const removeSlot = (role: ImageRole) => {
    setSlots(prev => ({ ...prev, [role]: null }));
    if (fileInputRefs[role].current) {
      fileInputRefs[role].current!.value = '';
    }
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
            mimeType: 'image/jpeg',
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
      
      const computedPrompt = generateEnginePrompt(data.analysis, options);
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
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return {
    language, setLanguage,
    slots, setSlots,
    isAnalyzing,
    result, setResult,
    error, setError,
    copiedKey, setCopiedKey,
    draggingRole, setDraggingRole,
    options, setOptions,
    loadedCharName,
    showMicroscope, setShowMicroscope,
    fileInputRefs,
    handleFileSelect,
    handleDrop,
    removeSlot,
    handleAnalyze,
    handleLoadSavedCharacter,
    handleCopy
  };
}
