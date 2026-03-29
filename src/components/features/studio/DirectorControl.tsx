'use client';

import { TargetEngine, PromptOptions, ImageAnalysis, SlotsState } from '@/types';
import { SavedCharacter } from '@/lib/db/history';
import CharacterManager from './CharacterManager';
import { Button } from '@/components/ui/Button';

interface DirectorControlProps {
  isEs: boolean;
  options: PromptOptions;
  setOptions: (options: PromptOptions) => void;
  result: { analysis: ImageAnalysis } | null;
  slots: SlotsState;
  handleLoadSavedCharacter: (char: SavedCharacter) => void;
  loadedCharName: string | null;
  isAnalyzing: boolean;
  handleAnalyze: () => void;
  hasBase: boolean;
}

export default function DirectorControl({
  isEs,
  options,
  setOptions,
  result,
  slots,
  handleLoadSavedCharacter,
  loadedCharName,
  isAnalyzing,
  handleAnalyze,
  hasBase
}: DirectorControlProps) {
  return (
    <div className="inspector-panel">
      <div className="inspector-section">
        <h4 className="section-label">{isEs ? 'SESIÓN ACTIVA' : 'ACTIVE SESSION'}</h4>
        <div className="inspector-card-group">
          <CharacterManager
            currentCharacterData={result?.analysis.character}
            currentThumbnail={slots.character?.preview}
            onLoadCharacter={handleLoadSavedCharacter}
            isEs={isEs}
          />
          {loadedCharName && (
            <div className="char-status-badge animate-in">
               {isEs ? `ID: ${loadedCharName}` : `ID: ${loadedCharName}`}
            </div>
          )}
        </div>
      </div>

      <div className="inspector-spacer" />

      <div className="inspector-section">
        <h4 className="section-label">{isEs ? 'CONFIGURACIÓN ADN' : 'DNA CONFIG'}</h4>
        <div className="parameters-grid">
          <div className="parameter-control">
            <label>{isEs ? 'Relación' : 'Aspect'}</label>
            <select className="inspector-select" value={options.aspectRatio} onChange={e => setOptions({...options, aspectRatio: e.target.value})}>
              <option value="1:1">1:1 Square</option>
              <option value="16:9">16:9 Landscape</option>
              <option value="9:16">9:16 Portrait</option>
              <option value="21:9">21:9 Cinematic</option>
            </select>
          </div>

          <div className="parameter-control">
            <label>{isEs ? 'Motor IA' : 'AI Engine'}</label>
            <select className="inspector-select" value={options.engine} onChange={e => setOptions({...options, engine: e.target.value as TargetEngine})}>
              <option value="FLUX.1">FLUX.1</option>
              <option value="Midjourney V6.1">Midjourney</option>
              <option value="DALL-E 3">DALL-E 3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="inspector-spacer" />

      <div className="inspector-section">
        <h4 className="section-label">{isEs ? 'PESOS ESPECTRALES' : 'SPECTRAL WEIGHTS'}</h4>
        <div className="weights-stack">
          {(['character', 'setting', 'atmosphere'] as const).map((key) => {
            const labelsMap: Record<string, string> = {
              character: isEs ? 'Personaje' : 'Character',
              setting: isEs ? 'Escenario' : 'Setting',
              atmosphere: isEs ? 'Atmósfera' : 'Atmos'
            };
            return (
              <div key={key} className="weight-control">
                <div className="weight-header">
                  <span>{labelsMap[key].toUpperCase()}</span>
                  <span className="weight-val">{options.weights[key].toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  className="inspector-range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.1" 
                  value={options.weights[key]} 
                  onChange={e => setOptions({...options, weights: {...options.weights, [key]: parseFloat(e.target.value)}})} 
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="inspector-action-bar">
        <Button
          variant="primary"
          className="btn-full btn-spectral"
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
          disabled={!hasBase}
        >
          {isEs ? 'EJECUTAR ANÁLISIS' : 'RUN ANALYSIS'}
        </Button>
      </div>
    </div>
  );
}
