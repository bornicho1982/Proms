'use client';

import { useState, useCallback, useRef } from 'react';
import type { ImageRole, ImageInput, TargetEngine } from '@/types';
import { fileToBase64 } from '@/lib/utils/image';
import { delay, fetchWithRetry } from '@/lib/utils/common';

interface BatchItem {
  id: number;
  settingPreview: string;
  settingFile: File;
  generatedPrompt: string | null;
  isProcessing: boolean;
}

interface BatchPanelProps {
  isEs: boolean;
  baseSlotFile: File | null;
  characterSlotFile: File | null;
  language: string;
  targetEngine: TargetEngine;
  onBatchResult: (prompts: string[]) => void;
}

export default function BatchPanel({ isEs, baseSlotFile, characterSlotFile, language, targetEngine, onBatchResult }: BatchPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [batchResults, setBatchResults] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleAddSettings = useCallback((files: FileList) => {
    const newItems: BatchItem[] = [];
    Array.from(files).forEach((file, idx) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        newItems.push({
          id: Date.now() + idx,
          settingPreview: e.target?.result as string,
          settingFile: file,
          generatedPrompt: null,
          isProcessing: false,
        });
        if (newItems.length === files.length || newItems.length === Array.from(files).filter(f => f.type.startsWith('image/')).length) {
          setBatchItems(prev => [...prev, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeBatchItem = (id: number) => {
    setBatchItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRunBatch = async () => {
    if (!baseSlotFile || batchItems.length === 0) return;
    setIsRunning(true);
    setBatchResults([]);
    const results: string[] = [];

    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      setBatchItems(prev => prev.map(b => b.id === item.id ? { ...b, isProcessing: true } : b));

      try {
        const imagesPayload: ImageInput[] = [];

        // Base
        const baseB64 = await fileToBase64(baseSlotFile);
        imagesPayload.push({ role: 'base' as ImageRole, mimeType: baseSlotFile.type, base64: baseB64 });

        // Character (if provided)
        if (characterSlotFile) {
          const charB64 = await fileToBase64(characterSlotFile);
          imagesPayload.push({ role: 'character' as ImageRole, mimeType: characterSlotFile.type, base64: charB64 });
        }

        // Setting from batch
        const settingB64 = await fileToBase64(item.settingFile);
        imagesPayload.push({ role: 'setting' as ImageRole, mimeType: item.settingFile.type, base64: settingB64 });

        const response = await fetchWithRetry('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: imagesPayload, language }),
        });

        const data = await response.json();
        const { generateEnginePrompt, DEFAULT_OPTIONS } = await import('@/lib/prompts/generator');
        const prompt = generateEnginePrompt(data.analysis, { ...DEFAULT_OPTIONS, engine: targetEngine });
        
        results.push(prompt);
        setBatchItems(prev => prev.map(b => b.id === item.id ? { ...b, isProcessing: false, generatedPrompt: prompt } : b));
      } catch (err) {
        results.push(`[Error: ${err instanceof Error ? err.message : 'unknown'}]`);
        setBatchItems(prev => prev.map(b => b.id === item.id ? { ...b, isProcessing: false, generatedPrompt: '[Error]' } : b));
      }

      // Wait 5 seconds between scenes to respect Gemini rate limits
      if (i < batchItems.length - 1) {
        await delay(5000);
      }
    }

    setBatchResults(results);
    onBatchResult(results);
    setIsRunning(false);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    const all = batchResults.join('\n\n---\n\n');
    navigator.clipboard.writeText(all);
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', padding: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
          cursor: 'pointer', fontWeight: '600', fontSize: '1rem',
          boxShadow: '0 2px 10px rgba(245,158,11,0.3)'
        }}
      >
        🎬 {isEs ? 'Producción en Lote (Batch)' : 'Batch Production'} — {batchItems.length} {isEs ? 'escenas' : 'scenes'}
      </button>

      {isOpen && (
        <div style={{
          marginTop: '12px', background: 'rgba(0,0,0,0.4)', padding: '20px',
          borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.3)'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            {isEs
              ? 'Sube múltiples escenarios. Proms generará un prompt distinto para cada uno, manteniendo tu personaje y estilo base.'
              : 'Upload multiple settings. Proms will generate a different prompt for each, keeping your character and base style.'}
          </p>

          {/* Upload Multiple */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1, padding: '12px',
                background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                border: '2px dashed rgba(245,158,11,0.4)', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', fontWeight: '600'
              }}
            >
              📁 {isEs ? 'Añadir Escenarios (Múltiples)' : 'Add Settings (Multiple)'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files) handleAddSettings(e.target.files); }}
            />
          </div>

          {/* Preview Grid */}
          {batchItems.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              {batchItems.map((item, idx) => (
                <div key={item.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: item.isProcessing ? '2px solid #f59e0b' : item.generatedPrompt ? '2px solid #22c55e' : '1px solid var(--color-border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.settingPreview} alt={`Scene ${idx+1}`} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '2px', left: '2px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'white' }}>
                    #{idx + 1}
                  </div>
                  {item.isProcessing && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>⏳</div>
                  )}
                  {item.generatedPrompt && !item.isProcessing && (
                    <div style={{ position: 'absolute', top: '2px', right: '2px', background: '#22c55e', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>✓</div>
                  )}
                  <button
                    onClick={() => removeBatchItem(item.id)}
                    style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', borderRadius: '4px', padding: '2px 4px', fontSize: '0.65rem', cursor: 'pointer' }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Run Button */}
          {batchItems.length > 0 && (
            <button
              onClick={handleRunBatch}
              disabled={isRunning || !baseSlotFile}
              style={{
                width: '100%', padding: '14px',
                background: isRunning ? 'rgba(245,158,11,0.3)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: '1rem', fontWeight: 'bold', cursor: isRunning ? 'wait' : 'pointer',
                marginBottom: '16px'
              }}
            >
              {isRunning
                ? (isEs ? '⏳ Procesando escenas...' : '⏳ Processing scenes...')
                : (isEs ? `🚀 Generar ${batchItems.length} Prompts Distintos` : `🚀 Generate ${batchItems.length} Different Prompts`)}
            </button>
          )}

          {/* Results */}
          {batchResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#f59e0b' }}>
                  {isEs ? `✅ ${batchResults.length} Prompts Generados` : `✅ ${batchResults.length} Prompts Generated`}
                </h4>
                <button
                  onClick={handleCopyAll}
                  style={{ padding: '6px 14px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  {copiedIdx === -1 ? '✓' : (isEs ? '📋 Copiar Todos' : '📋 Copy All')}
                </button>
              </div>
              {batchResults.map((prompt, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#f59e0b', fontSize: '0.9rem' }}>
                      🎬 {isEs ? `Escena ${idx + 1}` : `Scene ${idx + 1}`}
                    </span>
                    <button
                      onClick={() => handleCopy(prompt, idx)}
                      style={{ padding: '4px 10px', background: copiedIdx === idx ? '#22c55e' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      {copiedIdx === idx ? '✓' : '📋'}
                    </button>
                  </div>
                  <div style={{ fontSize: '0.85rem', maxHeight: '80px', overflowY: 'auto', color: 'var(--color-text)' }}>
                    {prompt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
