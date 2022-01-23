import { expectRedux } from "expect-redux";
import React from "react";
import "whatwg-fetch";
import { CustomerForm } from "../src/CustomerForm";
import { createContainerWithStore, withEvent } from "./domManipulators";
import { fetchRequestOfBody, fetchResponseError, fetchResponseOk } from "./spyHelpers";
describe("CustomerForm", () => {
  const validCustomer = {
    firstName: "first",
    lastName: "last",
    phoneNumber: "123456789",
  };
  let render, container, element, change, submit, blur, renderWithStore, store;
  const form = (id) => container.querySelector(`form[id="${id}"]`);

  const field = (formId, name) => form(formId).elements[name];
  const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);
  let fetchSpy;

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  //TEST FUNCTIONS
  const itRendersAsATextBox = (fieldName) =>
    it("renders as a text box", () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expectToBeInputFieldOfTypeText(field("customer", fieldName));
    });

  const itIncludesTheExistingValue = (fieldName) =>
    it("includes the existing value", () => {
      renderWithStore(<CustomerForm {...validCustomer} {...{ [fieldName]: fieldName }} />);

      expect(field("customer", fieldName).value).toEqual(fieldName);
    });

  const itRendersALabelForTheField = (labelName, value) => {
    it("renders a label for the first name field", () => {
      renderWithStore(<CustomerForm {...validCustomer} {...{ [labelName]: value }} />);
      expect(labelFor(labelName)).not.toBeNull();
      expect(labelFor(labelName).textContent).toEqual(value);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (id) => {
    it("assigns an id that matches the label id to the  name field", () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expect(field("customer", id).id).toEqual(id);
    });
  };

  const itRendersALabel = (label, value) => {
    it("renders a label for the name field", () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expect(labelFor(label).textContent).toEqual(value);
    });
  };

  const itSubmitsExistingValue = (fieldName, value) =>
    it("saves existing value when submitted", async () => {
      renderWithStore(<CustomerForm {...validCustomer} />);

      submit(form("customer"));

      expect(fetchRequestOfBody(fetchSpy)).toMatchObject({
        [fieldName]: value,
      });
    });

  const itSubmitsNewValue = (fieldName) =>
    it("saves new value when submitted", async () => {
      renderWithStore(<CustomerForm {...validCustomer} {...{ [fieldName]: "existingValue" }} />);

      change(field("customer", fieldName), withEvent(fieldName, "newValue"));
      submit(form("customer"));
      expect(fetchRequestOfBody(fetchSpy)).toMatchObject({
        [fieldName]: "newValue",
      });
    });

  const itInvalidatesFieldWithValue = (fieldName, value, description) => {
    it(`displays error after blur when ${fieldName} field is'${value}'`, () => {
      renderWithStore(<CustomerForm {...validCustomer} />);

      blur(field("customer", fieldName), withEvent(fieldName, value));
      expect(form("customer")).not.toBeNull();
      expect(element(".error")).not.toBeNull();
      expect(element(".error").textContent).toMatch(description);
    });
  };

  beforeEach(() => {
    ({ render, container, element, change, submit, blur, renderWithStore, store } = createContainerWithStore());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
    jest.spyOn(window, "fetch").mockReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    window.fetch.mockRestore();
  });
  it("renders a form", () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    expect(form("customer")).not.toBeNull();
  });
  describe("first name field", () => {
    itRendersAsATextBox("firstName");

    itIncludesTheExistingValue("firstName");

    itRendersALabelForTheField("firstName", "First name");

    itAssignsAnIdThatMatchesTheLabelId("firstName");

    itRendersALabel("firstName", "First name");

    itSubmitsExistingValue("firstName", "first");

    itSubmitsNewValue("firstName");
    itInvalidatesFieldWithValue("firstName", " ", "First name is required");
  });
  describe("last name field", () => {
    itRendersAsATextBox("lastName");

    itIncludesTheExistingValue("lastName");

    itRendersALabelForTheField("lastName", "Last name");

    itRendersALabel("lastName", "Last name");

    itAssignsAnIdThatMatchesTheLabelId("lastName");

    itRendersALabel("lastName", "Last name");

    itSubmitsExistingValue("lastName", "last");

    itInvalidatesFieldWithValue("lastName", " ", "Last name is required");
  });
  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");

    itIncludesTheExistingValue("phoneNumber");

    itRendersALabelForTheField("phoneNumber", "Phone number");

    itRendersALabel("phoneNumber", "Phone number");

    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");

    itRendersALabel("phoneNumber", "Phone number");

    itSubmitsExistingValue("phoneNumber", "123456789");

    itInvalidatesFieldWithValue("phoneNumber", " ", "Phone number is required");
    itInvalidatesFieldWithValue(
      "phoneNumber",
      "invalid",
      "Only numbers, spaces and these symbols are allowed: ( ) + -"
    );
  });

  it("has a submit button", () => {
    renderWithStore(<CustomerForm />);
    const submitButton = element('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });
  it("calls fetch with the right properties when submitting data", async () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    submit(form("customer"));

    expect(window.fetch).toHaveBeenCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })
    );
  });
  it("notifies onSave when form is submitted", async () => {
    const customer = { id: 123 };
    fetchSpy.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();
    renderWithStore(<CustomerForm {...validCustomer} onSave={saveSpy} />);
    await submit(form("customer"));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it("does not notify onSave if the POST request returns an error", async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    renderWithStore(<CustomerForm {...validCustomer} onSave={saveSpy} />);
    await submit(form("customer"));

    expect(saveSpy).not.toHaveBeenCalled();
  });
  it("prevents the default action when submitting the form", async () => {
    const preventDefaultSpy = jest.fn();
    renderWithStore(<CustomerForm {...validCustomer} />);
    await submit(form("customer"), {
      preventDefault: preventDefaultSpy,
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  it("renders error message when fetch call fails", async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));
    renderWithStore(<CustomerForm {...validCustomer} />);
    await submit(form("customer"));

    expect(element(".error")).not.toBeNull();
    expect(element(".error").textContent).toMatch("error occurred");
  });
  it("accepts standard phone number characters when validating", () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    blur(element("[name='phoneNumber']"), withEvent("phoneNumber", "0123456789+()- "));
    expect(element(".error")).toBeNull();
  });
  it("accepts standard phone number characters when validating", () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    blur(element("[name='phoneNumber']"), withEvent("phoneNumber", "0123456789+()- "));
    expect(element(".error")).toBeNull();
  });
  it("does not submit the form when there are validation errors", async () => {
    renderWithStore(<CustomerForm />);
    await submit(form("customer"));
    return expectRedux(store).toNotDispatchAnAction(100).ofType("ADD_CUSTOMER_REQUEST");
  });
  it("renders validation errors after submission fails", async () => {
    renderWithStore(<CustomerForm />);
    await submit(form("customer"));
    expect(window.fetch).not.toHaveBeenCalled();
    expect(element(".error")).not.toBeNull();
  });
  it("renders field validation errors from server", async () => {
    const errors = {
      phoneNumber: "Phone number already exists in the system",
    };
    renderWithStore(<CustomerForm {...validCustomer} />);
    store.dispatch({
      type: "ADD_CUSTOMER_VALIDATION_FAILED",
      validationErrors: errors,
    });
    expect(element(".error").textContent).toMatch(errors.phoneNumber);
  });
  it("displays indicator when form is submitting", async () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    store.dispatch({ type: "ADD_CUSTOMER_SUBMITTING" });
    expect(element("span.submittingIndicator")).not.toBeNull();
  });
  it("initially does not display the submitting indicator", () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    expect(element(".submittingIndicator")).toBeNull();
  });
  it("hides indicator when form has submitted", async () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    store.dispatch({ type: "ADD_CUSTOMER_SUCCESSFUL" });
    expect(element(".submittingIndicator")).toBeNull();
  });
  it("dispatches ADD_CUSTOMER_REQUEST when submitting data", async () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    await submit(form("customer"));
    return expectRedux(store).toDispatchAnAction().matching({
      type: "ADD_CUSTOMER_REQUEST",
      customer: validCustomer,
    });
  });
  it("renders error message when error prop is true", () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    store.dispatch({ type: "ADD_CUSTOMER_FAILED" });
    expect(element(".error").textContent).toMatch("error occurred");
  });
});
