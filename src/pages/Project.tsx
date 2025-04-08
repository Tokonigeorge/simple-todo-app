import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hook';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Team, { Project } from '../types/todo';
import { deleteCard, addCard, moveCard } from '../slice/todoSlice';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Board from '../components/KanbanBoard/Board';

const ProjectPage = () => {
  const { id } = useParams();
  const teams = useAppSelector((state) => state.todo.teams);
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) {
      navigate('/');
    }

    // find the team that contains the project
    const projectTeam = teams.find((team) =>
      team.projects.find((project) => project.id === id)
    );
    setTeam(projectTeam || null);
    // find the project in the team
    const projectItem = projectTeam?.projects.find(
      (project) => project.id === id
    );

    setProject(projectItem || null);
  }, [id, teams]);

  const handleMoveCard = (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => {
    dispatch(moveCard({ cardId, sourceColumnId, targetColumnId }));
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    dispatch(deleteCard({ cardId, columnId }));
  };

  const handleAddCard = (columnId: string) => {
    dispatch(
      addCard({
        card: { id: uuidv4(), name: '', description: '', status: 'todo' },
        columnId,
      })
    );
  };

  return (
    <div className='h-screen p-6 overflow-hidden'>
      <div
        className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 w-fit rounded-md transition-colors'
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className='w-6 h-6' />
        <p>Back</p>
      </div>
      <div className='flex flex-col gap-4 mt-4  '>
        <h1 className='text-4xl font-bold'>{project?.name}</h1>
        <p className='text-sm text-gray-500'>{project?.description}</p>
        <p className='text-sm text-gray-500'>Team: {team?.name}</p>
      </div>
      <div className='mt-4'>
        <Board
          moveCard={handleMoveCard}
          deleteCard={handleDeleteCard}
          addCard={handleAddCard}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
