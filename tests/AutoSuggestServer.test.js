import { AutoSuggestServer } from "../src/components/AutoSuggestServer.js";
import { render, screen, waitFor, fireEvent, act } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";

    const fakeModels = [
        "Double Double",
        "Double Demons",
        "Double Checking This Works"
    ];
const server = setupServer(
    rest.get(
        "https://ntsb-server.herokuapp.com/api/accidents/modelList/:model",
        (req, res, ctx) => {
            return res(ctx.json(fakeModels));
        }
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const ref = React.createRef();
test("handles server success with data", async () => {
    await act(async () => {
        render(
            <AutoSuggestServer
                url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                name="Model"
                type="Server"
                ref={ref}
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
            <AutoSuggestServer
                url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                name="Model"
                type="Server"
                ref={ref}
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
            <AutoSuggestServer
                url="https://ntsb-server.herokuapp.com/api/accidents/modelList"
                name="Model"
                type="Server"
                ref={ref}
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
    expect(() => render(<AutoSuggestServer ref={ref} />)).toThrow("AutoSuggestServer requires a url parameter");
    console.error = originalError;
});