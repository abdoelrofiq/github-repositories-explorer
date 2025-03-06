import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
} from "./userSlice";
import { PayloadAction } from "@reduxjs/toolkit";

function* fetchUsersSaga(
  action: PayloadAction<{ query: string; perPage: number; page: number }>
) {
  try {
    const { query, perPage, page } = action.payload;
    const response: { data: any } = yield call(
      axios.get,
      `https://api.github.com/search/users?q=${query}&per_page=${perPage}&page=${page}`
    );

    yield put(fetchUsersSuccess(response.data.items));
  } catch (error: any) {
    yield put(fetchUsersFailure(error.message));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
}
