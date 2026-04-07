import { createSlice } from "@reduxjs/toolkit";
import { removeToken, setUser, getUser, removeUser } from "../../utils/helper"; // ← helper import karo

const initialState = {
  user: getUser() || null,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setlogin(state, action) {
      state.user = action.payload;
      setUser(action.payload); // ← helper use karo
    },
    logout(state) {
      state.user = null;
      removeToken();
      removeUser(); // ← helper use karo
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      setUser({ ...state.user, ...action.payload }); // ← helper use karo
    },
  },
});

export const { logout, setlogin, updateUser } = userReducer.actions;
