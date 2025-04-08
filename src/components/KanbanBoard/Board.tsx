import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Columns from './Columns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Team, ICard } from '../../types/todo';

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

const Board = ({
  moveCard,
  deleteCard,
  addCard,
  team,
  updateCard,
}: BoardProps) => {
  const { selectedProject } = useSelector((state: RootState) => state.todo);
  console.log(selectedProject, 'update');
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='overflow-x-auto'>
        <div className='flex  gap-4 min-w-max p-1'>
          {selectedProject?.board.columns.map((column) => (
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
  );
};

export default Board;
