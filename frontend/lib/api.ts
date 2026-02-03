// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const apiClient = {
  token: null as string | null,

  setToken(token: string) {
    this.token = token;
  },

  async getTasks(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}/tasks`, {
      headers: this.token
        ? { Authorization: `Bearer ${this.token}` }
        : {},
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status}`);
    }

    return res.json();
  },

  async createTask(userId: string, task: any) {
    const res = await fetch(`${API_URL}/users/${userId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.status}`);
    }

    return res.json();
  },

  async updateTask(userId: string, taskId: string, task: any) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
        body: JSON.stringify(task),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.status}`);
    }

    return res.json();
  },

  async deleteTask(userId: string, taskId: string) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: this.token
          ? { Authorization: `Bearer ${this.token}` }
          : {},
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to delete task: ${res.status}`);
    }

    return res.json();
  },

  async updateTaskCompletion(
    userId: string,
    taskId: string,
    completed: boolean
  ) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks/${taskId}/complete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
        body: JSON.stringify({ completed }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update task completion");
    }

    return res.json();
  },
};
