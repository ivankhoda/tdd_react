import { expectRedux, storeSpy } from "expect-redux";
import "whatwg-fetch";
import { reducer } from "../../src/sagas/customer";
import { configureStore } from "../../src/store";
describe("addCustomer", () => {
  let store;
  const dispatchRequest = (customer) =>
    store.dispatch({
      type: "ADD_CUSTOMER_REQUEST",
      customer,
    });
  beforeEach(() => {
    jest.spyOn(window, "fetch");
    store = configureStore([storeSpy]);
  });

  it("sets current status to submitting", () => {
    dispatchRequest();
    return expectRedux(store).toDispatchAnAction().matching({ type: "ADD_CUSTOMER_SUBMITTING" });
  });

  describe("reducer", () => {
    it("returns a default state for an undefined existing state", () => {
      expect(reducer(undefined, {})).toEqual({
        customer: {},
        status: undefined,
        validationErrors: {},
        error: false,
      });
    });
    describe("ADD_CUSTOMER_SUBMITTING action", () => {
      const action = { type: "ADD_CUSTOMER_SUBMITTING" };

      it("sets status to SUBMITTING", () => {
        expect(reducer(undefined, action)).toMatchObject({
          status: "SUBMITTING",
        });
      });
      it("submits request to the fetch api", async () => {
        const inputCustomer = { firstName: "Ashley" };

        dispatchRequest(inputCustomer);
        expect(window.fetch).toHaveBeenCalledWith("/customers", {
          body: JSON.stringify(inputCustomer),
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
        });
      });
    });
  });
});
