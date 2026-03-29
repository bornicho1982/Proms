'use client';

import { useState } from 'react';
import { IconCamera, IconScanFace, IconWand } from '@/components/ui/Icons';

type Tab = 'style' | 'bio' | 'tensor';

const demoCode = {
  style: `const styleData = {
  lens: "35mm f/1.8",
  lighting: "Volumetric Neon",
  filmStock: "Cinestill 800T",
  colorGrade: "#8b5cf6, #000000"
};
// Extraído de: Referencia_A.jpg`,
  bio: `const biometricData = {
  jawline: "Angular, sharp",
  eyeColor: "Deep Amber",
  ethnicFeatures: "Mixed European",
  expression: "Subtle smirk"
};
// Rostro anclado con éxito.`,
  tensor: `const visionData = {
  ...styleData,
  ...biometricData
};

// Compilando mega-prompt...
const midjourneyPrompt = "--ar 16:9 --v 6.1 --style raw";
[STATUS]: Tensor fusionado al 100%.`
};

export const VisualMockup = ({ isEs = true }: { isEs?: boolean }) => {
  const [activeTab, setActiveTab] = useState<Tab>('tensor');
  const currentCode = demoCode[activeTab];

  return (
    <div className="mockup-container-modern" id="demo">
      <div className="mockup-header-modern">
        <div className="mockup-dots"><span/><span/><span/></div>
        <div className="mockup-url">proms.ai / workspace</div>
      </div>
      
      <div className="mockup-grid-modern">
         <div 
           className={`mockup-slot ${activeTab === 'style' ? 'active-slot-modern' : ''}`}
           onClick={() => setActiveTab('style')}
           style={{ cursor: 'pointer' }}
         >
           <IconCamera size={24} />
           <p>{isEs ? 'Input: Estilo Base' : 'Input: Base Style'}</p>
         </div>
         <div 
           className={`mockup-slot ${activeTab === 'bio' ? 'active-slot-modern' : ''}`}
           onClick={() => setActiveTab('bio')}
           style={{ cursor: 'pointer' }}
         >
           <IconScanFace size={24} />
           <p>{isEs ? 'Input: Biometría' : 'Input: Biometrics'}</p>
         </div>
         <div 
           className={`mockup-slot ${activeTab === 'tensor' ? 'active-slot-modern' : ''}`}
           onClick={() => setActiveTab('tensor')}
           style={{ cursor: 'pointer' }}
         >
           <IconWand size={24} />
           <p>{isEs ? 'Analizando Tensor...' : 'Analyzing Tensor...'}</p>
         </div>
         
         <div className="mockup-output-modern">
           <div className="code-block-modern">
             {currentCode.split('\n').map((line, i) => {
               const isKeyword = line.includes('const') || line.includes('let');
               const isComment = line.includes('//') || line.includes('/*');
               const isStatus = line.includes('[STATUS]');
               
               return (
                 <div key={i} className="code-line">
                   <span className="line-num">{i + 1}</span>
                   <span className={`line-content ${isKeyword ? 'keyword' : ''} ${isComment ? 'comment' : ''} ${isStatus ? 'status' : ''}`}>
                     {line}
                   </span>
                 </div>
               );
             })}
           </div>
         </div>
      </div>
    </div>
  );
};
