import { AnalysisResult } from '@/types';
import { ANALYSIS_CATEGORIES } from '@/constants/studio';
import { extractHexColors } from '@/lib/utils/image';

interface DigitalMicroscopeProps {
  showMicroscope: boolean;
  setShowMicroscope: (show: boolean) => void;
  result: AnalysisResult | null;
  isEs: boolean;
}

export default function DigitalMicroscope({
  showMicroscope,
  setShowMicroscope,
  result,
  isEs
}: DigitalMicroscopeProps) {
  if (!showMicroscope || !result) return null;

  return (
    <div className={`microscope-overlay ${showMicroscope ? 'active' : ''}`}>
      <div className="microscope-header">
        <h3 className="microscope-title">
          🔬 {isEs ? 'ADN Visual de la Imagen' : 'Spectral Visual DNA'}
        </h3>
        <button className="microscope-close" onClick={() => setShowMicroscope(false)}>✕</button>
      </div>
      
      <div className="microscope-content">
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Detailed Technical Prompt */}
          <div className="microscope-card" style={{ border: '1px solid rgba(139, 92, 246, 0.2)', background: 'rgba(139, 92, 246, 0.02)' }}>
            <p className="microscope-label">Macro-Prompt Structure</p>
            <div style={{ marginTop: '12px', maxHeight: '150px', overflowY: 'auto' }}>
               <pre style={{ fontSize: '0.8rem', color: '#a78bfa', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                 {/* This would be the detailed prompt text. We'll pass it if needed, or compute it here */}
               </pre>
            </div>
          </div>

          {/* Categories Analysis */}
          {ANALYSIS_CATEGORIES.map(cat => {
            const data = result.analysis[cat.key];
            if (!data || typeof data === 'string') return null;

            return (
              <div key={cat.key} className="microscope-card" style={{ borderLeft: cat.key === 'character' ? '2px solid var(--accent-primary)' : '1px solid var(--color-border)' }}>
                <p className="microscope-label">{cat.icon} {isEs ? cat.titleEs : cat.titleEn}</p>
                <div style={{ marginTop: '12px' }}>
                  {cat.key === 'colorPalette' && 'dominantColors' in data && (
                    <div style={{ marginBottom: '12px' }}>
                       <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                         {extractHexColors(data.dominantColors as string[]).map((c, i) => (
                           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                             {c.hex && <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: c.hex }} />}
                             <span style={{ fontSize: '0.6rem', color: '#888' }}>{c.text}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                    {cat.fields.map(field => {
                      const val = data[field.key];
                      if (!val || val === 'Not applicable' || val === 'No aplicable') return null;
                      return (
                        <div key={field.key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                          <span style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase' }}>{isEs ? field.labelEs : field.labelEn}</span>
                          <span style={{ fontSize: '0.7rem', color: '#eee', textAlign: 'right', maxWidth: '60%' }}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
