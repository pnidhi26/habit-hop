import React, { useEffect, useState } from 'react';
import iconSettingsData from '../../data/switch_icon';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Divider, Paper, Switch } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';


export default function SwitchMode() {
  const [iconSettings, setIconSettings] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('iconSettings');
    if (stored) {
      setIconSettings(JSON.parse(stored));
    } else {
      setIconSettings(iconSettingsData);
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = iconSettings.findIndex(i => i.key === active.id);
      const newIndex = iconSettings.findIndex(i => i.key === over.id);
      const reordered = arrayMove(iconSettings, oldIndex, newIndex);
      setIconSettings(reordered);
    }
  };

  const toggleVisibility = (index) => {
    const updated = [...iconSettings];
    if (!updated[index].fixed) {
      updated[index].visible = !updated[index].visible;
      setIconSettings(updated);
    }
  };

  const handleSave = () => {
    localStorage.setItem('iconSettings', JSON.stringify(iconSettings));
    alert('Icon settings saved!');
    window.location.reload(); 
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Customize Navigation Icons</Typography>
      <Typography variant="body2" gutterBottom>
        Drag to reorder icons, and toggle visibility. The “Settings” icon cannot be hidden.
      </Typography>

      <Paper elevation={2} sx={{ mt: 2 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={iconSettings.map(item => item.key)}
            strategy={verticalListSortingStrategy}
          >
            <List>
              {iconSettings.map((item, index) => (
                <SortableItem
                  key={item.key}
                  id={item.key}
                  label={item.label}
                  visible={item.visible}
                  fixed={item.fixed}
                  onToggle={() => toggleVisibility(index)}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Paper>

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </Box>
  );
}

function SortableItem({ id, label, visible, fixed, onToggle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab'
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ListItem
        secondaryAction={
          <>
            <IconButton {...attributes} {...listeners}>
              <DragIndicatorIcon />
            </IconButton>
            <Switch
              edge="end"
              checked={visible}
              onChange={onToggle}
              disabled={fixed}
            />
          </>
        }
      >
        <ListItemText primary={label} />
      </ListItem>
      <Divider />
    </div>
  );
}
