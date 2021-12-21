import React from "react";
import { render } from "react-dom";
import { Appointment } from "../src/Appointment";
describe("Appointment", () => {
  let container;
  let customer;
  beforeEach(() => {
    container = document.createElement("div");
  });
  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };

    render(<Appointment customer={customer} />, container);
    expect(container.textContent).toMatch("Ashley");
  });
  it("renders another customer first name", () => {
    const customer = { firstName: "Jordan" };

    render(<Appointment customer={customer} />, container);
    expect(container.textContent).toMatch("Jordan");
  });
});
