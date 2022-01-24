import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { takeLatest } from "redux-saga/effects";
import { customerAdded } from "./sagas/app";
import { addCustomer, reducer as customerReducer } from "./sagas/customer";

function* rootSaga() {
  yield takeLatest("ADD_CUSTOMER_REQUEST", addCustomer);

  yield takeLatest("ADD_CUSTOMER_SUCCESSFUL", customerAdded);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers({ customer: customerReducer }),
    compose(...[applyMiddleware(sagaMiddleware), ...storeEnhancers])
  );
  sagaMiddleware.run(rootSaga);
  return store;
};
