import { call, put } from "redux-saga/effects";
const fetch = (url, data) =>
  window.fetch(url, {
    body: JSON.stringify(data),
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
  });
export function* addCustomer({ customer }) {
  yield put({ type: "ADD_CUSTOMER_SUBMITTING" });
  yield call(fetch, "/customers", customer);
}

const defaultState = {
  customer: {},
  status: undefined,
  validationErrors: {},
  error: false,
};
export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_CUSTOMER_SUBMITTING":
      return { status: "SUBMITTING" };
    default:
      return state;
  }
};
