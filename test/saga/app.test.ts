import { expectRedux, storeSpy } from "expect-redux";
import * as HistoryExports from "../../src/history";
import { configureStore } from "../../src/store";

describe("customerAdded", () => {
  let store, pushSpy, dispatchSpy;
  beforeEach(() => {
    pushSpy = jest.spyOn(HistoryExports.appHistory, "push");
    store = configureStore([storeSpy]);
    dispatchSpy = jest.fn();
  });
  const dispatchRequest = (customer) =>
    store.dispatch({
      type: "ADD_CUSTOMER_SUCCESSFUL",
      customer,
    });
  it("pushes /addAppointment to history", () => {
    dispatchRequest();
    expect(pushSpy).toHaveBeenCalledWith("/addAppointment");
  });
  it("dispatches a SET_CUSTOMER_FOR_APPOINTMENT action", () => {
    const customer = { id: 123 };
    dispatchRequest(customer);
    return expectRedux(store).toDispatchAnAction().matching({
      type: "SET_CUSTOMER_FOR_APPOINTMENT",
      customer,
    });
  });
});
