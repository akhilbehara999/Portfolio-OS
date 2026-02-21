import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWindowStore } from '../../store/window.store';
import { APP_REGISTRY } from '../../config/app-registry';
import { ContextMenu } from '../shared/ContextMenu';
import * as LucideIcons from 'react-icons/lu';
import type { IconType } from 'react-icons';

// Mapping for icons
const getIconComponent = (iconName: string): IconType => {
  // Convert kebab-case to PascalCase (e.g. 'folder-code' -> 'FolderCode')
  const pascalCase = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  // Prepend 'Lu' as react-icons/lu exports are usually LuName
  const iconKey = `Lu${pascalCase}`;

  return (LucideIcons as any)[iconKey] || LucideIcons.LuAppWindow;
};

interface DesktopIconProps {
  id: string;
  name: string;
  icon: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onLaunch: (id: string) => void;
  onRemove: (id: string) => void;
}

const DesktopIcon = ({
  id,
  name,
  icon,
  isSelected,
  onSelect,
  onLaunch,
  onRemove,
}: DesktopIconProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = getIconComponent(icon);

  const contextMenuItems = [
    { label: 'Open', action: () => onLaunch(id), icon: 'Maximize' },
    { label: 'Remove Shortcut', action: () => onRemove(id), icon: 'Trash2' },
  ];

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ContextMenu items={contextMenuItems}>
        <div
          className={`
            w-[90px] h-[100px] flex flex-col items-center justify-center p-2 rounded-md
            cursor-default select-none group transition-colors duration-200
            ${isSelected ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'hover:bg-white/10'}
          `}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onLaunch(id);
          }}
        >
          <div className="w-12 h-12 flex items-center justify-center mb-1 text-white filter drop-shadow-md">
            <IconComponent size={32} />
          </div>
          <span
            className="text-xs text-white text-center font-medium drop-shadow-md line-clamp-2 px-1 leading-tight w-full break-words"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            {name}
          </span>
        </div>
      </ContextMenu>
    </div>
  );
};

export const DesktopIconGrid: React.FC = () => {
  const { openWindow } = useWindowStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter specific apps for desktop
  const desktopApps = [
    'about',
    'skills',
    'education',
    'experience',
    'projects',
    'certifications',
    'contact',
    'gallery',
    'resume',
    'terminal',
    'settings',
    'file-explorer',
    'browser',
  ];
  const initialItems = desktopApps
    .map((id) => APP_REGISTRY.find((app) => app.id === id))
    .filter((app): app is NonNullable<typeof app> => !!app);

  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  // Deselect when clicking empty space
  useEffect(() => {
    const handleWindowClick = () => setSelectedId(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  return (
    <div className="absolute inset-0 z-10 p-2" onClick={() => setSelectedId(null)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col flex-wrap content-start h-full gap-2 w-fit">
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            {items.map((app) => (
              <DesktopIcon
                key={app.id}
                id={app.id}
                name={app.name}
                icon={app.icon}
                isSelected={selectedId === app.id}
                onSelect={setSelectedId}
                onLaunch={(id) => openWindow(id)}
                onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId ? (
            <DesktopIcon
              id={activeId}
              name={items.find((i) => i.id === activeId)?.name || ''}
              icon={items.find((i) => i.id === activeId)?.icon || ''}
              isSelected={true}
              onSelect={() => {}}
              onLaunch={() => {}}
              onRemove={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DesktopIconGrid;
