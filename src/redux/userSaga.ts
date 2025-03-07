import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
} from "./userSlice";
import { PayloadAction } from "@reduxjs/toolkit";

function* fetchUsersSaga(
  action: PayloadAction<{ keyword: string; perPage: number; page: number }>
) {
  try {
    const { keyword, perPage, page } = action.payload;
    const response: { data: any } = yield call(
      axios.get,
      `https://api.github.com/search/users?q=${keyword}&per_page=${perPage}&page=${page}`
    );

    const users = response.data.items;
    const totalRows = response.data.total_count;
    yield put(fetchUsersSuccess({ users, totalRows }));
  } catch (error: any) {
    yield put(
      fetchUsersFailure(error?.response?.data?.message ?? error.message)
    );
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
}
