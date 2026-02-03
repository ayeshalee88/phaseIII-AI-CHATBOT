const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const apiClient = {
  token: null as string | null,

  setToken(token: string) {
    this.token = token;
  },

  async getTasks(userId: string) {
    try {
      console.log('Fetching tasks for user:', userId);
      const url = `${API_URL}/api/users/${userId}/tasks`;
      console.log('Request URL:', url);
      
      const res = await fetch(url);
      
      if (!res.ok) {
        console.error('Failed to fetch tasks:', res.status, res.statusText);
        return { error: 'Failed to fetch tasks' };
      }
      
      const data = await res.json();
      console.log('Tasks fetched:', data);
      return { data };
    } catch (error) {
      console.error('Get tasks error:', error);
      return { error: 'Failed to fetch tasks' };
    }
  },

  async createTask(userId: string, task: any) {
    try {
      console.log('Creating task for user:', userId, task);
      const url = `${API_URL}/api/users/${userId}/tasks`;
      console.log('Request URL:', url);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      
      if (!res.ok) {
        console.error('Failed to create task:', res.status, res.statusText);
        return { error: 'Failed to create task' };
      }
      
      const data = await res.json();
      console.log('Task created:', data);
      return { data };
    } catch (error) {
      console.error('Create task error:', error);
      return { error: 'Failed to create task' };
    }
  },

  async updateTask(userId: string, taskId: string, task: any) {
    try {
      console.log('Updating task:', userId, taskId, task);
      const url = `${API_URL}/api/users/${userId}/tasks/${taskId}`;
      console.log('Request URL:', url);
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      
      if (!res.ok) {
        console.error('Failed to update task:', res.status, res.statusText);
        return { error: 'Failed to update task' };
      }
      
      const data = await res.json();
      console.log('Task updated:', data);
      return { data };
    } catch (error) {
      console.error('Update task error:', error);
      return { error: 'Failed to update task' };
    }
  },

  async deleteTask(userId: string, taskId: string) {
    try {
      console.log('Deleting task:', userId, taskId);
      const url = `${API_URL}/api/users/${userId}/tasks/${taskId}`;
      console.log('Request URL:', url);
      
      const res = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        console.error('Failed to delete task:', res.status, res.statusText);
        return { error: 'Failed to delete task' };
      }
      
      const data = await res.json();
      console.log('Task deleted:', data);
      return { data };
    } catch (error) {
      console.error('Delete task error:', error);
      return { error: 'Failed to delete task' };
    }
  },

  async updateTaskCompletion(userId: string, taskId: string, completed: boolean) {
    try {
      console.log('Updating task completion:', userId, taskId, completed);
      const url = `${API_URL}/api/users/${userId}/tasks/${taskId}/complete`;
      console.log('Request URL:', url);
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      
      if (!res.ok) {
        console.error('Failed to update task completion:', res.status, res.statusText);
        return { error: 'Failed to update task' };
      }
      
      const data = await res.json();
      console.log('Task completion updated:', data);
      return { data };
    } catch (error) {
      console.error('Update completion error:', error);
      return { error: 'Failed to update task' };
    }
  },
};