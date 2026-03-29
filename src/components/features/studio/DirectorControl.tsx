'use client';

import { PromptOptions, ImageAnalysis, SlotsState } from '@/types';
import { SavedCharacter } from '@/lib/db/history';
import CharacterManager from './CharacterManager';

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
  );
}
