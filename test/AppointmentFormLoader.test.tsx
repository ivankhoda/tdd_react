import React from "react";
import "whatwg-fetch";
import * as AppointmentFormExports from "../src/AppointmentForm";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { createContainer } from "./domManipulators";
import { fetchRequestOfBody, fetchResponseOk } from "./spyHelpers";

describe("AppointmentFormLoader", () => {
  let container, renderAndWait, render, submit, form;
  const today = new Date();
  const availableTimeSlots = [{ startsAt: today.setHours(9, 0, 0, 0) }];
  beforeEach(() => {
    ({ container, renderAndWait, render, submit, form } = createContainer());
    jest.spyOn(window, "fetch").mockReturnValue(fetchResponseOk(availableTimeSlots));
    jest.spyOn(AppointmentFormExports, "AppointmentForm").mockReturnValue(null);
  });
  afterEach(() => {
    window.fetch.mockRestore();
    AppointmentFormExports.AppointmentForm.mockRestore();
  });
  it("fetches data when component is mounted", async () => {
    await renderAndWait(<AppointmentFormLoader />);
    expect(window.fetch).toHaveBeenCalledWith(
      "/availableTimeSlots",
      expect.objectContaining({
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })
    );
  });
  it("initially passes no data to AppointmentForm", async () => {
    await renderAndWait(<AppointmentFormLoader />);
    expect(AppointmentFormExports.AppointmentForm).toHaveBeenCalledWith({ availableTimeSlots: [] }, expect.anything());
  });
  it("displays time slots that are fetched on mount", async () => {
    await renderAndWait(<AppointmentFormLoader />);
    expect(AppointmentFormExports.AppointmentForm).toHaveBeenLastCalledWith(
      {
        availableTimeSlots,
      },

      expect.anything()
    );
  });
  it("passes props through to children", async () => {
    await renderAndWait(<AppointmentFormLoader testProp={123} />);

    expect(AppointmentFormExports.AppointmentForm).toHaveBeenCalledWith(
      expect.objectContaining({ testProp: 123 }),
      expect.anything()
    );
  });
  it("passes the customer id to fetch when submitting", async () => {
    const customer = { id: 123 };
    renderAndWait(<AppointmentForm {...customer} />);
    await submit(form("appointment"));
    expect(fetchRequestOfBody(window.fetch)).toMatchObject({
      customer: customer.id,
    });
  });
});
