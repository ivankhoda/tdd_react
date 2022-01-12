import React from "react";
import { App } from "../src/App";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { child, childrenOf, className, createShallowRenderer, type } from "./shallowHelpers";
describe("App", () => {
  let render, elementMatching;
  beforeEach(() => {
    ({ render, elementMatching } = createShallowRenderer());
  });
  it("initially shows the AppointmentDayViewLoader", () => {
    render(<App />);
    expect(elementMatching(type(AppointmentsDayViewLoader))).toBeDefined();
  });
  it("has a button bar as the first child", () => {
    render(<App />);
    expect(child(0).type).toEqual("div");
    expect(child(0).props.className).toEqual("button-bar");
  });
  it("has a button to initiate add customer and appointment action", () => {
    render(<App />);
    const buttons = childrenOf(elementMatching(className("button-bar")));
    expect(buttons[0].type).toEqual("button");
    expect(buttons[0].props.children).toEqual("Add customer and appointment");
  });
});
