import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../../utils/helper";
import { SERVER_URL } from "../../../config/env";

export const usersSlice = createApi({
  reducerPath: "usersSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers) => {
      const token = getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),

  tagTypes: ["Users"],

  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

// ✅ correct hook
export const { useGetUsersQuery, useUpdateUserStatusMutation } = usersSlice;
