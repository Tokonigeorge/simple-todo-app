import React, { FC } from 'react';
import { Team } from '../types/todo';

interface FilterComponentProps {
  filter: { priority: string; assignee: string };
  setFilter: (filter: { priority: string; assignee: string }) => void;
  team: Team;
}

const FilterComponent: FC<FilterComponentProps> = ({
  filter,
  setFilter,
  team,
}: {
  filter: { priority: string; assignee: string };
  setFilter: (filter: { priority: string; assignee: string }) => void;
  team: Team;
}) => {
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, priority: e.target.value });
  };
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, assignee: e.target.value });
  };
  return (
    <div className='flex gap-2 flex-wrap justify-between'>
      <div className='flex flex-col gap-2'>
        <label htmlFor='priority'>Priority</label>
        <select
          value={filter.priority}
          onChange={handlePriorityChange}
          className='border border-gray-300 rounded-md p-2'
        >
          <option value='all'>All</option>
          <option value='high'>High</option>
          <option value='medium'>Medium</option>
          <option value='low'>Low</option>
        </select>
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor='assignee'>Assignee</label>
        <select
          value={filter.assignee}
          onChange={handleAssigneeChange}
          className='border border-gray-300 rounded-md p-2'
        >
          <option value='all'>All</option>
          {team.members?.map((member) => (
            <option value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>
      <button
        onClick={() => setFilter({ priority: 'all', assignee: 'all' })}
        className='bg-gray-900 text-gray-50 p-2 rounded-md cursor-pointer'
      >
        Clear
      </button>
    </div>
  );
};

export default FilterComponent;
