export interface Team {
  id: string;
  name: string;
  description?: string;
  projects: Project[];
  members: Member[];
}
export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface Project {
  teamId: string;
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
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

export enum CardStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface ICard {
  id: string;
  name: string;
  description?: string;
  status: CardStatus;
  dueDate?: string;
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
