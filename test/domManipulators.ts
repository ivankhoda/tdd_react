import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";

export const createContainer = () => {
  const container = document.createElement("div");
  const form = (id) => container.querySelector(`form[id="${id}"]`) as HTMLFormElement;

  const field = (formId, name) => form(formId).elements[name];
  const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);
  const element = (selector) => container.querySelector(selector);

  const simulateEvent = (eventName) => (element, eventData) => {
    ReactTestUtils.Simulate[eventName](element, eventData);
  };
  const simulateEventAndWait = (eventName) => async (element, eventData) =>
    await act(async () => ReactTestUtils.Simulate[eventName](element, eventData));

  return {
    render: (component) =>
      act(() => {
        ReactDOM.render(component, container);
      }),
    renderAndWait: async (component) => await act(async () => ReactDOM.render(component, container)),
    container,
    form,
    field,
    labelFor,
    element,
    click: simulateEvent("click"),
    change: simulateEvent("change"),
    submit: simulateEventAndWait("submit"),
    blur: simulateEvent("blur"),
  };
};
export const withEvent = (name, value) => {
  return {
    target: { name, value },
  };
};
