import React from "react";
import { CustomerForm } from "../src/CustomerForm";
import { createContainer } from "./domManipulators";
describe("CustomerForm", () => {
  let render, container;
  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const firstNameField = () => form("customer").elements.firstName;
  beforeEach(() => {
    ({ render, container } = createContainer());
  });
  it("renders a form", () => {
    render(<CustomerForm firstName={undefined} />);
    expect(form("customer")).not.toBeNull();
  });
  it("renders the first name field as a text box", () => {
    render(<CustomerForm firstName={undefined} />);

    expect(firstNameField()).not.toBeNull();
    expect(firstNameField().tagName).toEqual("INPUT");
    expect(firstNameField().type).toEqual("text");
  });
  it("includes the existing value for the first name", () => {
    render(<CustomerForm firstName="Ashley" />);

    expect(firstNameField().value).toEqual("Ashley");
  });
});
