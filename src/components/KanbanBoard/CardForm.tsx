import React from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Team } from '../../types/todo';
import { ICard } from '../../types/todo';
import { v4 as uuidv4 } from 'uuid';

interface CardData {
  name: string;
  description: string;
  labels: string[];
  dueDate: Date | null;
  assignee: string | null;
  priority: string;
}

const priorityOptions = ['low', 'medium', 'high'];

const inputClasses = 'border border-gray-300 rounded-md p-2';

const CardForm = ({
  columnName,
  team,
  onSubmit,
  existingCard,
}: {
  columnName: string;
  team: Team;
  onSubmit: (card: ICard) => void;
  existingCard: ICard | null;
}) => {
  const [cardData, setCardData] = useState<Partial<ICard>>({
    id: existingCard?.id || '',
    name: existingCard?.name || '',
    description: existingCard?.description || '',
    tags: existingCard?.tags || [],
    dueDate: existingCard?.dueDate || undefined,
    assignee: existingCard?.assignee || undefined,
    priority: existingCard?.priority || 'low',
    status:
      existingCard?.status || columnName === 'To Do'
        ? 'todo'
        : columnName === 'In Progress'
        ? 'in_progress'
        : 'done',
  });
  const [newLabel, setNewLabel] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cardData.name || !cardData.dueDate) {
      alert('Please fill in the required fields');
      return;
    }

    const assignee = team?.members?.find(
      (member) => member.name === cardData.assignee?.name
    );

    const newCard: ICard = {
      id: uuidv4(),
      name: cardData.name.trim(),
      description: cardData.description?.trim() || '',
      tags: cardData.tags || [],
      dueDate: cardData.dueDate
        ? new Date(cardData.dueDate).toISOString()
        : undefined,
      assignee: assignee || undefined,
      priority: cardData.priority as 'low' | 'medium' | 'high',
      status: 'todo',
    };

    setCardData({
      name: '',
      description: '',
      tags: [],
      dueDate: undefined,
      assignee: undefined,
      priority: 'low',
    });
    onSubmit(newCard);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 pb-4'
    >
      <div className='flex flex-col gap-2'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          required
          className={inputClasses}
          value={cardData.name}
          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor='description'>Description</label>
        <input
          type='text'
          className={inputClasses}
          value={cardData.description}
          onChange={(e) =>
            setCardData({ ...cardData, description: e.target.value })
          }
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='labels'>Labels</label>
        <div className='flex flex-wrap gap-2 mb-4'>
          {cardData.tags?.map((label) => (
            <span
              key={label}
              className='bg-gray-100 px-2 py-1 rounded-md flex items-center gap-2'
            >
              {label}
              <button
                className='hover:bg-gray-200 p-1 rounded-md cursor-pointer'
                onClick={() =>
                  setCardData({
                    ...cardData,
                    tags: cardData.tags?.filter((l) => l !== label),
                  })
                }
              >
                <X className='w-4 h-4' />
              </button>
            </span>
          ))}
        </div>
        <div className='flex flex-col gap-2'>
          <input
            type='text'
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className={inputClasses}
          />
          <button
            type='button'
            className='bg-gray-900 text-white px-4 py-2 rounded-md cursor-pointer'
            onClick={() => {
              if (newLabel) {
                setCardData({
                  ...cardData,
                  tags: cardData.tags
                    ? [...cardData.tags, newLabel]
                    : [newLabel],
                });
                setNewLabel('');
              }
            }}
          >
            Add Label
          </button>
        </div>
      </div>
      <div className=' flex flex-col gap-2'>
        <label htmlFor='dueDate'>Due Date</label>
        <input
          type='date'
          required
          min={new Date().toISOString().split('T')[0]}
          className={inputClasses}
          value={
            cardData.dueDate ? cardData.dueDate.toString().split('T')[0] : ''
          }
          onChange={(e) =>
            setCardData({
              ...cardData,
              dueDate: e.target.value
                ? new Date(e.target.value).toISOString()
                : undefined,
            })
          }
        />
      </div>
      <div className='mb-4 flex flex-col gap-2'>
        <label htmlFor='assignee'>Assignee</label>
        <select
          value={cardData.assignee?.name || ''}
          onChange={(e) =>
            setCardData({
              ...cardData,
              assignee: team?.members?.find(
                (member) => member.id === e.target.value
              ),
            })
          }
          className={inputClasses}
        >
          <option value=''>Select Assignee</option>
          {team?.members?.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      <div className='mb-4 flex flex-col gap-2'>
        <label htmlFor='priority'>Priority</label>
        <select
          className={inputClasses}
          value={cardData.priority}
          onChange={(e) =>
            setCardData({
              ...cardData,
              priority: e.target.value as 'low' | 'medium' | 'high',
            })
          }
        >
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>
      <button
        type='submit'
        disabled={!cardData.name || !cardData.dueDate}
        className='bg-gray-900 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
      >
        Add Card
      </button>
    </form>
  );
};

export default CardForm;
