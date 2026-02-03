const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const apiClient = {
  // 🔹 Get all tasks
  async getTasks(userId: string) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks`,
      { credentials: "include" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status}`);
    }

    return res.json();
  },

  // 🔹 Get single task
  async getTask(userId: string, taskId: string) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks/${taskId}`,
      { credentials: "include" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch task: ${res.status}`);
    }

    return res.json();
  },

  // 🔹 Create task
  async createTask(userId: string, task: {
    title: string;
    description?: string;
  }) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(task),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.status}`);
    }

    return res.json();
  },

  // 🔹 Update task
  async updateTask(
    userId: string,
    taskId: string,
    updates: {
      title?: string;
      description?: string;
      completed?: boolean;
    }
  ) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.status}`);
    }

    return res.json();
  },

  // 🔹 Mark task complete/incomplete
  async toggleComplete(
    userId: string,
    taskId: string,
    completed: boolean
  ) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks/${taskId}/complete`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed }),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update completion: ${res.status}`);
    }

    return res.json();
  },

  // 🔹 Delete task
  async deleteTask(userId: string, taskId: string) {
    const res = await fetch(
      `${API_URL}/users/${userId}/tasks/${taskId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to delete task: ${res.status}`);
    }

    return res.json();
  },
};
