import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Columns from './Columns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Team, ICard } from '../../types/todo';
import { useEffect, useState } from 'react';
import FilterComponent from '../FilterComponent';
import { updateProject } from '../../slice/todoSlice';

interface BoardProps {
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

const Board = React.memo(
  ({ moveCard, deleteCard, addCard, team, updateCard }: BoardProps) => {
    const { selectedProject } = useSelector((state: RootState) => state.todo);
    const [filter, setFilter] = useState<{
      priority: string;
      assignee: string;
    }>({ priority: 'all', assignee: 'all' });
    const [progress, setProgress] = useState<number>(0);

    const filteredColumns = selectedProject?.board.columns.map((column) => {
      if (filter.priority === 'all' && filter.assignee === 'all') {
        return column;
      }
      return {
        ...column,
        cards: column.cards.filter(
          (card) =>
            card.priority === filter.priority.toLowerCase() ||
            card.assignee?.id === filter.assignee
        ),
      };
    });

    const dispatch = useDispatch();

    useEffect(() => {
      if (selectedProject) {
        const totalCards = selectedProject.board.columns.reduce(
          (acc, column) => {
            return acc + column.cards.length;
          },
          0
        );
        const completedCards = selectedProject.board.columns.reduce(
          (acc, column) => {
            return (
              acc + column.cards.filter((card) => card.status === 'done').length
            );
          },
          0
        );

        const newProgress = Math.round((completedCards / totalCards) * 100);
        setProgress(newProgress);

        if (newProgress === 100) {
          dispatch(
            updateProject({
              projectId: selectedProject.id,
              status: 'completed',
            })
          );
        }
      }
    }, [selectedProject]);

    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <FilterComponent filter={filter} setFilter={setFilter} team={team} />
          <div className='h-2.5 w-full rounded-full bg-gray-200'>
            <div
              data-testid='progress-bar'
              className='bg-blue-600 h-full rounded-full'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <DndProvider backend={HTML5Backend}>
          <div className='overflow-x-auto'>
            <div className='flex  gap-4 min-w-max p-1'>
              {filteredColumns?.map((column) => (
                <div key={column.id} className='w-[350px]'>
                  <Columns
                    key={column.id}
                    column={column}
                    moveCard={moveCard}
                    deleteCard={deleteCard}
                    addCard={addCard}
                    team={team}
                    updateCard={updateCard}
                  />
                </div>
              ))}
            </div>
          </div>
        </DndProvider>
      </div>
    );
  }
);

export default Board;
