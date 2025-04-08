import { useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hook';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Team from '../types/todo';
const TeamPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const teams = useAppSelector((state) => state.todo.teams);
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
    }

    const team = teams.find((team) => team.id === id);

    setTeam(team || null);
  }, [id]);

  return (
    <div className='h-screen p-6 overflow-hidden'>
      {team ? (
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-bold '>{team.name}</h1>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          <p>Team not found</p>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
