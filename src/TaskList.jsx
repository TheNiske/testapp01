import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import TaskItem from './TaskItem'

function TaskList({ tasks, onToggle, onDelete, onReorder }) {
  // activeTask tracks which item is being dragged so we can
  // render it inside DragOverlay (the floating ghost copy)
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  function handleDragStart({ active }) {
    // Find the full task object so DragOverlay can render it
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
  }

  function handleDragEnd({ active, over }) {
    setActiveTask(null)
    if (over && active.id !== over.id) {
      onReorder(active.id, over.id)
    }
  }

  function handleDragCancel() {
    setActiveTask(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <ul>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </SortableContext>

      {/* DragOverlay renders outside the list, on top of everything.
          It shows a floating copy of the dragged item while dragging. */}
      <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={{
        duration: 260,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.12)',
      }}>
        {activeTask ? (
          <TaskItem
            task={activeTask}
            onToggle={() => {}}
            onDelete={() => {}}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default TaskList
