import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Status from "./status";

interface UserState {
  users: any;
  totalRows: number;
  loading: boolean;
  error: string | null;
  status: string;
}

const initialState: UserState = {
  users: [],
  totalRows: 0,
  loading: false,
  error: null,
  status: Status.Idle,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersRequest: (
      state,
      action: PayloadAction<{ keyword: string; perPage: number; page: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.totalRows = 0;
      state.status = Status.Process;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload.users.map((user) => ({
        ...user,
        expanded: false,
        loading: false,
        repositories: [],
        error: null,
      }));
      state.totalRows = action.payload.totalRows;
      state.status = Status.Finish;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.totalRows = 0;
      state.status = Status.Idle;
    },
  },
});

export const { fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure } =
  userSlice.actions;
export default userSlice.reducer;
