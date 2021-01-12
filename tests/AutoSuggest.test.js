import { AutoSuggest } from "../src/components/AutoSuggest.js";
import { render, screen, fireEvent, cleanup } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import React from "react";

afterEach(cleanup);

const Form = ({ name = "", url = "", options = [], type = "", styles, handleChange, disabled }) => {
    const [make, setMake] = React.useState();
    const [formData, setFormData] = React.useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData(`Make: ${make}`);
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <AutoSuggest
                    name={name}
                    handleChange={handleChange ? handleChange : setMake}
                    type={type}
                    url={url}
                    options={options}
                    styles={styles}
                    disabled={disabled ? true : false}
                />
                <button>Submit</button>
            </form>
            <p data-testid="Value">{make}</p>
            {formData && <p data-testid="AfterFormSubmit">{formData}</p>}
        </>
    );
};
describe("AutoSuggest rendering", () => {
    describe("Defaults", () => {
        test("It should default the name of the input to be 'Search'", () => {
            render(<AutoSuggest />);
            expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
        });
    });
    test("AutoSuggest should render AutoSuggestServer if a url is provided", () => {
        const { getByDataType } = render(
            <Form name="Make" url="https://ntsb-server.herokuapp.com/api/accidents/makeList" />
        );
        expect(getByDataType("Server")).toBeInTheDocument();
    });
    test("AutoSuggest should render AutoSuggestClient if no url is passed", () => {
        const { getByDataType } = render(<Form name="Make" options={["Bentley", "BMW", "Buick", "Honda", "Accord"]} />);
        expect(getByDataType("Client")).toBeInTheDocument();
    });
    test("AutoSuggest should ignore arrow down input when the listbox is closed", () => {
      render(
        <Form name="Make" options={["Bentley", "BMW", "Buick", "Honda", "Accord"]} />
      );
      const input = screen.getByRole("textbox", { name: "Make"});
      userEvent.type(input, "{arrowdown}");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    test("AutoSuggest should ignore arrow up input when the listbox is closed", () => {
      render(
        <Form name="Make" options={["Bentley", "BMW", "Buick", "Honda", "Accord"]} />
      );
      const input = screen.getByRole("textbox", { name: "Make"});
      userEvent.type(input, "{arrowup}");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    })
});

test("AutoSuggest should accept input", () => {
    render(<Form name="Make" options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]} />);
    let input = screen.queryByRole("textbox");
    fireEvent.change(input, { target: { value: "B" } });
    expect(input.value).toBe("B");
});
describe("AutoSuggest should display matching options when text is entered", () => {
    test("AutoSuggest should handle an options array of strings", () => {
        render(<Form name="Make" options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]} />);
        let input = screen.queryByRole("textbox");
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.queryByRole("listbox")).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Bentley" })).toHaveTextContent("Bentley");
        expect(screen.getByRole("option", { name: "Bentley" })).not.toHaveAttribute("abbr")
        expect(screen.getByRole("option", { name: "Bentley" })).not.toHaveAttribute("name")
        expect(screen.getByRole("option", { name: "BMW" })).toHaveTextContent("BMW");
        expect(screen.getByRole("option", { name: "BMW" })).not.toHaveAttribute("abbr");
        expect(screen.getByRole("option", { name: "BMW" })).not.toHaveAttribute("name");
        expect(screen.getByRole("option", { name: "Buick" })).toHaveTextContent("Buick")
        expect(screen.getByRole("option", { name: "Buick" })).not.toHaveAttribute("abbr");
        expect(screen.getByRole("option", { name: "Buick" })).not.toHaveAttribute("name");
    });
    test("AutoSuggest should handle an options array of objects with name and value", () => {
        render(
            <Form
                name="Make"
                options={[
                    { name: "Acura", value: "Acura" },
                    { name: "BMW", value: "BMW" },
                    { name: "Audi", value: "Audi" },
                    { name: "Bentley", value: "Bentley" },
                    { name: "Buick", value: "Buick" },
                    { name: "Cadillac", value: "Cadillac" },
                    { name: "Chevrolet", value: "Chevrolet" }
                ]}
            />
        );
        let input = screen.queryByRole("textbox");
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.queryByRole("listbox")).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Bentley" })).toHaveTextContent("Bentley");
        expect(screen.getByRole("option", { name: "Bentley" })).not.toHaveAttribute("abbr")
        expect(screen.getByRole("option", { name: "Bentley" })).toHaveAttribute("name", "Bentley")
        expect(screen.getByRole("option", { name: "BMW" })).toHaveTextContent("BMW");
        expect(screen.getByRole("option", { name: "BMW" })).not.toHaveAttribute("abbr");
        expect(screen.getByRole("option", { name: "BMW" })).toHaveAttribute("name", "BMW");
        expect(screen.getByRole("option", { name: "Buick" })).toHaveTextContent("Buick")
        expect(screen.getByRole("option", { name: "Buick" })).not.toHaveAttribute("abbr");
        expect(screen.getByRole("option", { name: "Buick" })).toHaveAttribute("name", "Buick");
    });
    test("Autosuggest should handle an options array of objects with abbr, name, and value", () => {
        render(
            <Form
                name="Make"
                options={[
                    { name: "Acura", value: "Acura", abbr: "Acura" },
                    { name: "BMW", value: "BMW", abbr: "BMW" },
                    { name: "Audi", value: "Audi", abbr: "Audi" },
                    { name: "Bentley", value: "Bentley", abbr: "Bentley" },
                    { name: "Buick", value: "Buick", abbr: "Buick" },
                    { name: "Cadillac", value: "Cadillac", abbr: "Cadillac" },
                    { name: "Chevrolet", value: "Chevrolet", abbr: "Chevrolet" }
                ]}
            />
        );
        let input = screen.queryByRole("textbox");
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.queryByRole("listbox")).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Bentley" })).toHaveTextContent("Bentley");
        expect(screen.getByRole("option", { name: "Bentley"})).toHaveAttribute("abbr", "Bentley");
        expect(screen.getByRole("option", { name: "Bentley"})).toHaveAttribute("name", "Bentley");
        expect(screen.getByRole("option", { name: "BMW" })).toHaveTextContent("BMW");
        expect(screen.getByRole("option", { name: "BMW" })).toHaveAttribute("abbr", "BMW");
        expect(screen.getByRole("option", { name: "BMW" })).toHaveAttribute("name", "BMW");
        expect(screen.getByRole("option", { name: "Buick" })).toHaveTextContent("Buick");
        expect(screen.getByRole("option", { name: "Buick" })).toHaveAttribute("abbr", "Buick");
        expect(screen.getByRole("option", { name: "Buick" })).toHaveAttribute("name", "Buick");

    });
});

