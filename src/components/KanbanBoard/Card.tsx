import React from 'react';
import { ICard } from '../../types/todo';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../../types/dndTypes';
import { useRef, useState } from 'react';
import { Calendar, Edit, Flag, Trash2, User } from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import { getPriorityColor } from '../../utils/helper';
interface CardProps {
  card: ICard;
  columnId: string;
  onMoveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => void;
  handleDeleteCard: (cardId: string, columnId: string) => void;
  editCard: (card: ICard) => void;
  existingCard: ICard | null;
}

const Card = ({
  card,
  columnId,
  onMoveCard,
  handleDeleteCard,
  editCard,
  existingCard,
}: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: card.id, columnId },

    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ columnId: string }>();
      if (dropResult && dropResult.columnId !== columnId) {
        onMoveCard(card.id, columnId, dropResult.columnId);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  drag(ref);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleDeleteCard(card.id, columnId);
    setIsDeleteModalOpen(false);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    editCard(card);
  };

  const isEditing = existingCard?.id === card.id;
  if (isEditing) {
    return null;
  }
  return (
    <div
      ref={ref}
      className={`p-4 rounded-md bg-white shadow-md hover:bg-gray-100 transition-colors cursor-pointer ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className='flex justify-between items-center'>
        <button
          className='text-gray-500 hover:text-gray-600 transition-colors cursor-pointer '
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(e);
          }}
          data-testid='edit-button'
        >
          <Edit className='w-4 h-4' />
        </button>
        <button
          data-testid='delete-button'
          className='text-red-500 hover:text-red-600 transition-colors cursor-pointer'
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
      <div className='flex justify-between items-center'>
        <p>{card.name}</p>
      </div>
      <div className='flex flex-col gap-2'>
        {card.tags && card.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {card.tags.map((tag) => (
              <p key={tag} className='text-sm text-gray-500'>
                {tag}
              </p>
            ))}
          </div>
        )}
        <p className='text-sm text-gray-500'>{card.description}</p>
        <div className='flex items-center gap-2'>
          {card.dueDate && (
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              <p
                className={`text-sm text-gray-500 ${
                  new Date(card.dueDate) < new Date() ? 'text-red-500' : ''
                }`}
              >
                {new Date(card.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
          {card.assignee && (
            <div className='flex items-center gap-2'>
              <User className='w-4 h-4' />
              <p className='text-sm text-gray-500'>{card.assignee.name}</p>
            </div>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <Flag className='w-4 h-4' />
          <p
            className={`text-sm text-gray-500 rounded-md px-2 py-1 ${getPriorityColor(
              card.priority
            )}`}
          >
            {card.priority}
          </p>
        </div>
      </div>
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <div className='bg-white p-4 rounded-md'>
            <p>Are you sure you want to delete this card?</p>
            <div className='flex gap-2 mt-4'>
              <Button onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleDelete}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Card;
