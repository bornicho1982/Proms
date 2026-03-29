'use client';

import { useStudio } from '@/hooks/useStudio';
import DirectorControl from '@/components/features/studio/DirectorControl';
import ReferenceDock from '@/components/features/studio/ReferenceDock';
import PromptDisplay from '@/components/features/studio/PromptDisplay';
import HistoryPanel from '@/components/features/studio/HistoryPanel';
import DigitalMicroscope from '@/components/features/studio/DigitalMicroscope';
import { ImageRole } from '@/types';

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
    <div className="studio-workspace">
      {/* Background Ambience */}
      <div className="studio-bg-fx" />
      
      {/* Column 1: Workspace ID & Navigation */}
      <aside className="studio-sidebar-nav">
         <div className="workspace-brand">
           Proms<span className="accent-dot">.</span>
         </div>
         
         <div className="workspace-nav-group">
            <h3 className="section-label">{isEs ? 'NAVEGACIÓN' : 'NAVIGATION'}</h3>
            <nav className="workspace-menu">
               <div className="menu-item active">
                 <span className="menu-icon">⚡</span>
                 {isEs ? 'Estudio' : 'Studio'}
               </div>
               <div className="menu-item">
                 <span className="menu-icon"> galerÍa </span>
                 {isEs ? 'Resultados' : 'Gallery'}
               </div>
            </nav>
         </div>

         <div className="sidebar-spacer" />

         <div className="workspace-section user-profile">
            <h3 className="section-label">{isEs ? 'DIRECTOR DE ARTE' : 'ART DIRECTOR'}</h3>
            <div className="user-badge-premium">
               <div className="user-avatar-placeholder" />
               <div className="user-info">
                 <span className="user-name">Director_01</span>
                 <span className="plan-tag">PLAN FREE</span>
               </div>
            </div>
         </div>

         <div className="sidebar-footer">
            <button className="lang-pill-minimal" onClick={() => setLanguage(isEs ? 'en' : 'es')}>
               {language.toUpperCase()}
            </button>
         </div>
      </aside>

      {/* Column 2: Main Creative Canvas (The Manifest) */}
      <main className="studio-canvas">
         <div className="canvas-header">
            <div className="canvas-breadcrumbs">
               <span className="crumb">PROMS</span>
               <span className="sep">/</span>
               <span className="crumb active">{loadedCharName || (isEs ? 'NUEVO ADN' : 'NEW DNA')}</span>
            </div>
         </div>

         <div className="canvas-content">
            {/* Reference Modules moved to the main focus area but in a refined dock */}
            <ReferenceDock 
              slots={slots}
              draggingRole={draggingRole}
              setDraggingRole={setDraggingRole}
              handleFileSelect={handleFileSelect}
              handleDrop={handleDrop}
              removeSlot={(_e: React.MouseEvent, role: ImageRole) => removeSlot(role)}
              fileInputRefs={fileInputRefs}
            />

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
        <div className="studio-toast-error animate-in">
           <span>⚠️ {error}</span>
           <button onClick={() => {}}>×</button>
        </div>
      )}
    </div>
  );
}
