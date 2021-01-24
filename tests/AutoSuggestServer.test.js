import { AutoSuggestServer } from "../src/components/AutoSuggestServer.js";
import { render, screen, waitFor, fireEvent, act } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { defaultOptions } from "../src/utils/defaultOptions.js";

    const fakeModels = [
        "Double Double",
        "Double Demons",
        "Double Checking This Works"
    ];
const server = setupServer(
    rest.get(
        "https://ntsb-server.herokuapp.com/api/accidents/modelList/:model",
        (req, res, ctx) => {
            const { model } = req.params;
            return res(ctx.json(fakeModels.filter((val) => val.toUpperCase().startsWith(model.toUpperCase()))));
        }
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const ServerWrapper = ({ url, name, type }) => {
    const ref = React.useRef();
    const [isOpen, setIsOpen] = React.useState(false);
    const [value, setValue] = React.useState();
    return (
        <>
            <AutoSuggestServer
                url={url}
                name={name}
                type={type}
                ref={ref}
                value={value}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleChange={setValue}
                styles={defaultOptions}
            />
            <p data-testid={`${name}-value`}>{value}</p>
        </>
    );
};

describe("AutoSuggest Server variant", () => {
    describe("handles server success with data",  () => {
        test("It should handle searching by input", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).toBeInTheDocument();
                });
            });
            expect(screen.queryByText(/Loading/)).toHaveStyle({
                position: "absolute",
                clip: "rect(0 0 0 0)",
                clipPath: "inset(50%)",
                height: "1px",
                width: "1px",
                overflow: "hidden"
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
                expect(option.classList.contains("auto-suggestions"));
            });
        });
        test("It should handle clearing the search field", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
            await act(async () => {
                userEvent.clear(input);
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });
            });
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
        });
        test("It handles hitting the tab key", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
            await act(async () => {
                userEvent.tab();
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });
            });
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("double");
            expect(screen.getByTestId("Model-value")).toHaveTextContent("double");
        });
        test("It handles navigating with the down arrow", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
            await act(async () => {
                userEvent.type(input, "{arrowdown}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Double" }).getAttribute("id")
                    );
                });
            });

            await act(async () => {
                userEvent.type(input, "{arrowdown}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(screen.getByRole("option", { name: "Double Demons" }).classList.contains("highlighted"));
                    expect(
                        screen.getByRole("option", { name: "Double Demons" }).classList.contains("auto-suggestions")
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Demons" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                });
            });
            await act(async () => {
                userEvent.type(input, "{arrowdown}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Checking This Works" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                });
            });
            await act(async () => {
                userEvent.type(input, "{arrowdown}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Double" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                });
            });
            expect(
                screen.getByRole("option", { name: "Double Checking This Works" }).classList.contains("highlighted")
            ).toBe(false);
            expect(screen.getByRole("option", { name: "Double Double" }).classList.contains("highlighted")).toBe(true);
            expect(screen.getByRole("option", { name: "Double Demons" }).classList.contains("highlighted")).toBe(false);
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("double");
            expect(screen.getByTestId("Model-value")).toHaveTextContent("double");
        });
        test("It handles navigating with the up arrow", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
            await act(async () => {
                userEvent.type(input, "{arrowup}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Checking This Works" }).getAttribute("id")
                    );
                });
            });
            await act(async () => {
                userEvent.type(input, "{arrowup}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Demons" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                });
            });
            await act(async () => {
                userEvent.type(input, "{arrowup}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Double" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                });
            });
            await act(async () => {
                userEvent.type(input, "{arrowup}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Checking This Works" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                });
            });
            expect(
                screen.getByRole("option", { name: "Double Checking This Works" }).classList.contains("highlighted")
            ).toBe(true);
            expect(screen.getByRole("option", { name: "Double Double" }).classList.contains("highlighted")).toBe(false);
            expect(screen.getByRole("option", { name: "Double Demons" }).classList.contains("highlighted")).toBe(false);
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("double");
            expect(screen.getByTestId("Model-value")).toHaveTextContent("double");
        });
        test("It handles hitting the enter key with no option selected", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
            await act(async () => {
                userEvent.type(input, "{enter}");
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });
            });
            expect(input).not.toHaveAttribute("aria-activedescendant");
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("double");
            expect(screen.getByTestId("Model-value")).toHaveTextContent("double");
        });
        test("It handles hitting the enter key with an option selected", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
            await act(async () => {
                userEvent.type(input, "{arrowup}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Checking This Works" }).getAttribute("id")
                    );
                });
            });
            await act(async () => {
                userEvent.type(input, "{enter}");
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });
            });
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("Double Checking This Works");
            expect(screen.getByTestId("Model-value")).toHaveTextContent("Double Checking This Works");
            expect(input).not.toHaveAttribute("aria-activedescendant");
        });
        test("It handles other keypress events", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                userEvent.type(input, "a");
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            expect(screen.queryByRole("option")).not.toBeInTheDocument();
            expect(screen.getByText(/No results found/)).toBeInTheDocument();
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("a");
            expect(screen.getByTestId("Model-value")).toHaveTextContent("a");
        });
        test("It handles hitting escape key", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
            await act(async () => {
                userEvent.type(input, "{arrowup}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Checking This Works" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                });
            });
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("double");
            await act(async () => {
                userEvent.type(input, "{esc}");
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });
            });
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("");
            expect(input).not.toHaveAttribute("aria-activedescendant");
            expect(screen.getByTestId("Model-value")).toHaveTextContent("");
        });
        test("It handles selection of option", async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
            const input = screen.getByRole("textbox", { name: "Model" });

            await act(async () => {
                fireEvent.change(input, { target: { value: "double" } });
                await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
            });
            await act(async () => {
                await waitFor(() => {
                    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
                });
            });
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
            const option = screen.getByRole("option", { name: "Double Demons" });
            await act(async () => {
                fireEvent(
                    option,
                    new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true
                    })
                );
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });
            });
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("Double Demons");
            expect(screen.getByTestId("Model-value")).toHaveTextContent("Double Demons");
        });
    });
    test("handles server success without data", async () => {
        server.use(
            rest.get("https://ntsb-server.herokuapp.com/api/accidents/modelList/:model", (req, res, ctx) => {
                return res(ctx.json([]));
            })
        );
        render(
            <ServerWrapper url="https://ntsb-server.herokuapp.com/api/accidents/modelList" name="Model" type="Server" />
        );
        const input = screen.getByRole("textbox", { name: "Model" });
        await act(async () => {
            fireEvent.change(input, { target: { value: "double" } });
            await waitFor(() => expect(screen.queryByText(/Loading/)).toBeInTheDocument());
        });
        await act(async () => {
            await waitFor(() => {
                expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            });
        });
        expect(screen.getByText(/No results found/)).toBeInTheDocument();
        expect(input).toHaveValue("double");
        expect(screen.getByTestId("Model-value")).toHaveTextContent("double");
    });
    test("handles server error", async () => {
        server.use(
            rest.get("https://ntsb-server.herokuapp.com/api/accidents/modelList/:model", (req, res, ctx) => {
                return res(ctx.status(500));
            })
        );
        render(
            <ServerWrapper url="https://ntsb-server.herokuapp.com/api/accidents/modelList" name="Model" type="Server" />
        );
        const input = screen.getByRole("textbox", { name: "Model" });
        await act(async () => {
            fireEvent.change(input, { target: { value: "double" } });
            await waitFor(() =>
                expect(screen.queryByText(/Loading/)).toBeInTheDocument()
            );
        });
        await act(async () => {
            await waitFor(() => {
                expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            });
        });
        expect(screen.getByText(/Results could not be fetched/)).toBeInTheDocument();
    });
    test("It should throw an error if the server type is provided without a url", () => {
        const originalError = console.error;
        console.error = jest.fn();
        expect(() => render(<ServerWrapper />)).toThrow("AutoSuggestServer requires a url parameter");
        console.error = originalError;
    });
});
