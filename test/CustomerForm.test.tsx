import React from "react";
import ReactTestUtils, { act } from "react-dom/test-utils";
import { CustomerForm } from "../src/CustomerForm";
import { createContainer } from "./domManipulators";
describe("CustomerForm", () => {
  let render, container;
  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const field = (name) => form("customer").elements[name];
  const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);
  const originalFetch = window.fetch;
  let fetchSpy;

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  const fetchResponseOk = (body) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    });

  const fetchResponseError = () => Promise.resolve({ ok: false });

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
  const fetchRequestBody = () => JSON.parse(fetchSpy.mock.calls[0][1].body);
  const itSubmitsExistingValue = (fieldName) =>
    it("saves existing value when submitted", async () => {
      render(<CustomerForm {...{ [fieldName]: "value" }} />);

      ReactTestUtils.Simulate.submit(form("customer"));

      expect(fetchRequestBody()).toMatchObject({
        [fieldName]: "value",
      });
    });

  const itSubmitsNewValue = (fieldName) =>
    it("saves new value when submitted", async () => {
      render(<CustomerForm {...{ [fieldName]: "existingValue" }} />);

      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: "newValue", name: fieldName },
      });
      ReactTestUtils.Simulate.submit(form("customer"));
      expect(fetchRequestBody()).toMatchObject({
        [fieldName]: "newValue",
      });
    });

  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
  });
  afterEach(() => {
    window.fetch = originalFetch;
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
    const submitButton = container.querySelector('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });
  it("calls fetch with the right properties when submitting data", async () => {
    render(<CustomerForm />);
    ReactTestUtils.Simulate.submit(form("customer"));

    expect(fetchSpy).toHaveBeenCalledWith(
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
    await act(async () => {
      ReactTestUtils.Simulate.submit(form("customer"));
    });
    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it("does not notify onSave if the POST request returns an error", async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form("customer"));
    });
    expect(saveSpy).not.toHaveBeenCalled();
  });
  it("prevents the default action when submitting the form", async () => {
    const preventDefaultSpy = jest.fn();
    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form("customer"), {
        preventDefault: preventDefaultSpy,
      });
    });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  it("renders error message when fetch call fails", async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));
    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form("customer"));
    });
    const errorElement = container.querySelector(".error");
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch("error occurred");
  });
});
