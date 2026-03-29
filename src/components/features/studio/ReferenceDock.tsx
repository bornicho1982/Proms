import { ImageRole, SlotsState } from '@/types';
import { ROLES_CONFIG } from '@/constants/studio';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as Icons from '@/components/ui/Icons';

interface ReferenceDockProps {
  slots: SlotsState;
  draggingRole: ImageRole | null;
  setDraggingRole: (role: ImageRole | null) => void;
  handleFileSelect: (file: File, role: ImageRole) => void;
  handleDrop: (e: React.DragEvent, role: ImageRole) => void;
  removeSlot: (e: React.MouseEvent, role: ImageRole) => void;
  fileInputRefs: Record<ImageRole, React.RefObject<HTMLInputElement | null>>;
}

export default function ReferenceDock({
  slots,
  draggingRole,
  setDraggingRole,
  handleFileSelect,
  handleDrop,
  removeSlot,
  fileInputRefs
}: ReferenceDockProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
       case 'base': return <Icons.IconCamera size={18} />;
       case 'character': return <Icons.IconScanFace size={18} />;
       case 'pose': return <Icons.IconWand size={18} />;
       default: return <Icons.IconWand size={18} />;
    }
  };

  return (
    <div className="reference-dock">
      <div className="dock-header">
        <h2 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#666', letterSpacing: '0.05em' }}>
          References <span style={{ color: 'var(--accent-primary)' }}>/</span> Módulos de Entrada
        </h2>
      </div>
      
      <div className="dock-grid">
        {ROLES_CONFIG.map(({ role, titleEn, required }) => {
          const slot = slots[role];
          const isActive = !!slot;
          
          return (
            <Card 
              key={role}
              variant={isActive ? 'accent' : 'glass'}
              className={`reference-module ${role}-module ${isActive ? 'active' : ''} ${draggingRole === role ? 'dragging' : ''}`}
              onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDraggingRole(role); }}
              onDragLeave={() => setDraggingRole(null)}
              onDrop={(e: React.DragEvent) => handleDrop(e, role)}
              onClick={() => !isActive && fileInputRefs[role].current?.click()}
            >
              <div className="module-header">
                <span className="module-icon">{getRoleIcon(role)}</span>
                <span className="module-title">{titleEn}</span>
                {required && <span className="module-tag">REQ</span>}
              </div>

              {isActive ? (
                <div className="module-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slot.preview} alt={role} />
                  <Button variant="danger" size="sm" className="remove-slot" onClick={(e) => removeSlot(e, role)}>✕</Button>
                </div>
              ) : (
                <div className="module-placeholder">
                  <span style={{ fontSize: '0.65rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ADD REF</span>
                </div>
              )}

              <input
                ref={fileInputRefs[role]}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0], role)}
                style={{ display: 'none' }}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
