'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, saveCharacter, deleteCharacter, type SavedCharacter } from '@/lib/db/history';
import type { ImageAnalysis } from '@/types';

interface CharacterManagerProps {
  currentCharacterData?: ImageAnalysis['character'];
  currentThumbnail?: string; // base64 data URL of the current character slot image
  onLoadCharacter: (char: SavedCharacter) => void;
  isEs: boolean;
}

export default function CharacterManager({ currentCharacterData, currentThumbnail, onLoadCharacter, isEs }: CharacterManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const characters = useLiveQuery(() => db.characters.orderBy('createdAt').reverse().toArray());

  const handleSave = async () => {
    if (!saveName.trim() || !currentCharacterData || !currentThumbnail) return;
    setIsSaving(true);
    try {
      await saveCharacter({
        name: saveName.trim(),
        thumbnail: currentThumbnail,
        characterData: currentCharacterData,
        createdAt: Date.now()
      });
      setSaveName('');
      setIsSaving(false);
    } catch {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-md)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', padding: '10px', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
          boxShadow: '0 2px 8px rgba(139,92,246,0.3)'
        }}
      >
        🎭 {isEs ? 'Camerino Virtual' : 'Virtual Dressing Room'} ({characters?.length || 0})
      </button>

      {isOpen && (
        <div style={{
          marginTop: '10px', background: 'rgba(0,0,0,0.4)', padding: '16px',
          borderRadius: 'var(--radius-md)', border: '1px solid rgba(139,92,246,0.3)',
          maxHeight: '400px', overflowY: 'auto'
        }}>
          {/* Save Current */}
          {currentCharacterData && currentThumbnail && (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.85rem', marginBottom: '8px', color: '#a78bfa' }}>
                {isEs ? '💾 Guardar personaje actual:' : '💾 Save current character:'}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={isEs ? 'Nombre del actor...' : 'Actor name...'}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)', color: 'var(--color-text)',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  onClick={handleSave}
                  disabled={!saveName.trim() || isSaving}
                  style={{
                    padding: '8px 16px', background: '#8b5cf6', color: 'white',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                    opacity: !saveName.trim() ? 0.5 : 1
                  }}
                >
                  {isSaving ? '...' : '💾'}
                </button>
              </div>
            </div>
          )}

          {/* Character List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!characters || characters.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                {isEs ? 'No hay personajes guardados. Analiza una imagen con personaje y guárdalo aquí.' : 'No saved characters. Analyze an image with a character and save it here.'}
              </p>
            ) : (
              characters.map((char) => (
                <div key={char.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px', border: '1px solid var(--color-border)'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={char.thumbnail}
                    alt={char.name}
                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{char.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(char.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => onLoadCharacter(char)}
                    style={{
                      padding: '6px 12px', background: '#8b5cf6', color: 'white',
                      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0
                    }}
                  >
                    {isEs ? '📥 Usar' : '📥 Load'}
                  </button>
                  <button
                    onClick={() => { if (char.id && window.confirm(isEs ? '¿Eliminar?' : 'Delete?')) deleteCharacter(char.id); }}
                    style={{
                      padding: '6px 8px', background: 'none',
                      border: '1px solid rgba(255,255,255,0.15)', color: 'white',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
