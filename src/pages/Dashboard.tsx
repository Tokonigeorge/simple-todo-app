import Modal from '../components/Modal';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { addTeam } from '../slice/todoSlice';
import { v4 as uuidv4 } from 'uuid';
import { Member } from '../types/todo';
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.todo.teams);

  const [name, setName] = useState<string>('');
  const [member, setMember] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  console.log(teams, 'displaying teams');
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
        members: newMembers,
        projects: [],
      })
    );
    setMembers([]);
    setMember('');
    setIsModalOpen(false);
  };

  return (
    <div className='h-screen p-6 overflow-hidden'>
      <h1 className='text-4xl font-bold '>Welcome!</h1>
      {teams.length > 0 ? (
        <div className='flex flex-col gap-4 mt-4'>
          <div className='flex bg-gray-50 max-w-1/2 border-gray-200 border rounded-md p-4 overflow-y-auto shadow-sm'>
            <div className='flex flex-col gap-2 w-full'>
              <h2 className='text-lg font-bold'>Teams</h2>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-2 bg-gray-100 rounded-md p-2 w-full cursor-pointer hover:bg-gray-200 transition-colors'>
                  {teams.map((team) => (
                    <div key={team.id}>{team.name}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          <p>No team found</p>
          <button
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
          <form className='mt-4' onSubmit={handleSubmit}>
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
              <button
                type='button'
                className='bg-gray-900 text-white p-2 rounded-md'
                onClick={() => {
                  setMembers([
                    ...members,
                    { id: uuidv4(), name: member, email: '', role: 'member' },
                  ]);
                  setMember('');
                }}
              >
                Add Member
              </button>
            </div>
            <button
              type='submit'
              className='bg-gray-900 text-white p-2 rounded-md mt-4 w-full'
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
