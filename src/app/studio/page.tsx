'use client';

import { useStudio } from '@/hooks/useStudio';
import DirectorControl from '@/components/features/studio/DirectorControl';
import ReferenceDock from '@/components/features/studio/ReferenceDock';
import PromptDisplay from '@/components/features/studio/PromptDisplay';
import HistoryPanel from '@/components/features/studio/HistoryPanel';
import DigitalMicroscope from '@/components/features/studio/DigitalMicroscope';
import { ImageRole } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function StudioPage() {
  const {
    slots,
    isAnalyzing,
    result,
    error,
    copiedKey,
    draggingRole, setDraggingRole,
    options, setOptions,
    loadedCharName,
    showMicroscope, setShowMicroscope,
    fileInputRefs,
    handleFileSelect,
    handleDrop,
    removeSlot,
    handleAnalyze,
    handleLoadSavedCharacter,
    handleCopy
  } = useStudio();

  const { language, isEs } = useLanguage();

  return (
    <div className="studio-workspace-container">
      {/* Column 2: Main Creative Canvas (The Manifest) */}
      <main className="studio-canvas">
         <div className="canvas-header">
            <div className="canvas-breadcrumbs">
               <span className="crumb">PROMS.</span>
               <span className="sep">/</span>
               <span className="crumb active">{loadedCharName || (isEs ? 'NUEVO ADN' : 'NEW DNA')}</span>
               <div className="status-dot-active" />
            </div>
         </div>

         <div className="canvas-content">
            {/* Empty state or content */}
            {!slots.base && !result ? (
              <div className="empty-workspace-state">
                <div className="empty-icon-glow">✦</div>
                <h2 className="empty-title">
                  {isEs ? 'Listo para la Ingesta' : 'Ready for Ingestion'}
                </h2>
                <p className="empty-desc">
                  {isEs 
                    ? 'Arrastra tus imágenes de referencia aquí para comenzar el mapeo espectral.' 
                    : 'Drag your reference images here to begin spectral mapping.'}
                </p>
              </div>
            ) : null}

            <ReferenceDock 
              slots={slots}
              draggingRole={draggingRole}
              setDraggingRole={setDraggingRole}
              handleFileSelect={handleFileSelect}
              handleDrop={handleDrop}
              removeSlot={(_e: React.MouseEvent, role: ImageRole) => removeSlot(role)}
              fileInputRefs={fileInputRefs}
            />

            {(slots.base || result) && (
              <div className="canvas-result-area">
                <div className="canvas-spacer" />
                <PromptDisplay 
                  isEs={isEs}
                  language={language}
                  result={result}
                  options={options}
                  setOptions={setOptions}
                  handleCopy={handleCopy}
                  copiedKey={copiedKey}
                  setShowMicroscope={setShowMicroscope}
                />
              </div>
            )}
         </div>
      </main>

      {/* Column 3: Control Inspector & Intelligence */}
      <aside className="studio-inspector">
         <div className="inspector-tabs">
            <button className="inspector-tab active">{isEs ? 'Controles' : 'Controls'}</button>
            <button className="inspector-tab" onClick={() => setShowMicroscope(true)}>
               {isEs ? 'Análisis' : 'Analysis'}
            </button>
         </div>

         <div className="inspector-content">
            <DirectorControl 
              isEs={isEs}
              options={options}
              setOptions={setOptions}
              result={result}
              slots={slots}
              handleLoadSavedCharacter={handleLoadSavedCharacter}
              loadedCharName={loadedCharName}
              isAnalyzing={isAnalyzing}
              handleAnalyze={handleAnalyze}
              hasBase={!!slots.base}
            />

            <div className="inspector-spacer" />
            
            <HistoryPanel isEs={isEs} />
         </div>
      </aside>

      {/* Overlays */}
      <DigitalMicroscope 
        showMicroscope={showMicroscope}
        setShowMicroscope={setShowMicroscope}
        result={result}
        isEs={isEs}
      />

      {error && (
        <div className="studio-toast-error">
           <span>⚠️ {error}</span>
           <button onClick={() => {}}>×</button>
        </div>
      )}
    </div>
  );
}
