import { AutoSuggest } from "../src/components/AutoSuggest.js";
import { render, screen, fireEvent, queries } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import React from "react";

const Form = ({ name = "", url = "", options = [], type = "" }) => {
  const [formData, setFormData] = React.useState(null);
  const make = React.createRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (make.current) {
      setFormData(make.current.value);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <AutoSuggest
          name={name}
          type={type}
          url={url}
          options={options}
          ref={make}
        />
      </form>
      <p>{formData && formData}</p>
    </>
  );
};
test("AutoSuggest should render AutoSuggestServer if a url is provided", () => {
  const { getByDataType } = render(
    <Form
      name="Make"
      url="https://ntsb-server.herokuapp.com/api/accidents/makeList"
    />
  );
  expect(getByDataType("Server")).toBeInTheDocument();
});
test("AutoSuggest should render AutoSuggestClient if no url is passed", () => {
  const { getByDataType } = render(
    <Form
      name="Make"
      options={["Bentley", "BMW", "Buick", "Honda", "Accord"]}
    />
  );
  expect(getByDataType("Client")).toBeInTheDocument();
});
test("AutoSuggest should have a combobox role", () => {
  render(
    <Form
      name="Make"
      url="https://ntsb-server.herokuapp.com/api/accidents/makeList"
    />
  );
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});
test("AutoSuggest should not have a listbox role without user input", () => {
  render(
    <Form
      name="Make"
      url="https://ntsb-server.herokuapp.com/api/accidents/makeList"
    />
  );
  expect(screen.queryByRole("listbox")).toBeNull();
});
test("AutoSuggest should have a textbox", () => {
  render(
    <Form
      name="Make"
      url="https://ntsb-server.herokuapp.com/api/accidents/makeList"
    />
  );
  expect(screen.queryByRole("textbox", { name: "Make" })).toBeInTheDocument();
});
test("AutoSuggest should accept input", () => {
  render(
    <Form
      name="Make"
      options={[
        "Acura",
        "BMW",
        "Audi",
        "Bentley",
        "Buick",
        "Cadillac",
        "Chevrolet",
      ]}
    />
  );
  let input = screen.queryByRole("textbox");
  fireEvent.change(input, { target: { value: "B" } });
  expect(input.value).toBe("B");
});
test("AutoSuggest should display matching options when text is entered", () => {
  render(
    <Form
      name="Make"
      options={[
        "Acura",
        "BMW",
        "Audi",
        "Bentley",
        "Buick",
        "Cadillac",
        "Chevrolet",
      ]}
    />
  );
  let input = screen.queryByRole("textbox");
  fireEvent.change(input, { target: { value: "B" } });
  expect(screen.queryByRole("listbox")).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Bentley" }));
  expect(screen.getByRole("option", { name: "BMW" }));
  expect(screen.getByRole("option", { name: "Buick" }));
});
