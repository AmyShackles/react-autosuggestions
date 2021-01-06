import React from "react";
import { AutoSuggestContainer } from "./AutoSuggestContainer.js";
import { alphanumericSort } from "../utils/alphanumericSort.js";
export const AutoSuggestClient = React.forwardRef(({ name, options, styles, type, isOpen, setIsOpen }, ref) => {
    options = alphanumericSort(options);
    const [searchText, setSearchText] = React.useState();
    const [results, setResults] = React.useState(options);
    const [noResult, setNoResult] = React.useState(false);
    const [activeDescendant, setActiveDescendant] = React.useState();

    React.useEffect(() => {
        if (isOpen && searchText) {
            let res = options.filter((opt) => opt.startsWith(searchText));
            setResults(res);
            if (res.length >= 1) {
                setIsOpen(true);
            }
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
    };

    return (
        <AutoSuggestContainer
            ref={ref}
            name={name}
            options={results || []}
            openListbox={isOpen}
            searchText={searchText}
            setOpenListbox={setIsOpen}
            setSearchText={handleInputChange}
            styles={styles}
            dataType={type}
            noResult={noResult}
            activeDescendant={activeDescendant}
            setActiveDescendant={setActiveDescendant}
            clearText={() => setSearchText()}
        />
    );
});
