import React from "react";
import ReactDOM from "react-dom";
import { AppointmentForm } from "./AppointmentForm";
const today = new Date();
const availableTimeSlots = [{ startsAt: today.setHours(9, 0, 0, 0) }, { startsAt: today.setHours(9, 30, 0, 0) }];
ReactDOM.render(
  <AppointmentForm availableTimeSlots={availableTimeSlots} today={today} />,
  document.getElementById("root")
);
