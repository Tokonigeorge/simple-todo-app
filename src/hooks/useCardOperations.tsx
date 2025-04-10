import { useCallback } from 'react';
import { ICard, CardStatus } from '../types/todo';
import { useState } from 'react';
import { useAppDispatch } from '../store/hook';
import { Team } from '../types/todo';
import { Project } from '../types/todo';
import { setSelectedProject } from '../slice/todoSlice';
import { cardService, teamService } from '../services/api';

export const useCardOperations = (
  team: Team | null,
  project: Project | null
) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const handleMoveCard = useCallback(
    async (cardId: string, sourceColumnId: string, targetColumnId: string) => {
      if (!team || !project) {
        setError('Team or project not found');
        return;
      }
      const originalProject = { ...project };
      try {
        const updatedProject = {
          ...project,
          board: {
            ...project.board,
            columns: project.board.columns.map((column) => {
              if (column.id === sourceColumnId) {
                return {
                  ...column,
                  cards: column.cards.filter((card) => card.id !== cardId),
                };
              }
              if (column.id === targetColumnId) {
                const card = project.board.columns
                  .find((c) => c.id === sourceColumnId)
                  ?.cards.find((card) => card.id === cardId);
                if (card) {
                  return {
                    ...column,
                    cards: [
                      ...column.cards,
                      {
                        ...card,
                        status: column.name.toLowerCase() as CardStatus,
                      },
                    ],
                  };
                }
              }
              return column;
            }),
          },
        };
        dispatch(setSelectedProject(updatedProject));

        await cardService.moveCard(
          team.id,
          project.id,
          cardId,
          sourceColumnId,
          targetColumnId
        );
      } catch (error) {
        dispatch(setSelectedProject(originalProject));
        setError('Failed to move card');
        throw error;
      }
    },
    [team?.id, project?.id, dispatch]
  );

  const handleAddCard = useCallback(
    async (columnId: string, card: ICard) => {
      if (!team || !project) {
        setError('Team or project not found');
        return;
      }
      const originalProject = { ...project };
      try {
        const updatedProject = {
          ...project,
          board: {
            ...project.board,
            columns: project.board.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  cards: [...column.cards, card],
                };
              }
              return column;
            }),
          },
        };
        dispatch(setSelectedProject(updatedProject));
        await cardService.addCard(team.id, project.id, columnId, card);
      } catch (error) {
        dispatch(setSelectedProject(originalProject));
        setError('Failed to add card');
        throw error;
      }
    },
    [team?.id, project?.id, dispatch]
  );

  const handleDeleteCard = useCallback(
    async (cardId: string, columnId: string) => {
      if (!team || !project) {
        setError('Team or project not found');
        return;
      }
      const originalProject = { ...project };
      try {
        const updatedProject = {
          ...project,
          board: {
            ...project.board,
            columns: project.board.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  cards: column.cards.filter((card) => card.id !== cardId),
                };
              }
              return column;
            }),
          },
        };
        dispatch(setSelectedProject(updatedProject));
        await teamService.updateTeam(team.id, {
          projects: team.projects.map((p) =>
            p.id === project.id ? updatedProject : p
          ),
        });
      } catch (error) {
        dispatch(setSelectedProject(originalProject));
        setError('Failed to delete card');
        throw error;
      }
    },
    [team?.id, project?.id, dispatch]
  );

  const handleUpdateCard = useCallback(
    async (columnId: string, card: ICard) => {
      if (!team || !project) {
        setError('Team or project not found');
        return;
      }
      const originalProject = { ...project };
      try {
        const updatedProject = {
          ...project,
          board: {
            ...project.board,
            columns: project.board.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  cards: column.cards.map((c) => (c.id === card.id ? card : c)),
                };
              }
              return column;
            }),
          },
        };
        dispatch(setSelectedProject(updatedProject));
        await teamService.updateTeam(team.id, {
          projects: team.projects.map((p) =>
            p.id === project.id ? updatedProject : p
          ),
        });
      } catch (error) {
        dispatch(setSelectedProject(originalProject));
        setError('Failed to update card');
        throw error;
      }
    },
    [team?.id, project?.id, dispatch]
  );

  return {
    handleMoveCard,
    handleAddCard,
    handleDeleteCard,
    handleUpdateCard,
    error,
  };
};
