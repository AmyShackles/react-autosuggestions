import { AutoSuggestOptions } from "../src/components/AutoSuggestOptions";
import { defaultOptions } from "../src/utils/defaultOptions";
import { render, screen } from "./test-utils.js";
import React from "react";

const Wrapper = ({
    id = "autoSuggestOptions",
    onClick = () => {},
    options = [],
    styles = defaultOptions,
    name = "Search",
    selected = ""
}) => {
    const ref = React.createRef();
    return (
        <AutoSuggestOptions
            ref={ref}
            onClick={onClick}
            id={id}
            options={options}
            styles={styles}
            name={name}
            selected={selected}
        />
    );
};

describe("AutoSuggestOptions", () => {
    test("It should be able to handle an array of name/value/abbr", () => {
        const options = [
            { name: "AL", value: "AL", abbr: "Alabama" },
            { name: "AK", value: "AK", abbr: "Alaska" },
            { name: "AZ", value: "AZ", abbr: "Arizona" },
            { name: "AR", value: "AR", abbr: "Arkansas" },
            { name: "CA", value: "CA", abbr: "California" },
            { name: "CO", value: "CO", abbr: "Colorado" },
            { name: "CT", value: "CT", abbr: "Connecticut" },
            { name: "DE", value: "DE", abbr: "Delaware" },
            { name: "DC", value: "DC", abbr: "District of Columbia" },
            { name: "FL", value: "FL", abbr: "Florida" },
            { name: "GA", value: "GA", abbr: "Georgia" },
            { name: "HI", value: "HI", abbr: "Hawaii" },
            { name: "ID", value: "ID", abbr: "Idaho" },
            { name: "IL", value: "IL", abbr: "Illinois" },
            { name: "IN", value: "IN", abbr: "Indiana" },
            { name: "IA", value: "IA", abbr: "Iowa" },
            { name: "KS", value: "KS", abbr: "Kansas" },
            { name: "KY", value: "KY", abbr: "Kentucky" },
            { name: "LA", value: "LA", abbr: "Louisiana" },
            { name: "ME", value: "ME", abbr: "Maine" },
            { name: "MD", value: "MD", abbr: "Maryland" },
            { name: "MA", value: "MA", abbr: "Massachusetts" },
            { name: "MI", value: "MI", abbr: "Michigan" },
            { name: "MN", value: "MN", abbr: "Minnesota" },
            { name: "MS", value: "MS", abbr: "Mississippi" },
            { name: "MO", value: "MO", abbr: "Missouri" },
            { name: "MT", value: "MT", abbr: "Montana" },
            { name: "NE", value: "NE", abbr: "Nebraska" },
            { name: "NV", value: "NV", abbr: "Nevada" },
            { name: "NH", value: "NH", abbr: "New Hampshire" },
            { name: "NJ", value: "NJ", abbr: "New Jersey" },
            { name: "NM", value: "NM", abbr: "New Mexico" },
            { name: "NY", value: "NY", abbr: "New York" },
            { name: "NC", value: "NC", abbr: "North Carolina" },
            { name: "ND", value: "ND", abbr: "North Dakota" },
            { name: "OH", value: "OH", abbr: "Ohio" },
            { name: "OK", value: "OK", abbr: "Oklahoma" },
            { name: "OR", value: "OR", abbr: "Oregon" },
            { name: "PA", value: "PA", abbr: "Pennsylvania" },
            { name: "RI", value: "RI", abbr: "Rhode Island" },
            { name: "SC", value: "SC", abbr: "South Carolina" },
            { name: "SD", value: "SD", abbr: "South Dakota" },
            { name: "TN", value: "TN", abbr: "Tennessee" },
            { name: "TX", value: "TX", abbr: "Texas" },
            { name: "UT", value: "UT", abbr: "Utah" },
            { name: "VT", value: "VT", abbr: "Vermont" },
            { name: "VA", value: "VA", abbr: "Virginia" },
            { name: "WA", value: "WA", abbr: "Washington" },
            { name: "WV", value: "WV", abbr: "West Virginia" },
            { name: "WI", value: "WI", abbr: "Wisconsin" },
            { name: "WY", value: "WY", abbr: "Wyoming" }
        ];
        render(<Wrapper options={options} />);
        const renderedOptions = screen.getAllByRole("option");
        renderedOptions.forEach((option, index) => {
            expect(option.getAttribute("textvalue")).toBe(options[index].value);
            expect(option.getAttribute("abbr")).toBe(options[index].abbr);
            expect(option.getAttribute("name")).toBe(options[index].name);
            expect(option).toHaveTextContent(options[index].value);
            expect(option.classList.contains("auto-suggestions"));
        });
    });
    test("It should be able to handle an array of objects with name/value", () => {
        const options = [
            { name: "AL", value: "AL" },
            { name: "AK", value: "AK" },
            { name: "AZ", value: "AZ" },
            { name: "AR", value: "AR" },
            { name: "CA", value: "CA" },
            { name: "CO", value: "CO" },
            { name: "CT", value: "CT" },
            { name: "DE", value: "DE" },
            { name: "DC", value: "DC" },
            { name: "FL", value: "FL" },
            { name: "GA", value: "GA" },
            { name: "HI", value: "HI" },
            { name: "ID", value: "ID" },
            { name: "IL", value: "IL" },
            { name: "IN", value: "IN" },
            { name: "IA", value: "IA" },
            { name: "KS", value: "KS" },
            { name: "KY", value: "KY" },
            { name: "LA", value: "LA" },
            { name: "ME", value: "ME" },
            { name: "MD", value: "MD" },
            { name: "MA", value: "MA" },
            { name: "MI", value: "MI" },
            { name: "MN", value: "MN" },
            { name: "MS", value: "MS" },
            { name: "MO", value: "MO" },
            { name: "MT", value: "MT" },
            { name: "NE", value: "NE" },
            { name: "NV", value: "NV" },
            { name: "NH", value: "NH" },
            { name: "NJ", value: "NJ" },
            { name: "NM", value: "NM" },
            { name: "NY", value: "NY" },
            { name: "NC", value: "NC" },
            { name: "ND", value: "ND" },
            { name: "OH", value: "OH" },
            { name: "OK", value: "OK" },
            { name: "OR", value: "OR" },
            { name: "PA", value: "PA" },
            { name: "RI", value: "RI" },
            { name: "SC", value: "SC" },
            { name: "SD", value: "SD" },
            { name: "TN", value: "TN" },
            { name: "TX", value: "TX" },
            { name: "UT", value: "UT" },
            { name: "VT", value: "VT" },
            { name: "VA", value: "VA" },
            { name: "WA", value: "WA" },
            { name: "WV", value: "WV" },
            { name: "WI", value: "WI" },
            { name: "WY", value: "WY" }
        ];
        render(<Wrapper options={options} />);
        const renderedOptions = screen.getAllByRole("option");
        renderedOptions.forEach((option, index) => {
            expect(option.getAttribute("textvalue")).toBe(options[index].value);
            expect(option).not.toHaveAttribute("abbr");
            expect(option.getAttribute("name")).toBe(options[index].name);
            expect(option).toHaveTextContent(options[index].value);
            expect(option.classList.contains("auto-suggestions"));
        });
    });
    test("It should be able to handle an array of strings", () => {
        const options = [
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "DC",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY"
        ];
        render(<Wrapper options={options} />);
        const renderedOptions = screen.getAllByRole("option");
        renderedOptions.forEach((option, index) => {
            expect(option.getAttribute("textvalue")).toBe(options[index]);
            expect(option).not.toHaveAttribute("abbr");
            expect(option).not.toHaveAttribute("name");
            expect(option).toHaveTextContent(options[index]);
            expect(option.classList.contains("auto-suggestions"));
        });
    });
});
