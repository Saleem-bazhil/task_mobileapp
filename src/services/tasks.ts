import api from "../api/Api";

type DashboardResponse = any;
type Task = any;

export async function fetchDashboard(): Promise<DashboardResponse> {
  const response = await api.get<DashboardResponse>("/api/tasks/dashboard/");
  return response.data;
}

export async function fetchProfileOverview(): Promise<{
  dashboard: DashboardResponse;
  tasks: Task[];
}> {
  const [dashboardResponse, tasksResponse] = await Promise.all([
    api.get<DashboardResponse>("/api/tasks/dashboard/"),
    api.get<Task[]>("/api/tasks/"),
  ]);

  return {
    dashboard: dashboardResponse.data,
    tasks: Array.isArray(tasksResponse.data) ? tasksResponse.data : [],
  };
}