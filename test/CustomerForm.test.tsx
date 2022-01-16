import React from "react";
import ReactTestUtils, { act } from "react-dom/test-utils";
import "whatwg-fetch";
import { CustomerForm } from "../src/CustomerForm";
import { createContainer, withEvent } from "./domManipulators";
import { fetchRequestOfBody, fetchResponseError, fetchResponseOk } from "./spyHelpers";
describe("CustomerForm", () => {
  const validCustomer = {
    firstName: "first",
    lastName: "last",
    phoneNumber: "123456789",
  };
  let render, container, element, change, submit, blur;
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
      render(<CustomerForm {...validCustomer} />);
      expectToBeInputFieldOfTypeText(field("customer", fieldName));
    });

  const itIncludesTheExistingValue = (fieldName) =>
    it("includes the existing value", () => {
      render(<CustomerForm {...validCustomer} {...{ [fieldName]: fieldName }} />);

      expect(field("customer", fieldName).value).toEqual(fieldName);
    });

  const itRendersALabelForTheField = (labelName, value) => {
    it("renders a label for the first name field", () => {
      render(<CustomerForm {...validCustomer} {...{ [labelName]: value }} />);
      expect(labelFor(labelName)).not.toBeNull();
      expect(labelFor(labelName).textContent).toEqual(value);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (id) => {
    it("assigns an id that matches the label id to the  name field", () => {
      render(<CustomerForm {...validCustomer} />);
      expect(field("customer", id).id).toEqual(id);
    });
  };

  const itRendersALabel = (label, value) => {
    it("renders a label for the name field", () => {
      render(<CustomerForm {...validCustomer} />);
      expect(labelFor(label).textContent).toEqual(value);
    });
  };

  const itSubmitsExistingValue = (fieldName, value) =>
    it("saves existing value when submitted", async () => {
      render(<CustomerForm {...validCustomer} />);

      submit(form("customer"));

      expect(fetchRequestOfBody(fetchSpy)).toMatchObject({
        [fieldName]: value,
      });
    });

  const itSubmitsNewValue = (fieldName) =>
    it("saves new value when submitted", async () => {
      render(<CustomerForm {...validCustomer} {...{ [fieldName]: "existingValue" }} />);

      change(field("customer", fieldName), withEvent(fieldName, "newValue"));
      submit(form("customer"));
      expect(fetchRequestOfBody(fetchSpy)).toMatchObject({
        [fieldName]: "newValue",
      });
    });

  const itInvalidatesFieldWithValue = (fieldName, value, description) => {
    it(`displays error after blur when ${fieldName} field is'${value}'`, () => {
      render(<CustomerForm {...validCustomer} />);

      blur(field("customer", fieldName), withEvent(fieldName, value));
      expect(form("customer")).not.toBeNull();
      expect(element(".error")).not.toBeNull();
      expect(element(".error").textContent).toMatch(description);
    });
  };

  beforeEach(() => {
    ({ render, container, element, change, submit, blur } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
    jest.spyOn(window, "fetch").mockReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    window.fetch.mockRestore();
  });
  it("renders a form", () => {
    render(<CustomerForm {...validCustomer} />);
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
    render(<CustomerForm />);
    const submitButton = element('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });
  it("calls fetch with the right properties when submitting data", async () => {
    render(<CustomerForm {...validCustomer} />);
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
    render(<CustomerForm {...validCustomer} onSave={saveSpy} />);
    await submit(form("customer"));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it("does not notify onSave if the POST request returns an error", async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<CustomerForm {...validCustomer} onSave={saveSpy} />);
    await submit(form("customer"));

    expect(saveSpy).not.toHaveBeenCalled();
  });
  it("prevents the default action when submitting the form", async () => {
    const preventDefaultSpy = jest.fn();
    render(<CustomerForm {...validCustomer} />);
    await submit(form("customer"), {
      preventDefault: preventDefaultSpy,
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  it("renders error message when fetch call fails", async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));
    render(<CustomerForm {...validCustomer} />);
    await submit(form("customer"));

    expect(element(".error")).not.toBeNull();
    expect(element(".error").textContent).toMatch("error occurred");
  });
  it("accepts standard phone number characters when validating", () => {
    render(<CustomerForm {...validCustomer} />);
    blur(element("[name='phoneNumber']"), withEvent("phoneNumber", "0123456789+()- "));
    expect(element(".error")).toBeNull();
  });
  it("accepts standard phone number characters when validating", () => {
    render(<CustomerForm {...validCustomer} />);
    blur(element("[name='phoneNumber']"), withEvent("phoneNumber", "0123456789+()- "));
    expect(element(".error")).toBeNull();
  });
  it("does not submit the form when there are validation errors", async () => {
    render(<CustomerForm />);
    await submit(form("customer"));
    expect(window.fetch).not.toHaveBeenCalled();
  });
  it("renders validation errors after submission fails", async () => {
    render(<CustomerForm />);
    await submit(form("customer"));
    expect(window.fetch).not.toHaveBeenCalled();
    expect(element(".error")).not.toBeNull();
  });
  it("renders field validation errors from server", async () => {
    const errors = {
      phoneNumber: "Phone number already exists in the system",
    };
    window.fetch.mockReturnValue(fetchResponseError(422, { errors }));
    render(<CustomerForm {...validCustomer} />);
    await submit(form("customer"));
    expect(element(".error").textContent).toMatch(errors.phoneNumber);
  });
  it("displays indicator when form is submitting", async () => {
    render(<CustomerForm {...validCustomer} />);
    act(() => {
      ReactTestUtils.Simulate.submit(form("customer"));
    });
    await act(async () => {
      expect(element("span.submittingIndicator")).not.toBeNull();
    });
  });
  it("initially does not display the submitting indicator", () => {
    render(<CustomerForm {...validCustomer} />);
    expect(element(".submittingIndicator")).toBeNull();
  });
  it("hides indicator when form has submitted", async () => {
    render(<CustomerForm {...validCustomer} />);
    await submit(form("customer"));
    expect(element(".submittingIndicator")).toBeNull();
  });
});