/* It was easier to do some of these tests in a higher order element 
    due to the ref passing that takes place
*/
test("AutoSuggestContainer should set input focus styling", () => {
    render(
        <Form
            name="Make"
            options={["Buick", "Acura", "Honda"]}
            styles={{ searchField: { focus: { color: "#f29" } } }}
        />
    );
    const textbox = screen.getByRole("textbox", { name: "Make" });
    expect(textbox.style.color).toBe("rgb(0, 0, 0)");
    textbox.focus();
    expect(document.activeElement).toBe(textbox);
    expect(textbox.style.color).toBe("rgb(255, 34, 153)");
});
test("AutoSuggestContainer should set input blur styling", () => {
    render(
        <Form
            name="Make"
            options={["Buick", "Acura", "Honda"]}
            styles={{ searchField: { focus: { color: "#f29" } } }}
        />
    );
    const textbox = screen.getByRole("textbox", { name: "Make" });
    expect(textbox.style.color).toBe("rgb(0, 0, 0)");
    textbox.focus();
    expect(document.activeElement).toBe(textbox);
    expect(textbox.style.color).toBe("rgb(255, 34, 153)");
    textbox.blur();
    expect(document.activeElemnt).not.toBe(textbox);
    expect(textbox.style.color).toBe("rgb(0, 0, 0)");
});
describe("Enter key", () => {
    describe("If an option has been selected", () => {
        test("It should change the value of the input to the currently selected option", () => {
            render(
                <Form
                    name="Make"
                    options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                    styles={{ searchField: { focus: { color: "#f29" } } }}
                />
            );
            let input = screen.queryByRole("textbox");
            fireEvent.change(input, { target: { value: "B" } });
            expect(screen.getByRole("option", { name: "Bentley" }));
            expect(screen.getByRole("option", { name: "BMW" }));
            expect(screen.getByRole("option", { name: "Buick" }));
            expect(screen.queryByRole("option", { name: "Acura" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Audi" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Cadillac" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Chevrolet" })).toBeNull();
            userEvent.type(input, "{arrowup}");
            userEvent.type(input, "{arrowup}");
            userEvent.type(input, "{arrowup}");
            expect(input).toHaveFocus();
            const option = screen.getByRole("option", { name: "Bentley" });
            expect(option).toHaveAttribute("aria-selected", "true");
            userEvent.type(input, "{enter}");
            expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("Bentley");
            expect(screen.getByTestId("Value")).toHaveTextContent("Bentley");
        });
        test("It should call handleChange", () => {
          const mock = jest.fn(e => console.log(e));
          render(
              <Form
                  name="Make"
                  options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                  styles={{ searchField: { focus: { color: "#f29" } } }}
                  handleChange={mock}
              />
          );
          let input = screen.queryByRole("textbox");
          fireEvent.change(input, { target: { value: "B" } });
          expect(screen.getByRole("option", { name: "Bentley" }));
          expect(screen.getByRole("option", { name: "BMW" }));
          expect(screen.getByRole("option", { name: "Buick" }));
          expect(screen.queryByRole("option", { name: "Acura" })).toBeNull();
          expect(screen.queryByRole("option", { name: "Audi" })).toBeNull();
          expect(screen.queryByRole("option", { name: "Cadillac" })).toBeNull();
          expect(screen.queryByRole("option", { name: "Chevrolet" })).toBeNull();
          userEvent.type(input, "{arrowup}");
          userEvent.type(input, "{arrowup}");
          userEvent.type(input, "{arrowup}");
          expect(input).toHaveFocus();
          const option = screen.getByRole("option", { name: "Bentley" });
          expect(option).toHaveAttribute("aria-selected", "true");
          userEvent.type(input, "{enter}");
          expect(mock).toHaveBeenCalledWith("B");
          expect(mock).toHaveBeenCalledWith("Bentley");
          expect(mock).toHaveBeenCalledTimes(2);
      });
    });
    describe("If an option has not been selected", () => {
        test("It should keep the text previously entered into the input field", () => {
            render(
                <Form
                    name="Make"
                    options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                    styles={{ searchField: { focus: { color: "#f29" } } }}
                />
            );
            let input = screen.queryByRole("textbox");
            fireEvent.change(input, { target: { value: "B" } });
            expect(screen.getByRole("option", { name: "Bentley" }));
            expect(screen.getByRole("option", { name: "BMW" }));
            expect(screen.getByRole("option", { name: "Buick" }));
            expect(screen.queryByRole("option", { name: "Acura" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Audi" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Cadillac" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Chevrolet" })).toBeNull();
            expect(input).toHaveFocus();
            userEvent.type(input, "{enter}");
            expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
            expect(screen.getByTestId("Value")).toHaveTextContent("B");
        });
    });
});
describe("Down arrow", () => {
    test("Pressing the down arrow should set input focus", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        userEvent.type(input, "{arrowdown}");
        expect(input).toHaveFocus();
    });
    test("Pressing down arrow should set aria-activedescendant to the selected option", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });

        userEvent.type(input, "{arrowdown}");
        userEvent.type(input, "{arrowdown}");
        userEvent.type(input, "{arrowdown}");
        expect(input).toHaveAttribute("aria-activedescendant", "Make-suggestion2");
    });
    test("Pressing down arrow should set aria-selected true for the selected option", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        userEvent.type(input, "{arrowdown}");
        userEvent.type(input, "{arrowdown}");
        userEvent.type(input, "{arrowdown}");
        expect(input).toHaveFocus();
        const option = screen.getByRole("option", { name: "Buick" });
        expect(option).toHaveAttribute("aria-selected", "true");
    });
});
describe("Up arrow", () => {
    test("Pressing the up arrow should set input focus", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        userEvent.type(input, "{arrowup}");
        expect(input).toHaveFocus();
    });
    test("Pressing up arrow should set aria-activedescendant to the selected option", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        userEvent.type(input, "{arrowup}");
        userEvent.type(input, "{arrowup}");
        userEvent.type(input, "{arrowup}");
        expect(input).toHaveAttribute("aria-activedescendant", "Make-suggestion0");
    });
    test("Pressing down arrow should set aria-selected true for the selected option", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        userEvent.type(input, "{arrowup}");
        userEvent.type(input, "{arrowup}");
        userEvent.type(input, "{arrowup}");
        expect(input).toHaveFocus();
        const option = screen.getByRole("option", { name: "Bentley" });
        expect(option).toHaveAttribute("aria-selected", "true");
    });
});

