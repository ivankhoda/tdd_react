import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Router } from "react-router-dom";
import "whatwg-fetch";
import { App } from "./app";
import { appHistory } from "./history";
import { configureStore } from "./store";
ReactDOM.render(
  <Provider store={configureStore()}>
    <Router history={appHistory}>
      <Route path="/" component={App} />
    </Router>
  </Provider>,

  document.getElementById("root")
);
