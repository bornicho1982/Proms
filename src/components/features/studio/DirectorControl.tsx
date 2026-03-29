'use client';

import { PromptOptions, ImageAnalysis, SlotsState } from '@/types';
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
        <h4 className="section-label">{isEs ? 'PERSONAJE' : 'CHARACTER'}</h4>
        <CharacterManager
          currentCharacterData={result?.analysis.character}
          currentThumbnail={slots.character?.preview}
          onLoadCharacter={handleLoadSavedCharacter}
          isEs={isEs}
        />
        {loadedCharName && (
          <div className="char-status-badge">
             {isEs ? `ID: ${loadedCharName}` : `ID: ${loadedCharName}`}
          </div>
        )}
      </div>

      <div className="inspector-spacer" />

      <div className="inspector-section">
        <h4 className="section-label">{isEs ? 'PARÁMETROS' : 'PARAMETERS'}</h4>
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
            <label>{isEs ? 'Estilo' : 'Style'}</label>
            <select className="inspector-select" value={options.stylePreset} onChange={e => setOptions({...options, stylePreset: e.target.value})}>
              <option value="None">{isEs ? 'Ninguno' : 'Raw'}</option>
              <option value="Anime">Anime</option>
              <option value="Cinematic">Cinematic</option>
              <option value="3D Render">3D Render</option>
              <option value="Cyberpunk">Cyberpunk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="inspector-spacer" />

      <div className="inspector-section">
        <h4 className="section-label">{isEs ? 'PESOS ESPECTRALES' : 'SPECTRAL WEIGHTS'}</h4>
        <div className="weights-stack">
          {(['character', 'setting', 'atmosphere'] as const).map((key) => (
            <div key={key} className="weight-control">
              <div className="weight-header">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span>{options.weights[key].toFixed(1)}</span>
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
          ))}
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
