import { default as React, useCallback, useState } from "react";
import { TimeSlotTable } from "./TimeSlotTable";

export const AppointmentForm = ({
  selectableServices,
  service,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  startsAt,
}) => {
  const [appointment, setAppointment] = useState({
    service,
    startsAt,
  });
  const handleStartsAtChange = useCallback(
    ({ target: { value } }) =>
      setAppointment((appointment) => ({
        ...appointment,
        startsAt: parseInt(value),
      })),
    []
  );
  return (
    <form id="appointment">
      <label htmlFor="service">Salon service</label>
      <select name="service" value={service} readOnly>
        <option />{" "}
        {selectableServices.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <TimeSlotTable
        checkedTimeSlot={appointment.startsAt}
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={availableTimeSlots}
        handleChange={handleStartsAtChange}
      />
      <input type="submit" value="Add" />
    </form>
  );
};
AppointmentForm.defaultProps = {
  selectableServices: ["Cut", "Blow-dry", "Cut & color", "Beard trim", "Cut & beard trim", "Extensions"],
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
  availableTimeSlots: [],
};
