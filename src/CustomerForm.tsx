import React from "react";
export const CustomerForm = ({ firstName }) => (
  <form id="customer">
    <input type="text" name="firstName" readOnly value={firstName} />{" "}
  </form>
);
