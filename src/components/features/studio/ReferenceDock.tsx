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
       case 'base': return <Icons.IconCamera size={14} />;
       case 'character': return <Icons.IconScanFace size={14} />;
       case 'pose': return <Icons.IconWand size={14} />;
       case 'setting': return <Icons.IconWand size={14} />;
       case 'atmosphere': return <Icons.IconWand size={14} />;
       default: return <Icons.IconWand size={14} />;
    }
  };

  return (
    <div className="reference-dock">
      <div className="dock-header">
        <h3 className="section-label">REFERENCE MODULES</h3>
      </div>
      
      <div className="dock-grid">
        {ROLES_CONFIG.map(({ role, titleEn, required }) => {
          const slot = slots[role];
          const isActive = !!slot;
          
          return (
            <Card 
              key={role}
              variant={isActive ? 'accent' : 'glass'}
              className={`reference-module ${isActive ? 'active' : ''} ${draggingRole === role ? 'is-dragging' : ''}`}
              onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDraggingRole(role); }}
              onDragLeave={() => setDraggingRole(null)}
              onDrop={(e: React.DragEvent) => handleDrop(e, role)}
              onClick={() => !isActive && fileInputRefs[role].current?.click()}
            >
              <div className="module-header">
                <div className="module-title-group">
                  <span className="module-icon">{getRoleIcon(role)}</span>
                  <span className="module-title">{titleEn.toUpperCase()}</span>
                </div>
                {required && <div className="required-indicator" />}
              </div>

              {isActive ? (
                <div className="module-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slot.preview} alt={role} className="preview-img" />
                  <div className="preview-overlay">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); removeSlot(e, role); }}
                    >
                      {/* Close Icon or text */}
                      ×
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="module-placeholder">
                   <div className="plus-icon">+</div>
                   <div className="placeholder-text">APPEND {role.toUpperCase()}</div>
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
