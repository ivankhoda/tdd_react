import { default as React, useState } from "react";
export const CustomerForm = ({ firstName, lastName, phoneNumber, onSave }) => {
  const [customer, setCustomer] = useState({ firstName, lastName, phoneNumber });
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const handleChange = ({ target }) => {
    setCustomer((customer) => ({
      ...customer,
      [target.name]: target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await window.fetch("/customers", {
      method: "POST",
      body: JSON.stringify(customer),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    });
    if (result.ok) {
      const customerWithId = await result.json();
      onSave(customerWithId);
    } else {
      setError(true);
    }
  };
  const required = (value) => (!value || value.trim() === "" ? "First name is required" : undefined);
  const handleBlur = ({ target }) => {
    const validators = {
      firstName: required,
    };
    const result = validators[target.name](target.value);
    setValidationErrors({
      ...validationErrors,
      [target.name]: result,
    });
  };
  const hasFirstNameError = (fieldName) => validationErrors[fieldName] !== undefined;
  const renderFirstNameError = (fieldName) => {
    if (hasFirstNameError(fieldName)) {
      return <span className="error">{validationErrors[fieldName]} </span>;
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
      {renderFirstNameError()}
      <label htmlFor="lastName">Last name</label>
      <input type="text" name="lastName" id="lastName" value={lastName} onChange={handleChange} />{" "}
      <label htmlFor="phoneNumber">Phone number</label>
      <input type="text" name="phoneNumber" id="phoneNumber" value={phoneNumber} onChange={handleChange} />
      <input type="submit" value="Add" />
    </form>
  );
};
CustomerForm.defaultProps = {
  onSave: () => {},
};
