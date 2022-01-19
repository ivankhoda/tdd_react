import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { AppointmentFormLoader } from "./AppointmentFormLoader";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";
import { CustomerSearch } from "./CustomerSearch";
export const MainScreen = () => (
  <React.Fragment>
    <div className="button-bar">
      <Link to="/addCustomer" className="button">
        Add customer and appointment
      </Link>
      <Link to="/searchCustomers" className="button">
        Search customers
      </Link>
    </div>
    <AppointmentsDayViewLoader />
  </React.Fragment>
);
export const App = () => {
  const [view, setView] = useState("dayView");
  const [customer, setCustomer] = useState();
  const transitionToAddCustomer = useCallback(() => setView("addCustomer"), []);
  const transitionToAddAppointment = useCallback((customer) => {
    setCustomer(customer);
    setView("addAppointment");
  }, []);
  const transitionToDayView = useCallback(() => setView("dayView"), []);
  const searchActions = (customer) => (
    <React.Fragment>
      <button role="button" onClick={() => transitionToAddAppointment(customer)}>
        Create appointment
      </button>
    </React.Fragment>
  );

  const today = new Date();
  switch (view) {
    case "searchCustomers":
      return <CustomerSearch renderCustomerActions={searchActions} />;
    case "addCustomer":
      return <CustomerForm onSave={transitionToAddAppointment} />;
    case "addAppointment":
      return <AppointmentFormLoader customer={customer} onSave={transitionToDayView} />;

    default:
      return (
        <React.Fragment>
          <div className="button-bar">
            <button type="button" id="addCustomer" onClick={transitionToAddCustomer}>
              Add customer and appointment
            </button>
          </div>
          <AppointmentsDayViewLoader today={today} />
        </React.Fragment>
      );
  }
};
