import { default as React } from "react";
const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return Array(totalSlots)
    .fill([startTime])
    .reduce((acc, _, i) => acc.concat([startTime + i * increment]));
};
const toTimeValue = (timestamp) => new Date(timestamp).toTimeString().substring(0, 5);

const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return Array(7)
    .fill([midnight])
    .reduce((acc, _, i) => acc.concat([midnight + i * increment]));
};

const toShortDate = (timestamp) => {
  const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
  return `${day} ${dayOfMonth}`;
};

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
};

const RadioButtonIfAvailable = ({ availableTimeSlots, date, timeSlot, checkedTimeSlot, handleChange }) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (availableTimeSlots.some((availableTimeSlot) => availableTimeSlot.startsAt === startsAt)) {
    const isChecked = startsAt === checkedTimeSlot;
    return <input name="startsAt" type="radio" checked={isChecked} onChange={handleChange} />;
  } else {
    return null;
  }
};

export const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  checkedTimeSlot,
  handleChange,
}) => {
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  const dates = weeklyDateValues(today);

  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map((d) => (
            <th key={d}>{toShortDate(d)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map((date) => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
