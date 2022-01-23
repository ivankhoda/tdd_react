import { default as React, useState } from "react";
import { connect } from "react-redux";
import { anyErrors, hasError, list, match, required, validateMany } from "./formValidation";
const mapStateToProps = ({ customer: { validationErrors, error, status } }) => ({
  serverValidationErrors: validationErrors,
  error,
  status,
});
const mapDispatchToProps = {
  addCustomerRequest: (customer) => ({
    type: "ADD_CUSTOMER_REQUEST",
    customer,
  }),
};

export const CustomerForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ firstName, lastName, phoneNumber, onSave, addCustomerRequest, error, serverValidationErrors, status }) => {
  const [customer, setCustomer] = useState({ firstName, lastName, phoneNumber });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = ({ target }) => {
    setCustomer((customer) => ({
      ...customer,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = validateMany(validators, customer);
    if (!anyErrors(validationResult)) {
      addCustomerRequest(customer);
      const result = await window.fetch("/customers", {
        method: "POST",
        body: JSON.stringify(customer),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      });

      if (result.ok) {
        const customerWithId = await result.json();
        onSave(customerWithId);
      } else if (result.status === 422) {
        const response = await result.json();
        setValidationErrors(response.errors);
      } else {
      }
    } else {
      setValidationErrors(validationResult);
    }
  };
  const submitting = status === "SUBMITTING";
  const validators = {
    firstName: required("First name is required"),
    lastName: required("Last name is required"),
    phoneNumber: list(
      required("Phone number is required"),
      match(/^[0-9+()\- ]*$/, "Only numbers, spaces and these symbols are allowed: ( ) + -")
    ),
  };

  const handleBlur = ({ target }) => {
    const result = validateMany(validators, {
      [target.name]: target.value,
    });
    setValidationErrors({ ...validationErrors, ...result });
  };

  const renderError = (fieldName) => {
    const allValidationErrors = {
      ...validationErrors,
      ...serverValidationErrors,
    };
    if (hasError(allValidationErrors, fieldName)) {
      return <span className="error">{allValidationErrors[fieldName]} </span>;
    }
  };
  const Error = () => <div className="error">An error occurred during save.</div>;

  return (
    <form id="customer" onSubmit={handleSubmit}>
      {error ? <Error /> : null}
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {renderError("firstName")}
      <label htmlFor="lastName">Last name</label>
      <input type="text" name="lastName" id="lastName" value={lastName} onChange={handleChange} onBlur={handleBlur} />
      {renderError("lastName")}
      <label htmlFor="phoneNumber">Phone number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {renderError("phoneNumber")}
      <input type="submit" value="Add" />
      {submitting ? <span className="submittingIndicator" /> : null}
    </form>
  );
});
CustomerForm.defaultProps = {
  onSave: () => {},
};
