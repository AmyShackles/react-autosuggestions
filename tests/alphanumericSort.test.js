import { alphanumericSort, alphanumericSortObjects, alphanumericSortStrings } from "../src/utils/alphanumericSort.js";

describe("Alphanumeric sort", () => {
    test("It should handle sorting by object value", () => {
        const options = [
            { value: "Oranges" },
            { value: "Lemons" },
            { value: "Bells of St. Clemmons" },
            { value: "When will you pay me?" },
            { value: "Bells of Old Bailey" },
            { value: "When I grow rich" },
            { value: "Bells of Shoreditch" },
            { value: "When will that be?" },
            { value: "Bells of Stepknee" },
            { value: "I do not know" },
            { value: "The great bell of Boe" }
        ];
        const expected = [
            [
                { value: "Bells of Old Bailey" },
                { value: "Bells of Shoreditch" },
                { value: "Bells of St. Clemmons" },
                { value: "Bells of Stepknee" },
                { value: "I do not know" },
                { value: "Lemons" },
                { value: "Oranges" },
                { value: "The great bell of Boe" },
                { value: "When I grow rich" },
                { value: "When will that be?" },
                { value: "When will you pay me?" }
            ],
            "object"
        ];
        expect(alphanumericSort(options)).toEqual(expected);
    });
    test("It should handle sorting strings", () => {
        const options = [
            "Oranges",
            "Lemons",
            "Bells of St. Clemmons",
            "When will you pay me?",
            "Bells of Old Bailey",
            "When I grow rich",
            "Bells of Shoreditch",
            "When will that be?",
            "Bells of Stepknee",
            "I do not know",
            "The great bell of Boe"
        ];
        const expected = [
            [
                "Bells of Old Bailey",
                "Bells of Shoreditch",
                "Bells of St. Clemmons",
                "Bells of Stepknee",
                "I do not know",
                "Lemons",
                "Oranges",
                "The great bell of Boe",
                "When I grow rich",
                "When will that be?",
                "When will you pay me?"
            ],
            "string"
        ];
        expect(alphanumericSort(options)).toEqual(expected);
    });
    test("It should handle if an empty options array is passed", () => {
        const options = [];
        const expected = [[], ""];
        expect(alphanumericSort(options)).toEqual(expected);
    });
    test("It should return the options object and an empty string if the first object does not have a value key", () => {
        const options = [{ name: "Lone" }, { name: "Star" }, { name: "Runner" }];
        const expected = [[{ name: "Lone" }, { name: "Star" }, { name: "Runner" }], ""];
        expect(alphanumericSort(options)).toEqual(expected);
    });
});
describe("alphanumericSortObjects", () => {
    test("It should alphabetize an array of objects by their value property", () => {
        const options = [
            { value: "Oranges" },
            { value: "Lemons" },
            { value: "Bells of St. Clemmons" },
            { value: "When will you pay me?" },
            { value: "Bells of Old Bailey" },
            { value: "When I grow rich" },
            { value: "Bells of Shoreditch" },
            { value: "When will that be?" },
            { value: "Bells of Stepknee" },
            { value: "I do not know" },
            { value: "The great bell of Boe" }
        ];
        const expected = [
            { value: "Bells of Old Bailey" },
            { value: "Bells of Shoreditch" },
            { value: "Bells of St. Clemmons" },
            { value: "Bells of Stepknee" },
            { value: "I do not know" },
            { value: "Lemons" },
            { value: "Oranges" },
            { value: "The great bell of Boe" },
            { value: "When I grow rich" },
            { value: "When will that be?" },
            { value: "When will you pay me?" }
        ];
        expect(alphanumericSortObjects(options)).toEqual(expected);
    });
});
describe("alphanumericSortStrings", () => {
    test("It should alphabetize an array of strings", () => {
        const options = [
            "Oranges",
            "Lemons",
            "Bells of St. Clemmons",
            "When will you pay me?",
            "Bells of Old Bailey",
            "When I grow rich",
            "Bells of Shoreditch",
            "When will that be?",
            "Bells of Stepknee",
            "I do not know",
            "The great bell of Boe"
        ];
        const expected = [
            "Bells of Old Bailey",
            "Bells of Shoreditch",
            "Bells of St. Clemmons",
            "Bells of Stepknee",
            "I do not know",
            "Lemons",
            "Oranges",
            "The great bell of Boe",
            "When I grow rich",
            "When will that be?",
            "When will you pay me?"
        ];
        expect(alphanumericSortStrings(options)).toEqual(expected);
    });
});
