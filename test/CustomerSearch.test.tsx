import { default as React } from "react";
import "whatwg-fetch";
import { CustomerForm } from "../src/CustomerForm";
import { CustomerSearch } from "../src/CustomerSearch/CustomerSearch";
import { createContainer, withEvent } from "./domManipulators";
import { createShallowRenderer, type } from "./shallowHelpers";
import { fetchResponseOk } from "./spyHelpers";
describe("Customer search", () => {
  let renderAndWait, element, elements, clickAndWait, changeAndWait, render, elementMatching, elementsMatching;
  let fetchSpy;
  const oneCustomer = [{ id: 1, firstName: "A", lastName: "B", phoneNumber: "1" }];
  const twoCustomers = [
    { id: 1, firstName: "A", lastName: "B", phoneNumber: "1" },
    { id: 2, firstName: "C", lastName: "D", phoneNumber: "2" },
  ];
  const tenCustomers = Array.from("0123456789", (id) => ({ id }));
  const anotherTenCustomers = Array.from("ABCDEFGHIJ", (id) => ({ id }));
  const saveCustomer = (customer) => elementMatching(type(CustomerForm)).props.onSave(customer);
  const renderSearchActionsForCustomer = (customer) => {
    const customerSearch = elementMatching(type(CustomerSearch));
    const searchActionsComponent = customerSearch.props.renderCustomerActions;

    return searchActionsComponent(customer);
  };
  beforeEach(() => {
    ({ renderAndWait, element, elements, clickAndWait, changeAndWait } = createContainer());

    ({ render, elementMatching, elementsMatching } = createShallowRenderer());

    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
    jest.spyOn(window, "fetch").mockReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    window.fetch.mockRestore();
  });

  it("renders a table with four headings", async () => {
    await renderAndWait(<CustomerSearch />);
    const headings = elements("table th");
    expect(headings.map((h) => h.textContent)).toEqual(["First name", "Last name", "Phone number", "Actions"]);
  });
  it("fetches all customer data when component mounts", async () => {
    await renderAndWait(<CustomerSearch />);
    expect(window.fetch).toHaveBeenCalledWith("/customers", {
      method: "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("renders all customer data in a table row", async () => {
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderAndWait(<CustomerSearch />);
    const rows = elements("table tbody td");
    expect(rows[0].textContent).toEqual("A");
    expect(rows[1].textContent).toEqual("B");
    expect(rows[2].textContent).toEqual("1");
  });

  it("renders multiple customer rows", async () => {
    window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
    await renderAndWait(<CustomerSearch />);
    const rows = elements("table tbody tr");
    expect(rows[1].childNodes[0].textContent).toEqual("C");
  });
  describe("Next button", () => {
    it("has a next button", async () => {
      await renderAndWait(<CustomerSearch />);
      expect(element("button#next-page")).not.toBeNull();
    });

    it("requests next page of data when next button is clicked", async () => {
      window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
      await renderAndWait(<CustomerSearch />);
      await clickAndWait(element("button#next-page"));

      expect(window.fetch).toHaveBeenLastCalledWith("/customers?after=9", expect.anything());
    });
    it("displays next page of data when next button is clicked", async () => {
      const nextCustomer = [{ id: "next", firstName: "Next" }];
      window.fetch.mockReturnValueOnce(fetchResponseOk(tenCustomers)).mockReturnValue(fetchResponseOk(nextCustomer));
      await renderAndWait(<CustomerSearch />);
      await clickAndWait(element("button#next-page"));

      expect(elements("tbody tr").length).toEqual(1);

      expect(elements("td")[0].textContent).toEqual("Next");
    });
  });
  describe("previous button", () => {
    it("has a previous button", async () => {
      await renderAndWait(<CustomerSearch />);
      expect(element("button#previous-page")).not.toBeNull();
    });

    it("moves back to first page when previous button is clicked", async () => {
      window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
      await renderAndWait(<CustomerSearch />);
      await clickAndWait(element("button#next-page"));
      await clickAndWait(element("button#previous-page"));
      expect(window.fetch).toHaveBeenLastCalledWith("/customers", expect.anything());
    });

    it("moves back one page when clicking previous after multiple clicks of the next button", async () => {
      window.fetch
        .mockReturnValueOnce(fetchResponseOk(tenCustomers))
        .mockReturnValue(fetchResponseOk(anotherTenCustomers));
      await renderAndWait(<CustomerSearch />);
      await clickAndWait(element("button#next-page"));
      await clickAndWait(element("button#next-page"));
      await clickAndWait(element("button#previous-page"));
      expect(window.fetch).toHaveBeenLastCalledWith("/customers?after=9", expect.anything());
    });
    it("moves back multiple pages", async () => {
      window.fetch
        .mockReturnValueOnce(fetchResponseOk(tenCustomers))
        .mockReturnValue(fetchResponseOk(anotherTenCustomers));
      await renderAndWait(<CustomerSearch />);
      await clickAndWait(element("button#next-page"));
      await clickAndWait(element("button#next-page"));
      await clickAndWait(element("button#previous-page"));
      await clickAndWait(element("button#previous-page"));
      expect(window.fetch).toHaveBeenLastCalledWith("/customers", expect.anything());
    });
  });
  describe("Search", () => {
    it("has a search input field with a placeholder", async () => {
      await renderAndWait(<CustomerSearch />);
      expect(element("input")).not.toBeNull();
      expect(element("input").getAttribute("placeholder")).toEqual("Enter filter text");
    });
    it("performs search when search term is changed", async () => {
      await renderAndWait(<CustomerSearch />);
      await changeAndWait(element("input"), withEvent("input", "name"));
      //Changed
      expect(window.fetch).toHaveBeenLastCalledWith("/customers", expect.anything());
    });
    it("includes search term when moving to next page", async () => {
      window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));

      await renderAndWait(<CustomerSearch />);
      await changeAndWait(element("input"), withEvent("input", "name"));
      await clickAndWait(element("button#next-page"));
      expect(window.fetch).toHaveBeenLastCalledWith("/customers?after=9&searchTerm=name", expect.anything());
    });
  });
  it("displays provided action buttons for each customer", async () => {
    const actionSpy = jest.fn();
    actionSpy.mockReturnValue("actions");
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderAndWait(<CustomerSearch renderCustomerActions={actionSpy} />);
    const rows = elements("table tbody td");
    expect(rows[rows.length - 1].textContent).toEqual("actions");
  });
  it("passes customer to the renderCustomerActions prop", async () => {
    const actionSpy = jest.fn();
    actionSpy.mockReturnValue("actions");
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderAndWait(<CustomerSearch renderCustomerActions={actionSpy} />);
    expect(actionSpy).toHaveBeenCalledWith(oneCustomer[0]);
  });
});
