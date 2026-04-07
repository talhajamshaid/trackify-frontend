// src/redux/api/authSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../../utils/helper";
import { SERVER_URL } from "../../../config/env";

export const authSlice = createApi({
  reducerPath: "authSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Login
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // Forget Password
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    //  Change password
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),
    }),

    // Verify Email + reset password
    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: {
          password,
          confirmPassword,
        },
      }),
    }),

    // Verify OTP + reset password
    verifyOtp: builder.mutation({
      query: ({ otp, newPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { otp, newPassword },
      }),
    }),

    registerUser: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    // Logout
    logoutUser: builder.mutation({
      query: (token) => {
        return {
          url: "/auth/logout",
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        };
      },
    }),

    //Setting Update Profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/update-profile",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useRegisterUserMutation,
} = authSlice;
