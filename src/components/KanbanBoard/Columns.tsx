import React, { useRef } from 'react';
import { ItemTypes } from '../../types/dndTypes';
import { useDrop } from 'react-dnd';
import { Column } from '../../types/todo';
import Card from './Card';
import { Plus } from 'lucide-react';

interface ColumnsProps {
  column: Column;
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => void;
  deleteCard: (cardId: string, columnId: string) => void;
  addCard: (columnId: string) => void;
}
const Columns = ({ column, moveCard, deleteCard, addCard }: ColumnsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover: (item: { id: string; columnId: string }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.id;
      const sourceColumnId = item.columnId;
      const targetColumnId = column.id;

      if (dragIndex === sourceColumnId) {
        return;
      }

      moveCard(dragIndex, sourceColumnId, targetColumnId);

      item.columnId = targetColumnId;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={`bg-gray-50 p-4 rounded-lg h-full flex flex-col ${
        isOver ? 'bg-gray-100' : ''
      }`}
    >
      <div className='flex items-center justify-between mb-4'>
        <p className='text-lg font-semibold'>{column.name}</p>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-500'>
            {column.cards.length} cards
          </span>
          <button onClick={() => addCard(column.id)}>
            <Plus className='w-4 h-4' />
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            onMoveCard={moveCard}
            handleDeleteCard={deleteCard}
          />
        ))}
      </div>
    </div>
  );
};

export default Columns;
