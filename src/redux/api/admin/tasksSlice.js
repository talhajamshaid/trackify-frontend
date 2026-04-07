import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "../../../config/env";
import { getToken } from "../../../utils/helper";

export const tasksSlice = createApi({
  reducerPath: "tasksSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["tasks"],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/admin/tasks",
      providesTags: ["tasks"],
    }),
    // Approve task mutation
    approveTask: builder.mutation({
      query: ({ taskId, comment }) => ({
        url: `/admin/tasks/${taskId}/approve`,
        method: "PATCH",
        body: { comment },
      }),
      invalidatesTags: ["tasks"],
    }),

    rejectTask: builder.mutation({
      query: ({ taskId, comment }) => ({
        url: `/admin/tasks/${taskId}/reject`,
        method: "PATCH",
        body: { comment },
      }),
      invalidatesTags: ["tasks"],
    }),
    getTaskHistory: builder.query({
      query: ({ status, search, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (search) params.append("search", search);
        params.append("page", page);
        params.append("limit", limit);
        return `/admin/tasks/history?${params.toString()}`;
      },
      providesTags: ["tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useApproveTaskMutation,
  useRejectTaskMutation,
  useGetTaskHistoryQuery,
} = tasksSlice;
