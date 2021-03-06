import { default as React } from "react";
import { Link } from "react-router-dom";
import "whatwg-fetch";
import { RouterButton } from "../src/CustomerSearch/RouterButton";
import { createShallowRenderer } from "./shallowHelpers";

describe("RouterButton", () => {
  const pathname = "/path";
  const queryParams = { a: "123", b: "234" };
  let render, elementMatching, root;
  beforeEach(() => {
    ({ render, elementMatching, root } = createShallowRenderer());
  });
  it("renders a Link", () => {
    render(<RouterButton pathname={pathname} queryParams={queryParams} />);
    expect(root().type).toEqual(Link);
    expect(root().props.className).toContain("button");
    expect(root().props.to).toEqual({
      pathname: "/path",
      search: "?a=123&b=234",
    });
  });
});
