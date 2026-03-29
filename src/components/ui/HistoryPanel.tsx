'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, deleteHistoryItem, clearHistory } from '@/lib/db/history';
import { useState } from 'react';

export default function HistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useLiveQuery(() => db.history.orderBy('date').reverse().toArray());

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className="history-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 24px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>🖼️ Historial</span>
        <span style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '2px 8px', 
          borderRadius: '10px',
          fontSize: '0.8rem' 
        }}>
          {items?.length || 0}
        </span>
      </button>

      {/* Sidebar Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
          zIndex: 99,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Historial de Generaciones</h2>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.5rem' }}
            >
              ×
            </button>
          </div>

          {items && items.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('¿Borrar todo el historial?')) clearHistory();
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🗑️ Limpiar Historial
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!items || items.length === 0 ? (
              <p style={{ color: 'var(--color-primary-light)', textAlign: 'center', marginTop: '40px' }}>
                Tu historial está vacío. ¡Analiza imágenes para empezar a llenarlo!
              </p>
            ) : (
              items.map((item) => (
                <div key={item.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {item.images.map((img, idx) => (
                      <div key={idx} style={{ flexShrink: 0, width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                        <span style={{ position: 'absolute', bottom: 0, left: 0, background: 'rgba(0,0,0,0.7)', fontSize: '0.6rem', padding: '2px 4px' }}>{img.role}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`data:${img.mimeType};base64,${img.base64}`} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)' }}>
                    📅 {new Date(item.date).toLocaleString()} | AR: {item.aspectRatio}
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', maxHeight: '100px', overflowY: 'auto' }}>
                    {item.fluxPrompt}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleCopy(item.fluxPrompt)}
                      style={{ flex: 1, background: 'var(--color-primary)', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >📋 FLUX</button>
                    {item.negativePrompt && (
                      <button 
                        onClick={() => handleCopy(item.negativePrompt!)}
                        style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                      >🚫 NEG</button>
                    )}
                    <button 
                      onClick={() => {
                        if (window.confirm('¿Borrar este item?')) deleteHistoryItem(item.id!);
                      }}
                      style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
