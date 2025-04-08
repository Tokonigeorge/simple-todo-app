import { useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hook';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team } from '../types/todo';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';
import { addProject, setSelectedProject } from '../slice/todoSlice';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '../store/hook';
import Modal from '../components/Modal';

const TeamPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const teams = useAppSelector((state) => state.todo.teams);
  const dispatch = useAppDispatch();
  const [team, setTeam] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      addProject({
        id: uuidv4(),
        teamId: team?.id || '',
        name: projectName,
        description: projectDescription,
        status: 'active',
        board: {
          id: uuidv4(),
          progress: 0,
          columns: [
            {
              id: uuidv4(),
              name: 'To Do',
              cards: [],
            },
            {
              id: uuidv4(),
              name: 'In Progress',
              cards: [],
            },
            {
              id: uuidv4(),
              name: 'Done',
              cards: [],
            },
          ],
        },
      })
    );
    setIsModalOpen(false);
    setProjectName('');
    setProjectDescription('');
  };

  useEffect(() => {
    if (!id) {
      navigate('/');
    }

    const team = teams.find((team) => team.id === id);

    setTeam(team || null);
  }, [id, teams]);

  return (
    <div className='h-screen p-6 overflow-hidden'>
      <div
        className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 w-fit rounded-md transition-colors'
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className='w-6 h-6' />
        <p>Back</p>
      </div>
      {team ? (
        <div className='flex flex-col gap-4 mt-4'>
          <h1 className='text-4xl font-bold '>{team.name}</h1>
          <p className='text-sm text-gray-500'>{team.description}</p>
          <div className='flex flex-col gap-2'>
            <p className='text-sm text-gray-500 border-b border-gray-200 pb-2'>
              Team Members: {team.members.length}
            </p>
            {team.members.map((member) => (
              <div key={member.id}>
                <p className='text-sm text-gray-500'>{member.name}</p>
                <p className='text-sm text-gray-500'>
                  {member.email || 'dummy@gmail.com'}
                </p>
              </div>
            ))}
          </div>
          {team.projects.length > 0 ? (
            <div className='flex flex-col gap-2'>
              <h2 className='text-2xl font-bold'>Projects</h2>
              {team.projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    dispatch(setSelectedProject(project));
                    navigate(`/project/${project.id}`);
                  }}
                  className='flex flex-col gap-2 bg-gray-100 p-4 rounded-md hover:bg-gray-200 transition-colors cursor-pointer'
                >
                  <p className='text-sm text-gray-500'>{project.name}</p>
                  <p className='text-sm text-gray-500'>{project.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-start justify-center mt-4'>
              <p className='text-base font-bold'>No projects found</p>
              <Button
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Create Project
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          <p>Team not found</p>
        </div>
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className='text-2xl font-bold'>Create Project</h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                required
                placeholder='Project Name'
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className='border border-gray-300 rounded-md p-2'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='description'>Description</label>
              <input
                type='text'
                id='description'
                placeholder='Project Description'
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className='border border-gray-300 rounded-md p-2'
              />
            </div>
            <Button type='submit'>Create Project</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TeamPage;
