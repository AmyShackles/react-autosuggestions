import { AutoSuggestContainer } from "../src/components/AutoSuggestContainer.js";
import { render, screen, fireEvent } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import React from "react";

const ref = React.createRef();

test("AutoSuggestContainer should have a combobox role", () => {
  render(<AutoSuggestContainer ref={ref} />);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
  screen.debug();
});
test("AutoSuggestContainer should not have a listbox role without user input", () => {
  render(
    <AutoSuggestContainer
      ref={ref}
      name="Make"
      url="https://ntsb-server.herokuapp.com/api/accidents/makeList"
    />
  );
  expect(screen.queryByRole("listbox")).toBeNull();
});
test("AutoSuggestContainer should have a listbox if searchtext is provided and searching is true", () => {
  render(
    <AutoSuggestContainer
      ref={ref}
      name="Make"
      options={["Bentley", "Hyundai", "Honda", "Ford", "Toyota"]}
      searchText="H"
      searching={true}
    />
  );
  expect(screen.queryByRole("listbox")).toBeInTheDocument();
});
test("AutoSuggestContainer should have a textbox", () => {
  render(<AutoSuggestContainer name="Make" ref={ref} />);
  expect(screen.queryByRole("textbox", { name: "Make" })).toBeInTheDocument();
});
