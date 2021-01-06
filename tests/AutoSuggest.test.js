import { AutoSuggest } from "../src/components/AutoSuggest.js";
import { render, screen, fireEvent , cleanup } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import React from "react";

afterEach(cleanup);

const Form = ({ name = "", url = "", options = [], type = "", styles }) => {
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
              styles={styles}
            />
          </form>
          <p>{formData && formData}</p>
        </>
    );  
  };  
    describe("AutoSuggest rendering", () => {
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
          options={[
            "Acura",
            "BMW",
            "Audi",
            "Bentley",
            "Buick",
            "Cadillac",
            "Chevrolet",
          ]}
          styles={{ searchField: { focus: { color: "#f29" } } }}
        />
      );
      let input = screen.queryByRole("textbox");
      fireEvent.change(input, { target: { value: "B" } });
      expect(screen.getByRole("option", { name: "Bentley" }));
      expect(screen.getByRole("option", { name: "BMW" }));
      expect(screen.getByRole("option", { name: "Buick" }));
      expect(screen.queryByRole("option", { name: "Acura"})).toBeNull();
      expect(screen.queryByRole("option", { name: "Audi"})).toBeNull();
      expect(screen.queryByRole("option", {name: "Cadillac"})).toBeNull();
      expect(screen.queryByRole("option", {name: "Chevrolet"})).toBeNull();
      userEvent.type(input, "{arrowup}");
      userEvent.type(input, "{arrowup}");
      userEvent.type(input, "{arrowup}");
      expect(input).toHaveFocus();

      const option = screen.getByRole("option", { name: "Bentley"});
      expect(option).toHaveAttribute('aria-selected', "true");
      userEvent.type(input, "{enter}");
      expect(screen.getByRole("textbox", { name: "Make"})).toHaveValue("Bentley");
    });
  });
  describe("If an option has not been selected", () => {
    test("It should keep the text previously entered into the input field", () => {
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
          styles={{ searchField: { focus: { color: "#f29" } } }}
        />
      );
      let input = screen.queryByRole("textbox");
      fireEvent.change(input, { target: { value: "B" } });
      expect(screen.getByRole("option", { name: "Bentley" }));
      expect(screen.getByRole("option", { name: "BMW" }));
      expect(screen.getByRole("option", { name: "Buick" }));
      expect(screen.queryByRole("option", { name: "Acura"})).toBeNull();
      expect(screen.queryByRole("option", { name: "Audi"})).toBeNull();
      expect(screen.queryByRole("option", {name: "Cadillac"})).toBeNull();
      expect(screen.queryByRole("option", {name: "Chevrolet"})).toBeNull();
      expect(input).toHaveFocus();
      userEvent.type(input, "{enter}");
      expect(screen.getByRole("textbox", { name: "Make"})).toHaveValue("B");
    });
  })
});
describe("Down arrow", () => {
  test("Pressing the down arrow should set input focus", () => {
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
        options={[
          "Acura",
          "BMW",
          "Audi",
          "Bentley",
          "Buick",
          "Cadillac",
          "Chevrolet",
        ]}
        styles={{ searchField: { focus: { color: "#f29" } } }}
      />
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    fireEvent.change(input, { target: { value: "B" } }); 

    userEvent.type(input, "{arrowdown}");
    userEvent.type(input, "{arrowdown}");
    userEvent.type(input, "{arrowdown}");
    expect(input).toHaveAttribute('aria-activedescendant', 'Make-suggestion2')
  });
  test("Pressing down arrow should set aria-selected true for the selected option", () => {
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
        styles={{ searchField: { focus: { color: "#f29" } } }}
      />
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    fireEvent.change(input, { target: { value: "B" } }); 
    userEvent.type(input, "{arrowdown}");
    userEvent.type(input, "{arrowdown}");
    userEvent.type(input, "{arrowdown}");
    expect(input).toHaveFocus();
    const option = screen.getByRole("option", { name: "Buick"});
    expect(option).toHaveAttribute('aria-selected', "true")
  })
})
describe("Up arrow", () => {
  test("Pressing the up arrow should set input focus", () => {
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
        options={[
          "Acura",
          "BMW",
          "Audi",
          "Bentley",
          "Buick",
          "Cadillac",
          "Chevrolet",
        ]}
        styles={{ searchField: { focus: { color: "#f29" } } }}
      />
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    fireEvent.change(input, { target: { value: "B" } }); 
    userEvent.type(input, "{arrowup}");
    userEvent.type(input, "{arrowup}");
    userEvent.type(input, "{arrowup}");
    expect(input).toHaveAttribute('aria-activedescendant', 'Make-suggestion0')
  });
  test("Pressing down arrow should set aria-selected true for the selected option", () => {
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
        styles={{ searchField: { focus: { color: "#f29" } } }}
      />
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    fireEvent.change(input, { target: { value: "B" } }); 
    userEvent.type(input, "{arrowup}");
    userEvent.type(input, "{arrowup}");
    userEvent.type(input, "{arrowup}");
    expect(input).toHaveFocus();
    const option = screen.getByRole("option", { name: "Bentley"});
    expect(option).toHaveAttribute('aria-selected', "true")
  });
});

