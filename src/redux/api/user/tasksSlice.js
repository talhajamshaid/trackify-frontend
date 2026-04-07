import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../../utils/helper";
import { SERVER_URL } from "../../../config/env";

export const userTasksApi = createApi({
  reducerPath: "dashboardSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("ngrok-skip-browser-warning", "true");
      }
      return headers;
    },
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getMyTasks: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "" } = {}) => ({
        url: "/user/tasks",
        params: {
          page,
          limit,
          search,
          status,
        },
      }),
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation({
      query: (body) => ({
        url: "/user/tasks/create-task",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ taskId, status }) => ({
        url: `/user/tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetMyTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
} = userTasksApi;
