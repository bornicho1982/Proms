'use client';

import { Language, TargetEngine, PromptOptions, AnalysisResult } from '@/types';
import { generateEnginePrompt, generateDetailedPrompt } from '@/lib/prompts/generator';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
    <div className="output-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', border: '1px dashed rgba(255,255,255,0.05)', background: 'transparent' }}>
       <p style={{ color: '#444', fontSize: '0.8rem', textAlign: 'center' }}>
         {isEs ? 'Esperando datos de estudio...' : 'Waiting for studio data...'}
       </p>
    </div>
  );

  const enginePromptText = generateEnginePrompt(result.analysis, options);
  const detailedPromptText = generateDetailedPrompt(result.analysis, language);

  return (
    <div className="output-panel active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#666', letterSpacing: '0.05em' }}>
          Engine Output <span style={{ color: 'var(--accent-primary)' }}>/</span> {isEs ? 'Resultado' : 'Result'}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
           <button 
             className="btn-micro" 
             onClick={() => setShowMicroscope(true)}
             style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.2)' }}
           >
             🔬 {isEs ? 'Ver ADN Visual' : 'Visual DNA'}
           </button>
           <select 
             className="engine-select" 
             value={options.engine} 
             onChange={e => setOptions({...options, engine: e.target.value as TargetEngine})}
           >
             <option value="FLUX.1">FLUX.1 [dev/pro]</option>
             <option value="Midjourney V6.1">Midjourney V6.1</option>
             <option value="DALL-E 3">DALL-E 3</option>
             <option value="Stable Diffusion 3">Stable Diffusion 3</option>
           </select>
        </div>
      </div>

      <Card className="prompt-card glass-card">
         <div className="prompt-header">
           <Badge variant="primary">ENGINE OPTIMIZED</Badge>
           <Button variant="ghost" className="copy-btn" onClick={() => handleCopy(enginePromptText, 'engine')}>
             {copiedKey === 'engine' ? 'COPIED!' : 'COPY PROMPT'}
           </Button>
         </div>
         <div className="prompt-text">
           {enginePromptText}
         </div>
      </Card>

      <Card className="prompt-card glass-card" style={{ marginTop: '16px', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
         <div className="prompt-header">
           <Badge variant="accent" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>DETAILED SPECTRAL</Badge>
           <Button variant="ghost" className="copy-btn" onClick={() => handleCopy(detailedPromptText, 'detailed')}>
             {copiedKey === 'detailed' ? 'COPIED!' : 'COPY PROMPT'}
           </Button>
         </div>
         <div className="prompt-text" style={{ color: '#a78bfa', fontSize: '0.85rem' }}>
           {detailedPromptText}
         </div>
      </Card>
    </div>
  );
}
