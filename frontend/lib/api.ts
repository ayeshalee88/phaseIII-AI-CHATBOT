interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private token: string | null = null;
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };

    try {
      const res = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers,
      });
      const data = await res.json();
      if (!res.ok) return { error: data.detail || data.message || "Error" };
      return { data };
    } catch (err: any) {
      return { error: err.message || "Network error" };
    }
  }

  // ✅ Fixed to match backend routes: /users/{user_id}/tasks
  async getTasks(userId: string) {
    return this.request(`/users/${userId}/tasks`);
  }

  async createTask(userId: string, task: any) {
    return this.request(`/users/${userId}/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
    });
  }

  async updateTask(userId: string, taskId: string, task: any) {
    return this.request(`/users/${userId}/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
  }

  async deleteTask(userId: string, taskId: string) {
    return this.request(`/users/${userId}/tasks/${taskId}`, { 
      method: "DELETE" 
    });
  }

  async updateTaskCompletion(userId: string, taskId: string, completed: boolean) {
    return this.request(`/users/${userId}/tasks/${taskId}/complete`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
  }
}

export const apiClient = new ApiClient();

