'use client';

import { Language, TargetEngine, PromptOptions, AnalysisResult } from '@/types';
import { generateEnginePrompt, generateDetailedPrompt } from '@/lib/prompts/generator';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconScanFace } from '@/components/ui/Icons';

interface PromptDisplayProps {
  isEs: boolean;
  language: Language;
  result: AnalysisResult | null;
  options: PromptOptions;
  setOptions: (options: PromptOptions) => void;
  handleCopy: (text: string, key: string) => void;
  copiedKey: string | null;
  setShowMicroscope: (show: boolean) => void;
}

export default function PromptDisplay({
  isEs,
  language,
  result,
  options,
  setOptions,
  handleCopy,
  copiedKey,
  setShowMicroscope
}: PromptDisplayProps) {
  if (!result) return (
    <div className="manifest-empty-state">
       <div className="empty-state-orb" />
       <div className="empty-state-content animate-in">
         <IconScanFace size={48} className="empty-icon" />
         <p className="empty-text">
           {isEs ? 'SESIÓN SIN ANALIZAR' : 'NO ACTIVE ALGORITHMS'}
         </p>
         <span className="empty-subtext">
           {isEs ? 'Sube o arrastra referencias para generar el Manifiesto Visual.' : 'Upload or drag references to generate the Visual Manifest.'}
         </span>
         <div className="empty-state-actions">
            <div className="drop-zone-outline" />
         </div>
       </div>
    </div>
  );

  const enginePromptText = generateEnginePrompt(result.analysis, options);
  const detailedPromptText = generateDetailedPrompt(result.analysis, language);

  return (
    <div className="manifest-display animate-in">
      <div className="manifest-header">
        <div className="manifest-title-group">
          <Badge variant="accent">GENERACIÓN ACTIVA</Badge>
          <div className="manifest-meta">
             {options.engine} <span className="meta-sep">/</span> {options.aspectRatio}
          </div>
        </div>
        
        <select 
          className="manifest-engine-select" 
          value={options.engine} 
          onChange={e => setOptions({...options, engine: e.target.value as TargetEngine})}
        >
          <option value="FLUX.1">FLUX.1</option>
          <option value="Midjourney V6.1">Midjourney</option>
          <option value="DALL-E 3">DALL-E 3</option>
          <option value="Stable Diffusion 3">Stable Diffusion</option>
        </select>
      </div>

      <div className="manifest-content">
        <Card variant="glass" className="manifest-card card-engine">
          <div className="manifest-card-header">
             <span className="card-label">PROMPT OPTIMIZADO</span>
             <Button 
               variant="ghost" 
               size="sm" 
               className="btn-copy-manifest"
               onClick={() => handleCopy(enginePromptText, 'engine')}
             >
               {copiedKey === 'engine' ? 'COPIADO' : 'COPIAR'}
             </Button>
          </div>
          <p className="manifest-text main-prompt">
            {enginePromptText}
          </p>
        </Card>

        <div className="manifest-spacer" />

        <Card variant="glass" className="manifest-card card-secondary">
          <div className="manifest-card-header">
             <span className="card-label">DETALLE ESPECTRAL</span>
             <Button 
               variant="ghost" 
               size="sm" 
               className="btn-copy-manifest"
               onClick={() => handleCopy(detailedPromptText, 'detailed')}
             >
               {copiedKey === 'detailed' ? 'COPIADO' : 'COPIAR'}
             </Button>
          </div>
          <p className="manifest-text sub-prompt">
            {detailedPromptText}
          </p>
        </Card>
      </div>

      <div className="manifest-footer">
        <Button 
          variant="secondary" 
          className="btn-glow" 
          onClick={() => setShowMicroscope(true)}
        >
          {isEs ? 'ANALIZAR ESTRUCTURA ADN' : 'ANALYZE DNA STRUCTURE'}
        </Button>
      </div>
    </div>
  );
}
