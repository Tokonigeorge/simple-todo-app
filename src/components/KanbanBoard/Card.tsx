import { ICard } from '../../types/todo';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../../types/dndTypes';
import { moveCard } from '../../slice/todoSlice';
import { useRef } from 'react';
import { Calendar, Trash2, User } from 'lucide-react';
interface CardProps {
  card: ICard;
  columnId: string;
  onMoveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => void;
  handleDeleteCard: (cardId: string, columnId: string) => void;
}

const Card = ({ card, columnId, onMoveCard, handleDeleteCard }: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: card.id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover: (item: { id: string; columnId: string }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.id;
      const hoverIndex = item.columnId;

      if (dragIndex === hoverIndex) {
        return;
      }
      onMoveCard(dragIndex, columnId, hoverIndex);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleDeleteCard(card.id, columnId);
  };

  return (
    <div
      ref={ref}
      onClick={() => {
        console.log(card);
      }}
      className={`p-4 rounded-md bg-white shadow-md hover:bg-gray-100 transition-colors cursor-pointer ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className='flex justify-between items-center'>
        <p>{card.name}</p>
        <button
          className='text-red-500 hover:text-red-600 transition-colors'
          onClick={handleDelete}
        >
          <Trash2 className='w-4 h-4' />
        </button>
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
              <p className='text-sm text-gray-500'>
                {new Date(card.dueDate).toLocaleDateString()}
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
      </div>
    </div>
  );
};

export default Card;
