import React from 'react';
import Modal from '../components/Modal';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { addTeam } from '../slice/todoSlice';
import { v4 as uuidv4 } from 'uuid';
import { Member } from '../types/todo';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.todo.teams);
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [member, setMember] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (members.length === 0) {
      alert('Please add at least one member');
      return;
    }
    const newMembers = members.map((member) => ({
      id: uuidv4(),
      name: member.name,
      email: '',
      role: 'member',
    }));

    dispatch(
      addTeam({
        id: uuidv4(),
        name,
        description,
        members: newMembers,
        projects: [],
      })
    );
    setMembers([]);
    setMember('');
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className='h-screen p-6 overflow-hidden'>
      <h1 className='text-4xl font-bold '>Welcome!</h1>
      {teams.length > 0 ? (
        <div className='flex flex-col gap-4 mt-4'>
          <div className='flex justify-between'>
            <h2 className='text-lg font-bold'>Teams</h2>
            <button
              data-testid='open-create-team-modal'
              type='button'
              className='bg-gray-900 text-white px-3 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition-colors'
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Create Team
            </button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 '>
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => {
                  navigate(`/team/${team.id}`);
                }}
                className='bg-gray-100 rounded-md p-4 shadow-md cursor-pointer hover:bg-gray-200 transition-colors'
              >
                <p className='text-lg font-bold'>{team.name}</p>
                <p className='text-sm text-gray-500'>{team.description}</p>
                <p className='text-sm text-gray-500'>
                  {team.members?.length > 1
                    ? `${team.members.length} members`
                    : `${team.members.length} member`}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          <p>No team found</p>
          <button
            data-testid='open-create-team-modal'
            className='bg-gray-900 text-white px-3 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition-colors'
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Create Team
          </button>
        </div>
      )}
      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <h2 className='text-2xl font-bold'>Create Team</h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                required
                placeholder='Team Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='border border-gray-300 rounded-md p-2'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='description'>Description</label>
              <input
                type='text'
                id='description'
                placeholder='Team Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='border border-gray-300 rounded-md p-2'
              />
            </div>
            {members?.map((member) => (
              <div key={member.id}>{member.name}</div>
            ))}
            <div className='flex flex-col gap-2 mt-2'>
              <label htmlFor='member'>Member</label>
              <input
                type='text'
                id='member'
                placeholder='Team Member Name'
                value={member}
                onChange={(e) => setMember(e.target.value)}
                className='border border-gray-300 rounded-md p-2'
              />
              <Button
                type='button'
                onClick={() => {
                  setMembers([
                    ...members,
                    { id: uuidv4(), name: member, email: '', role: 'member' },
                  ]);
                  setMember('');
                }}
              >
                Add Member
              </Button>
            </div>
            <button
              data-testid='submit-create-team'
              type='submit'
              className='bg-gray-900 text-white p-2 rounded-md mt-4 w-full cursor-pointer hover:bg-gray-800 transition-colors'
            >
              Create Team
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
