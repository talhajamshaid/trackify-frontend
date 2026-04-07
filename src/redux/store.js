import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { authSlice } from "./api/authSlice/userSlice";
import { userReducer } from "./reducer/userReducer";
import { AdmindashboardSlice } from "./api/admin/AdmindashboardSlice";
import { usersSlice } from "./api/admin/usersSlice";
import { tasksSlice } from "./api/admin/tasksSlice";
import { userTasksApi } from "./api/user/tasksSlice";
import { dashboardStatsSlice } from "./api/user/usersSlice";

const persistConfig = {
  key: "user",
  storage,
  whitelist: ["user"],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer.reducer);

const rootReducer = combineReducers({
  [userReducer.name]: persistedUserReducer,
  [authSlice.reducerPath]: authSlice.reducer,
  [AdmindashboardSlice.reducerPath]: AdmindashboardSlice.reducer,
  [usersSlice.reducerPath]: usersSlice.reducer,
  [tasksSlice.reducerPath]: tasksSlice.reducer,
  [userTasksApi.reducerPath]: userTasksApi.reducer,
  [dashboardStatsSlice.reducerPath]: dashboardStatsSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authSlice.middleware,
      AdmindashboardSlice.middleware,
      usersSlice.middleware,
      tasksSlice.middleware,
      userTasksApi.middleware,
      dashboardStatsSlice.middleware,
    ),
});

export const persistor = persistStore(store);
export default store;
