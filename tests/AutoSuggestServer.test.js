import { AutoSuggestServer } from "../src/components/AutoSuggestServer.js";
import { render, screen, waitFor, fireEvent, act } from "./test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import React from "react";

const ref = React.createRef();
test("Displays a loading message if data is fetching and removes it when data is fetched", async () => {
    const fakeModels = [
        "Double Double",
        "Double Demons",
        "Double Checking This Works"
    ];
    jest.spyOn(global, "fetch").mockImplementation(() => {
        return Promise.resolve({ json: () => Promise.resolve(fakeModels) });
    });
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
    global.fetch.mockRestore();
});
