export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'text-green-50 bg-green-500';
    case 'medium':
      return 'text-yellow-50 bg-yellow-500';
    case 'high':
      return 'text-red-50 bg-red-500';
    default:
      return 'text-gray-50 bg-gray-500';
  }
};
