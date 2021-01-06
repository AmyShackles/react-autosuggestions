import React from "react";
import { AutoSuggestContainer } from "./AutoSuggestContainer.js";
import { alphanumericSort } from "../utils/alphanumericSort.js";
export const AutoSuggestClient = React.forwardRef(({ name, options, styles, type }, ref) => {
    options = alphanumericSort(options);
    const [openListbox, setOpenListbox] = React.useState(false);
    const [searchText, setSearchText] = React.useState();
    const [results, setResults] = React.useState(options);
    const [noResult, setNoResult] = React.useState(false);
    const [activeDescendant, setActiveDescendant] = React.useState();

    React.useEffect(() => {
        if (openListbox && searchText) {
            let res = options.filter((opt) => opt.startsWith(searchText));
            setResults(res);
            if (res.length >= 1) {
                setOpenListbox(true);
            }
        }
    }, [searchText, openListbox, options]);

    React.useEffect(() => {
        if (openListbox === false) {
            setResults([]);
            setNoResult(false);
        }
    }, [openListbox]);

    const handleInputChange = (value) => {
        setSearchText(value);
    };

    return (
        <AutoSuggestContainer
            ref={ref}
            name={name}
            options={results || []}
            openListbox={openListbox}
            searchText={searchText}
            setOpenListbox={setOpenListbox}
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
