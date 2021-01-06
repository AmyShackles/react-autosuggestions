import { AutoSuggestServer } from "../src/components/AutoSuggestServer.js";
import { render, screen, waitFor, fireEvent, act } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

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

    return <AutoSuggestServer url={url} name={name} type={type} ref={ref} isOpen={isOpen} setIsOpen={setIsOpen} />;
};

describe("AutoSuggest Server variant", () => {
    describe("handles server success with data",  () => {
        test("It should handle searching by input", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
            const options = screen.getAllByRole("option");
            options.forEach((option, index) => {
                expect(option.getAttribute("textvalue")).toBe(fakeModels[index]);
            });
        });
        test("It handles hitting the tab key", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
        });
        test("It handles navigating with the down arrow", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute("aria-selected", "true");
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Double" }).getAttribute("id")
                    );
                });
            });
            await act(async () => {
                userEvent.type(input, "{arrowdown}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute("aria-selected", "true");
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Demons" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute("aria-selected", "false");
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
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute("aria-selected", "false");
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute("aria-selected", "false");
                });
            });
            await act(async () => {
                userEvent.type(input, "{arrowdown}");
                await waitFor(() => {
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute("aria-selected", "true");
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Double" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute("aria-selected", "false");
                    expect(screen.getByRole("option", { name: "Double Checking This Works" })).toHaveAttribute(
                        "aria-selected",
                        "false"
                    );
                });
            });
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("double");
        });
        test("It handles navigating with the up arrow", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute("aria-selected", "true");
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
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute("aria-selected", "true");
                    expect(input).toHaveAttribute(
                        "aria-activedescendant",
                        screen.getByRole("option", { name: "Double Double" }).getAttribute("id")
                    );
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute("aria-selected", "false");
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
                    expect(screen.getByRole("option", { name: "Double Demons" })).toHaveAttribute("aria-selected", "false");
                    expect(screen.getByRole("option", { name: "Double Double" })).toHaveAttribute("aria-selected", "false");
                });
            });
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("double");
        });
        test("It handles hitting the enter key with no option selected", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
            expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
            expect(input).toHaveValue("double");
        });
        test("It handles hitting the enter key with an option selected", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
            expect(input).not.toHaveAttribute("aria-activedescendant");
        });
        test("It handles other keypress events", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
        });
        test("It handles hitting escape key", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
        });
        test("It handles selection of option", async () => {
            await act(async () => {
                render(
                    <ServerWrapper
                        url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                        name="Model"
                        type="Server"
                    />
                );
            });
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
        });
    });
    test("handles server success without data", async () => {
        server.use(
            rest.get(
                "https://ntsb-server.herokuapp.com/api/accidents/modelList/:model",
                (req, res, ctx) => {
                    return res(ctx.json([]));
                }
            )
        );
        await act(async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
        });
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
        expect(screen.getByText(/No results found/)).toBeInTheDocument();
    });
    test("handles server error", async () => {
        server.use(
            rest.get(
                "https://ntsb-server.herokuapp.com/api/accidents/modelList/:model",
                (req, res, ctx) => {
                    return res(ctx.status(500));
                }
            )
        );
        await act(async () => {
            render(
                <ServerWrapper
                    url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                    name="Model"
                    type="Server"
                />
            );
        });
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