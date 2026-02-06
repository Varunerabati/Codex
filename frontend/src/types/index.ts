export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  dueDate: string;
  completed: boolean;
  status: 'Pending' | 'Completed' | 'Overdue';
  created_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TaskFilters {
  category: string;
  priority: string;
  sort: 'asc' | 'desc';
  search: string;
}
