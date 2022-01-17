import { default as React, useCallback, useEffect, useState } from "react";
const searchParams = (after, searchTerm) => {
  let pairs = [];
  if (after) {
    pairs.push(`after=${after}`);
  }
  if (searchTerm) {
    pairs.push(`searchTerm=${searchTerm}`);
  }
  if (pairs.length > 0) {
    return `?${pairs.join("&")}`;
  }
  return "";
};
export const CustomerSearch = ({ renderCustomerActions }) => {
  const [customers, setCustomers] = useState([]);
  const [queryString, setQueryString] = useState("");
  const [lastRowsIds, setLastRowsIds] = useState([]);
  const [previousQueryString, setPreviousQueryString] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let after;
      if (lastRowsIds.length > 0) after = lastRowsIds[lastRowsIds.length - 1];
      const queryString = searchParams(after, searchTerm);
      const result = await window.fetch(`/customers${queryString}`, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      });
      setCustomers(await result.json());
    };
    fetchData();
  }, [lastRowsIds, searchTerm]);

  const handleNext = useCallback(() => {
    const after = customers[customers.length - 1].id;
    setLastRowsIds([...lastRowsIds, after]);
  }, [customers, lastRowsIds]);

  const handlePrevious = useCallback(() => {
    setLastRowsIds(lastRowsIds.slice(0, -1));
  }, [lastRowsIds]);

  const CustomerRow = ({ customer, renderCustomerActions }) => (
    <tr>
      <td>{customer.firstName}</td>
      <td>{customer.lastName}</td>
      <td>{customer.phoneNumber}</td>
      <td>{renderCustomerActions(customer)}</td>
    </tr>
  );
  const SearchButtons = ({ handleNext, handlePrevious }) => (
    <div className="button-bar">
      <button role="button" id="next-page" onClick={handleNext}>
        Next
      </button>
      <button role="button" id="previous-page" onClick={handlePrevious}>
        Previous
      </button>
    </div>
  );

  const handleSearchTextChanged = ({ target: { value } }) => setSearchTerm(value);

  return (
    <React.Fragment>
      <input value={searchTerm} onChange={handleSearchTextChanged} placeholder="Enter filter text" />
      <SearchButtons handleNext={handleNext} handlePrevious={handlePrevious} />

      <table>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers[0]
            ? customers.map((customer) => (
                <CustomerRow customer={customer} key={customer.id} renderCustomerActions={renderCustomerActions} />
              ))
            : null}
        </tbody>
      </table>
    </React.Fragment>
  );
};
CustomerSearch.defaultProps = {
  renderCustomerActions: () => {},
  renderSearchCustomerActions: () => {},
};
