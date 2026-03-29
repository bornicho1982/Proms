'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, saveCharacter, deleteCharacter, type SavedCharacter } from '@/lib/db/history';
import type { ImageAnalysis } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
    <div className="char-manager-container">
      <Button
        variant="ghost"
        size="sm"
        className="btn-full btn-camerino"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isEs ? 'CAMERINO VIRTUAL' : 'DRESSING ROOM'} ({characters?.length || 0})
      </Button>

      {isOpen && (
        <Card variant="glass" className="char-list-overlay animate-in">
          {/* Save Current */}
          {currentCharacterData && currentThumbnail && (
            <div className="char-save-bar">
              <input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder={isEs ? 'Nombre del actor...' : 'Actor name...'}
                className="char-input"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!saveName.trim() || isSaving}
                isLoading={isSaving}
              >
                {isEs ? 'GUARDAR' : 'SAVE'}
              </Button>
            </div>
          )}

          {/* Character List */}
          <div className="char-list-scroll">
            {!characters || characters.length === 0 ? (
              <p className="empty-list-text">
                {isEs ? 'Sin actores guardados.' : 'No saved actors.'}
              </p>
            ) : (
              characters.map((char) => (
                <div key={char.id} className="char-list-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={char.thumbnail} alt={char.name} className="char-item-img" />
                  <div className="char-item-info">
                    <span className="char-name">{char.name}</span>
                    <span className="char-date">{new Date(char.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="char-item-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLoadCharacter(char)}
                    >
                      {isEs ? 'USAR' : 'LOAD'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => { if (char.id && window.confirm(isEs ? '¿Eliminar?' : 'Delete?')) deleteCharacter(char.id); }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
