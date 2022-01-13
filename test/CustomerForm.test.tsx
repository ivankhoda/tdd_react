import React from "react";
import "whatwg-fetch";
import { CustomerForm } from "../src/CustomerForm";
import { createContainer, withEvent } from "./domManipulators";
import { fetchRequestOfBody, fetchResponseError, fetchResponseOk } from "./spyHelpers";
describe("CustomerForm", () => {
  let render, container, element, change, submit, blur;
  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const field = (name) => form("customer").elements[name];
  const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);
  let fetchSpy;
  const originalFetch = window.fetch;
  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  //TEST FUNCTIONS
  const itRendersAsATextBox = (fieldName) =>
    it("renders as a text box", () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });

  const itIncludesTheExistingValue = (fieldName) =>
    it("includes the existing value", () => {
      render(<CustomerForm {...{ [fieldName]: fieldName }} />);

      expect(field(fieldName).value).toEqual(fieldName);
    });

  const itRendersALabelForTheField = (labelName, value) => {
    it("renders a label for the first name field", () => {
      render(<CustomerForm {...{ [labelName]: value }} />);
      expect(labelFor(labelName)).not.toBeNull();
      expect(labelFor(labelName).textContent).toEqual(value);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (id) => {
    it("assigns an id that matches the label id to the  name field", () => {
      render(<CustomerForm />);
      expect(field(id).id).toEqual(id);
    });
  };

  const itRendersALabel = (label, value) => {
    it("renders a label for the name field", () => {
      render(<CustomerForm />);
      expect(labelFor(label).textContent).toEqual(value);
    });
  };

  const itSubmitsExistingValue = (fieldName) =>
    it("saves existing value when submitted", async () => {
      render(<CustomerForm {...{ [fieldName]: "value" }} />);

      submit(form("customer"));

      expect(fetchRequestOfBody(fetchSpy)).toMatchObject({
        [fieldName]: "value",
      });
    });

  const itSubmitsNewValue = (fieldName) =>
    it("saves new value when submitted", async () => {
      render(<CustomerForm {...{ [fieldName]: "existingValue" }} />);

      change(field(fieldName), withEvent(fieldName, "newValue"));
      submit(form("customer"));
      expect(fetchRequestOfBody(fetchSpy)).toMatchObject({
        [fieldName]: "newValue",
      });
    });

  beforeEach(() => {
    ({ render, container, element, change, submit, blur } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
    jest.spyOn(window, "fetch").mockReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    window.fetch = originalFetch;
    //window.fetch.mockRestore();
  });
  it("renders a form", () => {
    render(<CustomerForm firstName={undefined} />);
    expect(form("customer")).not.toBeNull();
  });
  describe("first name field", () => {
    itRendersAsATextBox("firstName");

    itIncludesTheExistingValue("firstName");

    itRendersALabelForTheField("firstName", "First name");

    itAssignsAnIdThatMatchesTheLabelId("firstName");

    itRendersALabel("firstName", "First name");

    itSubmitsExistingValue("firstName");

    itSubmitsNewValue("firstName");
    it("displays error after blur when first name field is blank", () => {
      render(<CustomerForm />);
      blur(field("customer"), withEvent("firstName", " "));
      expect(element(".error")).not.toBeNull();
      expect(element(".error").textContent).toMatch("First name is required");
    });
  });
  describe("last name field", () => {
    itRendersAsATextBox("lastName");

    itIncludesTheExistingValue("lastName");

    itRendersALabelForTheField("lastName", "Last name");

    itRendersALabel("lastName", "Last name");

    itAssignsAnIdThatMatchesTheLabelId("lastName");

    itRendersALabel("lastName", "Last name");

    itSubmitsExistingValue("lastName");
  });
  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");

    itIncludesTheExistingValue("phoneNumber");

    itRendersALabelForTheField("phoneNumber", "Phone number");

    itRendersALabel("phoneNumber", "Phone number");

    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");

    itRendersALabel("phoneNumber", "Phone number");

    itSubmitsExistingValue("phoneNumber");
  });

  it("has a submit button", () => {
    render(<CustomerForm />);
    const submitButton = element('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });
  it("calls fetch with the right properties when submitting data", async () => {
    render(<CustomerForm />);
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
    render(<CustomerForm onSave={saveSpy} />);
    await submit(form("customer"));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it("does not notify onSave if the POST request returns an error", async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} />);
    await submit(form("customer"));

    expect(saveSpy).not.toHaveBeenCalled();
  });
  it("prevents the default action when submitting the form", async () => {
    const preventDefaultSpy = jest.fn();
    render(<CustomerForm />);
    await submit(form("customer"), {
      preventDefault: preventDefaultSpy,
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  it("renders error message when fetch call fails", async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));
    render(<CustomerForm />);
    await submit(form("customer"));

    expect(element(".error")).not.toBeNull();
    expect(element(".error").textContent).toMatch("error occurred");
  });
});
