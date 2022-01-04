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
      render(<CustomerForm {...{ [fieldName]: "value" }} />);
      expect(field(fieldName).value).toEqual("value");
    });

  const itRendersALabelForTheField = (labelName) => {
    it("renders a label for the first name field", () => {
      render(<CustomerForm {...{ [labelName]: "value" }} />);
      expect(labelFor("firstName")).not.toBeNull();
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
  };

  beforeEach(() => {
    ({ render, container } = createContainer());
  });
  describe("first name field", () => {
    it("renders a form", () => {
      render(<CustomerForm firstName={undefined} />);
      expect(form("customer")).not.toBeNull();
    });

    itRendersAsATextBox("firstName");

    itIncludesTheExistingValue("firstName");

    itRendersALabelForTheField("firstName");

    it("assigns an id that matches the label id to the first name field", () => {
      render(<CustomerForm />);
      expect(field("firstName").id).toEqual("firstName");
    });
    it("renders a label for the first name field", () => {
      render(<CustomerForm />);
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
    it("saves new first name when submitted", async () => {
      expect.hasAssertions();
      render(<CustomerForm firstName="Ashley" onSubmit={({ firstName }) => expect(firstName).toEqual("Jamie")} />);
      await ReactTestUtils.Simulate.change(field("firstName"), {
        target: { value: "Jamie" },
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });
  });
  describe("first name field", () => {
    it("renders a form", () => {
      render(<CustomerForm firstName={undefined} />);
      expect(form("customer")).not.toBeNull();
    });
    it("renders the first name field as a text box", () => {
      render(<CustomerForm firstName={undefined} />);

      expect(field("firstName")).not.toBeNull();
      expect(field("firstName").tagName).toEqual("INPUT");
      expect(field("firstName").type).toEqual("text");
    });
    it("includes the existing value for the first name", () => {
      render(<CustomerForm firstName="Ashley" />);
      expect(field("firstName").value).toEqual("Ashley");
    });

    it("renders a label for the first name field", () => {
      render(<CustomerForm />);
      expect(labelFor("firstName")).not.toBeNull();
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
    it("assigns an id that matches the label id to the first name field", () => {
      render(<CustomerForm />);
      expect(field("firstName").id).toEqual("firstName");
    });
    it("renders a label for the first name field", () => {
      render(<CustomerForm />);
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
    it("saves new first name when submitted", async () => {
      expect.hasAssertions();
      render(<CustomerForm firstName="Ashley" onSubmit={({ firstName }) => expect(firstName).toEqual("Jamie")} />);
      await ReactTestUtils.Simulate.change(field("firstName"), {
        target: { value: "Jamie" },
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });
  });
  describe("first name field", () => {
    it("renders a form", () => {
      render(<CustomerForm firstName={undefined} />);
      expect(form("customer")).not.toBeNull();
    });
    it("renders the first name field as a text box", () => {
      render(<CustomerForm firstName={undefined} />);

      expect(field("firstName")).not.toBeNull();
      expect(field("firstName").tagName).toEqual("INPUT");
      expect(field("firstName").type).toEqual("text");
    });
    it("includes the existing value for the first name", () => {
      render(<CustomerForm firstName="Ashley" />);
      expect(field("firstName").value).toEqual("Ashley");
    });

    it("renders a label for the first name field", () => {
      render(<CustomerForm />);
      expect(labelFor("firstName")).not.toBeNull();
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
    it("assigns an id that matches the label id to the first name field", () => {
      render(<CustomerForm />);
      expect(field("firstName").id).toEqual("firstName");
    });
    it("renders a label for the first name field", () => {
      render(<CustomerForm />);
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
    it("saves new first name when submitted", async () => {
      expect.hasAssertions();
      render(<CustomerForm firstName="Ashley" onSubmit={({ firstName }) => expect(firstName).toEqual("Jamie")} />);
      await ReactTestUtils.Simulate.change(field("firstName"), {
        target: { value: "Jamie" },
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });
  });
  describe("first name field", () => {
    it("renders a form", () => {
      render(<CustomerForm firstName={undefined} />);
      expect(form("customer")).not.toBeNull();
    });
    it("renders the first name field as a text box", () => {
      render(<CustomerForm firstName={undefined} />);

      expect(field("firstName")).not.toBeNull();
      expect(field("firstName").tagName).toEqual("INPUT");
      expect(field("firstName").type).toEqual("text");
    });
    it("includes the existing value for the first name", () => {
      render(<CustomerForm firstName="Ashley" />);
      expect(field("firstName").value).toEqual("Ashley");
    });

    it("renders a label for the first name field", () => {
      render(<CustomerForm />);
      expect(labelFor("firstName")).not.toBeNull();
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
    it("assigns an id that matches the label id to the first name field", () => {
      render(<CustomerForm />);
      expect(field("firstName").id).toEqual("firstName");
    });
    it("renders a label for the first name field", () => {
      render(<CustomerForm />);
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
    it("saves new first name when submitted", async () => {
      expect.hasAssertions();
      render(<CustomerForm firstName="Ashley" onSubmit={({ firstName }) => expect(firstName).toEqual("Jamie")} />);
      await ReactTestUtils.Simulate.change(field("firstName"), {
        target: { value: "Jamie" },
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });
  });
});
