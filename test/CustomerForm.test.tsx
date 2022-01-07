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

  const spy = () => {
    let receivedArguments;
    //let returnValue;

    return {
      fn: (...args) => {
        receivedArguments = args;
        return returnValue;
      },
      receivedArguments: () => receivedArguments,

      receivedArgument: (n) => receivedArguments[n],
      //stubReturnValue: (value) => (returnValue = value),
    };
  };
  expect.extend({
    toHaveBeenCalled(received) {
      if (received.receivedArguments() === undefined) {
        return {
          pass: false,
          message: () => "Spy was not called.",
        };
      }
      return { pass: true, message: () => "Spy was called." };
    },
  });

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

  const itSubmitsExistingValue = (fieldName) =>
    it("saves existing value when submitted", async () => {
      const fetchSpy = spy();
      render(<CustomerForm {...{ [fieldName]: "value" }} fetch={fetchSpy.fn} />);
      ReactTestUtils.Simulate.submit(form("customer"));

      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual("value");
    });

  // const itSubmitsNewValue = (fieldName) =>
  //   it("saves new value when submitted", async () => {
  //     render(<CustomerForm {...{ [fieldName]: "existingValue" }} fetch={fetchSpy.fn} onSubmit={() => {}} />);

  //     ReactTestUtils.Simulate.change(field(fieldName), {
  //       target: { value: "newValue", name: fieldName },
  //     });
  //     ReactTestUtils.Simulate.submit(form("customer"));
  //     const fetchOpts = fetchSpy.receivedArgument(1);
  //     expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual("newValue");
  //   });

  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = spy();
    window.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
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

    //itSubmitsNewValue("newValue");
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
    const fetchSpy = spy();
    render(<CustomerForm onSubmit={() => {}} />);
    ReactTestUtils.Simulate.submit(form("customer"));

    expect(fetchSpy.receivedArgument(0)).toEqual("/customers");

    const fetchOpts = fetchSpy.receivedArgument(1);
    console.log(fetchSpy);
    expect(fetchOpts.method).toEqual("POST");
    expect(fetchOpts.credentials).toEqual("same-origin");
    expect(fetchOpts.headers).toEqual({
      "Content-Type": "application/json",
    });
    it("notifies onSave when form is submitted", async () => {
      const customer = { id: 123 };
      fetchSpy.stubReturnValue(fetchResponseOk(customer));
      const saveSpy = spy();
      render(<CustomerForm onSave={saveSpy.fn} />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      expect(saveSpy).toHaveBeenCalled();
      expect(saveSpy.receivedArgument(0)).toEqual(customer);
    });

    it("does not notify onSave if the POST request returns an error", async () => {
      fetchSpy.stubReturnValue(fetchResponseError());
      const saveSpy = spy();
      render(<CustomerForm onSave={saveSpy.fn} />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      expect(saveSpy).not.toHaveBeenCalled();
    });
    it("prevents the default action when submitting the form", async () => {
      const preventDefaultSpy = spy();
      render(<CustomerForm />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"), {
          preventDefault: preventDefaultSpy.fn,
        });
      });
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