describe("Escape key", () => {
    test("It should collapse the listbox", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        userEvent.type(input, "{esc}");
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    test("It should clear the textbox", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
        userEvent.type(input, "{esc}");
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("");
        expect(screen.getByTestId("Value")).toHaveTextContent("");
    });
    test("It should focus on the input field", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
        userEvent.type(input, "{arrowdown}");
        const option = screen.getByRole("option", { name: "Bentley" });
        expect(input).toHaveAttribute("aria-activedescendant", option.id);
        userEvent.type(input, "{esc}");
        expect(input).toHaveFocus();
    });
    test("It should clear the aria-activedescendant", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
        userEvent.type(input, "{arrowdown}");
        const option = screen.getByRole("option", { name: "Bentley" });
        expect(input).toHaveAttribute("aria-activedescendant", option.id);
        userEvent.type(input, "{esc}");
        expect(input).not.toHaveAttribute("aria-activedescendant");
    });
});
describe("Tab key", () => {
    describe("If an option has been selected", () => {
        test("It should change the value of the input to the currently selected option", () => {
            render(
                <Form
                    name="Make"
                    options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                    styles={{ searchField: { focus: { color: "#f29" } } }}
                />
            );
            let input = screen.queryByRole("textbox");
            fireEvent.change(input, { target: { value: "B" } });
            expect(screen.getByRole("option", { name: "Bentley" }));
            expect(screen.getByRole("option", { name: "BMW" }));
            expect(screen.getByRole("option", { name: "Buick" }));
            expect(screen.queryByRole("option", { name: "Acura" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Audi" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Cadillac" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Chevrolet" })).toBeNull();
            userEvent.type(input, "{arrowup}");
            userEvent.type(input, "{arrowup}");
            userEvent.type(input, "{arrowup}");
            expect(input).toHaveFocus();
            const option = screen.getByRole("option", { name: "Bentley" });
            expect(option).toHaveAttribute("aria-selected", "true");
            userEvent.tab();
            expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("Bentley");
            expect(screen.getByTestId("Value")).toHaveTextContent("Bentley");
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
        });
    });
    describe("If an option has not been selected", () => {
        test("It should keep the value previously entered into the input field", () => {
            render(
                <Form
                    name="Make"
                    options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                    styles={{ searchField: { focus: { color: "#f29" } } }}
                />
            );
            let input = screen.queryByRole("textbox");
            fireEvent.change(input, { target: { value: "B" } });
            expect(screen.getByRole("option", { name: "Bentley" }));
            expect(screen.getByRole("option", { name: "BMW" }));
            expect(screen.getByRole("option", { name: "Buick" }));
            expect(screen.queryByRole("option", { name: "Acura" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Audi" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Cadillac" })).toBeNull();
            expect(screen.queryByRole("option", { name: "Chevrolet" })).toBeNull();
            expect(input).toHaveFocus();
            userEvent.tab();
            expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
            expect(screen.getByTestId("Value")).toHaveTextContent("B");
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
        });
    });
});
describe("Mouse selection", () => {
    test("It should update the input field to the selected option", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
        const option = screen.getByRole("option", { name: "Bentley" });
        userEvent.click(option);
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("Bentley");
        expect(screen.getByTestId("Value")).toHaveTextContent("Bentley");
        expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });
    test("It should remove any aria-activedescendant previously set", () => {
        render(
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
        userEvent.type(input, "{arrowdown}");
        const option = screen.getByRole("option", { name: "Bentley" });
        expect(input).toHaveAttribute("aria-activedescendant", option.id);
        const newOption = screen.getByRole("option", { name: "BMW" });
        userEvent.click(newOption);
        expect(input).not.toHaveAttribute("aria-activedescendant");
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
});
describe("Clicking outside of the AutoSuggest component", () => {
    test("It should close the options menu", () => {
        render(
            <>
                <Form
                    name="Make"
                    options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                    styles={{ searchField: { focus: { color: "#f29" } } }}
                />
                <p>Different input"</p>
            </>
        );
        const input = screen.getByRole("textbox", { name: "Make" });
        fireEvent.change(input, { target: { value: "B" } });
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
        userEvent.type(input, "{arrowdown}");
        const option = screen.getByRole("option", { name: "Bentley" });
        expect(input).toHaveAttribute("aria-activedescendant", option.id);
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        const outsideInputField = screen.getByText(/Different input/);
        fireEvent.click(outsideInputField);
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
        expect(screen.getByTestId("Value")).toHaveTextContent("B");
    });
});
test("Selection workflow", () => {
    render(
        <>
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
            />
            <p>Different input"</p>
        </>
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    fireEvent.change(input, { target: { value: "B" } });
    expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("B");
    userEvent.type(input, "{arrowdown}");
    const option = screen.getByRole("option", { name: "Bentley" });
    expect(input).toHaveAttribute("aria-activedescendant", option.id);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    userEvent.tab();
    expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("Bentley");
    expect(screen.getByTestId("Value")).toHaveTextContent("Bentley");
    const button = screen.getByRole("button");
    expect(screen.queryByTestId("AfterFormSubmit")).not.toBeInTheDocument();
    userEvent.click(button);
    expect(screen.queryByTestId("AfterFormSubmit")).toBeInTheDocument();
    expect(screen.queryByTestId("AfterFormSubmit")).toHaveTextContent("Make: Bentley");
});
test("Input should be disabled if disabled evaluates to true", () => {
    render(
        <>
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
                disabled
            />
            <p>Different input"</p>
        </>
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    expect(input).toHaveAttribute("disabled");
});
test("Input should not be disabled if disabled does not evaluate to true", () => {
    render(
        <>
            <Form
                name="Make"
                options={["Acura", "BMW", "Audi", "Bentley", "Buick", "Cadillac", "Chevrolet"]}
                styles={{ searchField: { focus: { color: "#f29" } } }}
                disabled={false}
            />
            <p>Different input"</p>
        </>
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    expect(input).not.toHaveAttribute("disabled");
});
