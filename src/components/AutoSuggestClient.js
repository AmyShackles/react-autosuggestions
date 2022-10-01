import React from "react";
import { AutoSuggestContainer } from "./AutoSuggestContainer.js";
import { alphanumericSort } from "../utils/alphanumericSort.js";

export const AutoSuggestClient = React.forwardRef(
    (
        {  caseInsensitive, disabled, handleChange, id, isOpen, name, options, setIsOpen, styles, type, value, },
        ref
    ) => {
        const [sortedOptions, optionType] = alphanumericSort(options);
        const [results, setResults] = React.useState(sortedOptions);
        const [noResult, setNoResult] = React.useState(false);
        const [activeDescendant, setActiveDescendant] = React.useState();

        React.useEffect(() => {
            if (isOpen && value) {
                let res = [];
                if (optionType === "string") {
                    if (caseInsensitive) {
                        res = options.filter((opt) => opt.toUpperCase().startsWith(value.toUpperCase()));
                    } else {
                        res = options.filter((opt) => opt.startsWith(value));
                    }
                }
                if (optionType === "object") {
                    if (caseInsensitive) {
                                res = options.filter((opt) => opt.value.toUpperCase().startsWith(value.toUpperCase()));
                    } else {
                        res = options.filter((opt) => opt.value.startsWith(value));
                    }
                }
                setResults(res);
                res.length >= 1 && setIsOpen(true);
            }
        }, [value, isOpen, options]);

        React.useEffect(() => {
            if (!value) {
                setIsOpen(false);
            }
        }, [value]);

        React.useEffect(() => {
            if (isOpen === false) {
                setResults([]);
                setNoResult(false);
            }
        }, [isOpen]);

        const handleInputChange = (value) => {
            handleChange(value);
        };

        return (
            <AutoSuggestContainer
                activeDescendant={activeDescendant}
                clearText={() => {
                    handleChange();
                }}
                dataType={type}
                disabled={disabled}
                id={id}
                name={name}
                noResult={noResult}
                openListbox={isOpen}
                options={results}
                ref={ref}
                searchText={value}
                setActiveDescendant={setActiveDescendant}
                setOpenListbox={setIsOpen}
                setSearchText={handleInputChange}
                styles={styles}
            />
        );
    }
);
