import React from "react";
import { AutoSuggestContainer } from "./AutoSuggestContainer.js";
import { alphanumericSort } from "../utils/alphanumericSort.js";
export const AutoSuggestClient = React.forwardRef(({ name, options, styles, type }, ref) => {
    options = alphanumericSort(options);
    const [searching, setSearching] = React.useState(false);
    const [searchText, setSearchText] = React.useState();
    const [results, setResults] = React.useState(options);
    const [noResult, setNoResult] = React.useState(false);
    const [activeDescendant, setActiveDescendant] = React.useState();

    React.useEffect(() => {
        if (searching && searchText) {
            let res = options.filter((opt) => opt.startsWith(searchText));
            setResults(res);
            if (res.length >= 1) {
                setSearching(true);
            }
        }
    }, [searchText, searching, options]);

    React.useEffect(() => {
        if (searching === false) {
            setResults([]);
            setNoResult(false);
        }
    }, [searching]);

    const handleInputChange = (value) => {
        setSearchText(value);
    };

    return (
        <AutoSuggestContainer
            ref={ref}
            name={name}
            options={results || []}
            searching={searching}
            searchText={searchText}
            setSearching={setSearching}
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
