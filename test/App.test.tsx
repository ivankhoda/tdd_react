import React from "react";
import { App } from "../src/App";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/CustomerForm";
import { CustomerSearch } from "../src/CustomerSearch/CustomerSearch";
import { childrenOf, className, click, createShallowRenderer, id, type } from "./shallowHelpers";

describe("App", () => {
  let render, elementMatching, child;
  beforeEach(() => {
    ({ render, elementMatching, child } = createShallowRenderer());
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
  const beginAddingCustomerAndAppointment = () => {
    render(<App />);
    click(elementMatching(id("addCustomer")));
  };
  it("displays the CustomerForm when button is clicked", async () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(type(CustomerForm))).toBeDefined();
  });
  it("hides the AppointmentDayViewLoader when button is clicked", async () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(type(AppointmentsDayViewLoader))).not.toBeDefined();
  });

  it("hides the button bar when CustomerForm is being displayed", async () => {
    beginAddingCustomerAndAppointment();
    //expect(wrapper.find(".button-bar").exists()).not.toBeTruthy();
  });
  const saveCustomer = (customer) => elementMatching(type(CustomerForm)).props.onSave(customer);
  it("displays the AppointmentFormLoader after the CustomerForm is submitted", async () => {
    beginAddingCustomerAndAppointment();
    saveCustomer();
    expect(elementMatching(type(AppointmentFormLoader))).toBeDefined();
  });

  it("passes the customer to the AppointmentForm", async () => {
    const customer = { id: 123 };
    beginAddingCustomerAndAppointment();
    saveCustomer(customer);
    expect(elementMatching(type(AppointmentFormLoader)).props.customer).toBe(customer);
  });
  const saveAppointment = () => elementMatching(type(AppointmentFormLoader)).props.onSave();
  it("renders AppointmentDayViewLoader after AppointmentForm is submitted", async () => {
    beginAddingCustomerAndAppointment();
    saveCustomer();
    saveAppointment();
    expect(elementMatching(type(AppointmentsDayViewLoader))).toBeDefined();
  });
  const renderSearchActionsForCustomer = (customer) => {
    const customerSearch = elementMatching(type(CustomerSearch));
    const searchActionsComponent = customerSearch.props.renderCustomerActions;
    return searchActionsComponent(customer);
  };
  // it("passes a button to the CustomerSearch named Create appointment", async () => {
  //   const button = childrenOf(renderSearchActionsForCustomer())[0];
  //   expect(button).toBeDefined();
  //   expect(button.type).toEqual("button");
  //   expect(button.props.role).toEqual("button");
  //   expect(button.props.children).toEqual("Create appointment");
  // });
  it("renders CustomerForm at the /addCustomer endpoint", () => {
    render(<App />);
    expect(routeFor("/addCustomer").props.component).toEqual(CustomerForm);
  });
});
