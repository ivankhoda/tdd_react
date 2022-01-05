import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { CustomerForm } from "../src/CustomerForm";
import { createContainer } from "./domManipulators";
describe("CustomerForm", () => {
  let render, container;
  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const field = (name) => form("customer").elements[name];
  const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);

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
    it("assigns an id that matches the label id to the first name field", () => {
      render(<CustomerForm />);
      expect(field(id).id).toEqual(id);
    });
  };

  const itRendersALabel = (label, value) => {
    it("renders a label for the first name field", () => {
      render(<CustomerForm />);
      expect(labelFor(label).textContent).toEqual(value);
    });
  };

  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{ [fieldName]: "existingValue" }}
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: value, name: fieldName },
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });

  beforeEach(() => {
    ({ render, container } = createContainer());
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

    itSubmitsNewValue("firstName", "firstName");
  });
  describe("last name field", () => {
    itRendersAsATextBox("lastName");

    itIncludesTheExistingValue("lastName");

    itRendersALabelForTheField("lastName", "Last name");

    itRendersALabel("lastName", "Last name");

    itAssignsAnIdThatMatchesTheLabelId("lastName");

    itRendersALabel("lastName", "Last name");

    itSubmitsNewValue("lastName", "lastName");
  });
  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");

    itIncludesTheExistingValue("phoneNumber");

    itRendersALabelForTheField("phoneNumber", "Phone number");

    itRendersALabel("phoneNumber", "Phone number");

    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");

    itRendersALabel("phoneNumber", "Phone number");

    itSubmitsNewValue("phoneNumber", "phoneNumber");
  });

  it("has a submit button", () => {
    render(<CustomerForm />);
    const submitButton = container.querySelector('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });
});
