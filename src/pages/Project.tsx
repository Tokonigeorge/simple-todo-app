import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hook';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Team, Project } from '../types/todo';

import { useCardOperations } from '../hooks/useCardOperations';
import Board from '../components/KanbanBoard/Board';
import { setSelectedProject } from '../slice/todoSlice';
import { teamService } from '../services/api';
import { useDispatch } from 'react-redux';

const ProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teams = useAppSelector((state) => state.todo.teams);

  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<Team | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { handleMoveCard, handleAddCard, handleDeleteCard, handleUpdateCard } =
    useCardOperations(team, project);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        const teams = await teamService.getAllTeams();
        const projectTeam = teams.find((t) =>
          t.projects.find((p) => p.id === id)
        );

        if (!projectTeam) {
          navigate('/');
          return;
        }

        setTeam(projectTeam);
        const projectItem = projectTeam.projects.find((p) => p.id === id);

        if (projectItem) {
          setProject(projectItem);
          dispatch(setSelectedProject(projectItem));
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();

    // fetchProject();
  }, [id]);

  const boardProps = useMemo(
    () => ({
      moveCard: handleMoveCard,
      deleteCard: handleDeleteCard,
      addCard: handleAddCard,
      team: team!,
      updateCard: handleUpdateCard,
    }),
    [handleMoveCard, handleDeleteCard, handleAddCard, handleUpdateCard, team]
  );

  if (!team) {
    return <div>Team not found</div>;
  }
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    );
  }

  return (
    <div className='h-screen p-6 '>
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
        <Board {...boardProps} />
      </div>
    </div>
  );
};

export default React.memo(ProjectPage);
