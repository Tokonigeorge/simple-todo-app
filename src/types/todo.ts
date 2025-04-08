export default interface Team {
  id: string;
  name: string;
  description?: string;
  projects: Project[];
  members: Member[];
}

export interface Project {
  teamId: string;
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  board: Board;
}

export interface Board {
  id: string;
  progress: number;
  columns: Column[];
}

export interface Column {
  id: string;
  name: string;
  cards: ICard[];
}

export interface ICard {
  id: string;
  name: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: Date;
  assignee?: Member;
  priority: 'low' | 'medium' | 'high';
  comments?: Comment[];
  subtasks?: Subtask[];
  tags?: string[];
}

export interface Member {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: Member;
}

export interface Subtask {
  id: string;
  name: string;
  status: 'todo' | 'in_progress' | 'done';
}
