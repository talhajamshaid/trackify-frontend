import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../../utils/helper";
import { SERVER_URL } from "../../../config/env";

export const AdmindashboardSlice = createApi({
  reducerPath: "AdmindashboardSlice",
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
  tagTypes: ["dashboard"],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => "/admin/dashboard",
    }),
  }),
});

export const { useGetDashboardQuery } = AdmindashboardSlice;