describe("Escape key", () => {
  test("It should collapse the listbox", () => {
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
        options={[
          "Acura",
          "BMW",
          "Audi",
          "Bentley",
          "Buick",
          "Cadillac",
          "Chevrolet",
        ]}
        styles={{ searchField: { focus: { color: "#f29" } } }}
      />
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    fireEvent.change(input, { target: { value: "B" } }); 
    expect(screen.getByRole("textbox", { name: "Make"})).toHaveValue("B")
    userEvent.type(input, "{esc}");
    expect(screen.getByRole("textbox", { name: "Make"})).toHaveValue("")
  });
  test("It should focus on the input field", () => {
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
        styles={{ searchField: { focus: { color: "#f29" } } }}
      />
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    fireEvent.change(input, { target: { value: "B" } }); 
    expect(screen.getByRole("textbox", { name: "Make"})).toHaveValue("B")
    userEvent.type(input, "{arrowdown}");
    const option = screen.getByRole("option", { name: "Bentley"})
    expect(input).toHaveAttribute("aria-activedescendant", option.id);
    userEvent.type(input, "{esc}");
    expect(input).toHaveFocus();
  });
  test("It should clear the aria-activedescendant", () => {
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
        styles={{ searchField: { focus: { color: "#f29" } } }}
      />
    );
    const input = screen.getByRole("textbox", { name: "Make" });
    fireEvent.change(input, { target: { value: "B" } }); 
    expect(screen.getByRole("textbox", { name: "Make"})).toHaveValue("B")
    userEvent.type(input, "{arrowdown}");
    const option = screen.getByRole("option", { name: "Bentley"})
    expect(input).toHaveAttribute("aria-activedescendant", option.id);
    userEvent.type(input, "{esc}");
    expect(input).not.toHaveAttribute("aria-activedescendant");
  })
})
describe("Tab key", () => {
  describe("If an option has been selected", () => {
    test("It should change the value of the input to the currently selected option", () => {
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
          styles={{ searchField: { focus: { color: "#f29" } } }}
        />
      );
      let input = screen.queryByRole("textbox");
      fireEvent.change(input, { target: { value: "B" } });
      expect(screen.getByRole("option", { name: "Bentley" }));
      expect(screen.getByRole("option", { name: "BMW" }));
      expect(screen.getByRole("option", { name: "Buick" }));
      expect(screen.queryByRole("option", { name: "Acura"})).toBeNull();
      expect(screen.queryByRole("option", { name: "Audi"})).toBeNull();
      expect(screen.queryByRole("option", {name: "Cadillac"})).toBeNull();
      expect(screen.queryByRole("option", {name: "Chevrolet"})).toBeNull();
      userEvent.type(input, "{arrowup}");
      userEvent.type(input, "{arrowup}");
      userEvent.type(input, "{arrowup}");
      expect(input).toHaveFocus();

      const option = screen.getByRole("option", { name: "Bentley"});
      expect(option).toHaveAttribute('aria-selected', "true");
      userEvent.tab();
      expect(screen.getByRole("textbox", { name: "Make"})).toHaveValue("Bentley");
    });
  });
  describe("If an option has not been selected", () => {
    test("It should keep the value previously entered into the input field", () => {
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
          styles={{ searchField: { focus: { color: "#f29" } } }}
        />
      );
      let input = screen.queryByRole("textbox");
      fireEvent.change(input, { target: { value: "B" } });
      expect(screen.getByRole("option", { name: "Bentley" }));
      expect(screen.getByRole("option", { name: "BMW" }));
      expect(screen.getByRole("option", { name: "Buick" }));
      expect(screen.queryByRole("option", { name: "Acura"})).toBeNull();
      expect(screen.queryByRole("option", { name: "Audi"})).toBeNull();
      expect(screen.queryByRole("option", {name: "Cadillac"})).toBeNull();
      expect(screen.queryByRole("option", {name: "Chevrolet"})).toBeNull();
      expect(input).toHaveFocus();
      userEvent.tab();
      expect(screen.getByRole("textbox", { name: "Make"})).toHaveValue("B");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
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
describe("Defaults", () => {
    test("It should default the name of the input to be 'Search'", () => {
        const ref = React.createRef();
        render(<AutoSuggest ref={ref} />);
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
        expect(screen.getByText(/No results found/)).toBeInTheDocument();
    });
    test("It should provide a message that there are no results", () => {
        const ref = React.createRef();
        render(<AutoSuggest ref={ref} />);
        expect(screen.getByText(/No results found/)).toBeInTheDocument();
    });
    test("It should render AutoSuggestClient if no url or type is provided", () => {
        const ref = React.createRef();
        const { getByDataType } = render(<AutoSuggest ref={ref} />);
        expect(getByDataType("Client")).toBeInTheDocument();
    });
});