import { httpClient } from "app/http";
import { AxiosResponse } from "axios";
import { DashboardData } from "app/models/dashboard";

const resourceUrl: string = "/api/dashboard";

export const useDashboardService = () => {
  const getDashboard = async (): Promise<DashboardData> => {
    const response: AxiosResponse<DashboardData> = await httpClient.get(
      resourceUrl
    );
    return response.data;
  };

  return {
    getDashboard,
  };
};
