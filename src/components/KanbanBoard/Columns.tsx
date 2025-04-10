import React, { useRef, useState } from 'react';
import { ItemTypes } from '../../types/dndTypes';
import { useDrop } from 'react-dnd';
import { Column, ICard, Team } from '../../types/todo';
import Card from './Card';
import { Plus } from 'lucide-react';
import CardForm from './CardForm';
interface ColumnsProps {
  column: Column;
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => void;
  deleteCard: (cardId: string, columnId: string) => void;
  addCard: (columnId: string, card: ICard) => void;
  team: Team;
  updateCard: (columnId: string, card: ICard) => void;
}
const Columns = ({
  column,
  moveCard,
  deleteCard,
  addCard,
  team,
  updateCard,
}: ColumnsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editCard, setEditCard] = useState<ICard | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: () => ({ columnId: column.id }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleAddCard = (card: ICard) => {
    if (editCard) {
      updateCard(column.id, card);
    } else {
      card.status =
        column.name === 'To Do'
          ? 'todo'
          : column.name === 'In Progress'
          ? 'in_progress'
          : 'done';
      addCard(column.id, card);
    }
    setShowForm(false);
    setEditCard(null);
  };

  drop(ref);

  return (
    <div
      ref={ref}
      className={`bg-gray-50 p-4 rounded-lg h-full min-h-[300px] flex flex-col ${
        isOver ? 'bg-gray-100' : ''
      }`}
    >
      <div className='flex items-center justify-between mb-4'>
        <p className='text-lg font-semibold'>{column.name}</p>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-500'>
            {column.cards.length} cards
          </span>
          <button onClick={() => setShowForm(true)}>
            <Plus className='w-4 h-4' />
          </button>
        </div>
      </div>
      {showForm && (
        <CardForm
          team={team}
          columnName={column.name}
          onSubmit={handleAddCard}
          existingCard={editCard}
        />
      )}
      <div className='flex flex-col gap-2'>
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            existingCard={editCard}
            columnId={column.id}
            onMoveCard={moveCard}
            handleDeleteCard={deleteCard}
            editCard={(card) => {
              setEditCard(card);
              setShowForm(true);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Columns;
