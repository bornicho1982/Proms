'use client';

import { useStudio } from '@/hooks/useStudio';
import ReferenceDock from '@/components/features/studio/ReferenceDock';
import DirectorControl from '@/components/features/studio/DirectorControl';
import PromptDisplay from '@/components/features/studio/PromptDisplay';
import DigitalMicroscope from '@/components/features/studio/DigitalMicroscope';
import HistoryPanel from '@/components/features/studio/HistoryPanel';
import BatchPanel from '@/components/features/studio/BatchPanel';
import { TargetEngine } from '@/types';

export default function StudioPage() {
  const {
    language, setLanguage,
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

  const isEs = language === 'es';

  return (
    <div className="workbench-container">
      {/* Background Grid */}
      <div className="workbench-grid-bg" />

      {/* Navigation */}
      <nav className="workbench-nav">
        <div className="nav-brand">
          Proms <span className="brand-dot">/</span> <span className="brand-sub">Studio</span>
        </div>
        <div className="nav-actions">
           <div className="lang-switcher">
             <button className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
             <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
           </div>
        </div>
      </nav>

      {/* Main Workbench Layout */}
      <main className="workbench-main">
        {/* Left Side: Inputs & Reference Dock */}
        <div className="workbench-sidebar-left">
           <ReferenceDock 
             slots={slots}
             draggingRole={draggingRole}
             setDraggingRole={setDraggingRole}
             handleFileSelect={handleFileSelect}
             handleDrop={handleDrop}
             removeSlot={(e, role) => removeSlot(role)}
             fileInputRefs={fileInputRefs}
           />

           <div className="workbench-spacer" />

           <HistoryPanel isEs={isEs} />
        </div>

        {/* Center: Controller & Results */}
        <div className="workbench-center-area">
           <div className="center-grid">
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

              <div className="workbench-output-section">
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

                {/* Batch Panel specifically for the center workflow */}
                <BatchPanel 
                  isEs={isEs}
                  baseSlotFile={slots.base?.file || null}
                  characterSlotFile={slots.character?.file || null}
                  language={language}
                  targetEngine={options.engine as TargetEngine}
                  onBatchResult={() => {}} // Could be wired to a global notification
                />
              </div>
           </div>

           {error && (
             <div className="studio-error-banner animate-in">
                <span>⚠️ {error}</span>
                <button onClick={() => {}}>×</button>
             </div>
           )}
        </div>
      </main>

      {/* Right Sidebar: Microscope Overlay */}
      <DigitalMicroscope 
        showMicroscope={showMicroscope}
        setShowMicroscope={setShowMicroscope}
        result={result}
        isEs={isEs}
      />

      <footer className="workbench-footer">
        <div className="footer-status">
           <span className="status-dot online" />
           {isEs ? 'Motor de Mapeo Visual: Optimizado' : 'Visual Mapping Engine: Optimized'}
        </div>
        <div className="footer-credits">
           v0.2.0 <span style={{ color: '#333' }}>|</span> Proms Studio Beta
        </div>
      </footer>
    </div>
  );
}
