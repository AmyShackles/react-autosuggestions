import { AutoSuggestContainer } from "../src/components/AutoSuggestContainer.js";
import { render, screen } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import React from "react";

const AutoSuggest = ({
    name = "search",
    styles = {},
    options = [],
    searchText,
    isOpen = false,
    setIsOpen = () => {},
    url = undefined,
    loading = false
}) => {
    const ref = React.createRef();
    const [activeDescendant, setActiveDescendant] = React.useState();
    return (
        <AutoSuggestContainer
            ref={ref}
            name={name}
            styles={styles}
            options={options}
            searchText={searchText}
            setSearchText={() => {}}
            clearText={() => {}}
            setOpenListbox={setIsOpen}
            openListbox={isOpen}
            dataType="Client"
            url={url}
            activeDescendant={activeDescendant}
            setActiveDescendant={setActiveDescendant}
            loading={loading}
        />
    );
};

test("AutoSuggestContainer should have a combobox role", () => {
  render(<AutoSuggest />);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});
describe("Listbox", () => {
  test("AutoSuggestContainer should not have a listbox role without user input", () => {
  render(
    <AutoSuggest
      name="Make"
      url="https://ntsb-server.herokuapp.com/api/accidents/makeList"
    />
  );
  expect(screen.queryByRole("listbox")).toBeNull();
});
test("AutoSuggestContainer should have a listbox if searchtext is provided and openListbox is true", () => {
    render(
        <AutoSuggest
            name="Make"
            options={["Bentley", "Hyundai", "Honda", "Ford", "Toyota"]}
            searchText="H"
            isOpen={true}
        />
    );
    expect(screen.queryByRole("listbox")).toBeInTheDocument();
});
})

test("AutoSuggestContainer should have a textbox", () => {
  render(<AutoSuggest name="Make" />);
  expect(screen.queryByRole("textbox", { name: "Make" })).toBeInTheDocument();
});
test("AutoSuggestContainer should add a loading class to the input field if loading is true", () => {
  render(
    <AutoSuggest
    name="Make"
    url="https://ntsb-server.herokuapp.com/api/accidents/makeList"
    loading={true}
  />
  );
  expect(screen.getByRole("textbox", { name: "Make"})).toHaveClass("loading")
});
