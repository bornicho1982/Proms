import type { ImageAnalysis } from '../lib/gemini/client';
import type { PromptOptions, TargetEngine } from '../lib/prompts/generator';

export type Language = 'es' | 'en';

export type ImageRole = 'base' | 'character' | 'pose' | 'setting' | 'atmosphere';

export interface ImageInput {
  role: ImageRole;
  mimeType: string;
  base64: string;
}

export interface AnalysisResult {
  analysis: ImageAnalysis;
}

export type SlotsState = Record<ImageRole, { file: File; preview: string } | null>;

export { type ImageAnalysis, type PromptOptions, type TargetEngine };
