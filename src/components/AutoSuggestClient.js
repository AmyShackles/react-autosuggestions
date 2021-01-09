import React from "react";
import { AutoSuggestContainer } from "./AutoSuggestContainer.js";
import { alphanumericSort } from "../utils/alphanumericSort.js";

export const AutoSuggestClient = React.forwardRef(
    ({ name, options, styles, type, isOpen, setIsOpen, handleChange }, ref) => {
        const [sortedOptions, optionType] = alphanumericSort(options);
        const [searchText, setSearchText] = React.useState();
        const [results, setResults] = React.useState(sortedOptions);
        const [noResult, setNoResult] = React.useState(false);
        const [activeDescendant, setActiveDescendant] = React.useState();

        React.useEffect(() => {
            if (isOpen && searchText) {
                let res;
                if (optionType === "string") {
                    res = options.filter((opt) => opt.startsWith(searchText));
                }
                if (optionType === "object") {
                    res = options.filter((opt) => opt.value.startsWith(searchText));
                }
                setResults(res);
                res.length >= 1 && setIsOpen(true);
            }
        }, [searchText, isOpen, options]);

        React.useEffect(() => {
            if (!searchText) {
                setIsOpen(false);
            }
        }, [searchText]);

        React.useEffect(() => {
            if (isOpen === false) {
                setResults([]);
                setNoResult(false);
            }
        }, [isOpen]);

        const handleInputChange = (value) => {
            setSearchText(value);
            handleChange && handleChange(value);
        };

        return (
            <AutoSuggestContainer
                ref={ref}
                name={name}
                options={results}
                openListbox={isOpen}
                searchText={searchText}
                setOpenListbox={setIsOpen}
                setSearchText={handleInputChange}
                styles={styles}
                dataType={type}
                noResult={noResult}
                activeDescendant={activeDescendant}
                setActiveDescendant={setActiveDescendant}
                clearText={() => {
                    setSearchText();
                    handleChange && handleChange();
                }}
            />
        );
    }
);
