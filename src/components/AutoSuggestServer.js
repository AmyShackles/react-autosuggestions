import React from "react";
import { useDebounce } from "../utils/useDebounce.js";
import { AutoSuggestContainer } from "../components/AutoSuggestContainer.js";
import "../index.css";
import fetch from "node-fetch";


export const AutoSuggestServer = React.forwardRef(
    ({ url = "", name, debounceTime = 200, styles, type, isOpen, setIsOpen, handleChange }, ref) => {
        const [options, setOptions] = React.useState([]);
        const [searchText, setSearchText] = React.useState();
        const [errored, setErrored] = React.useState(false);
        const [noResult, setNoResult] = React.useState(false);
        const debouncedSearchText = useDebounce(searchText, debounceTime);
        const [loading, setLoading] = React.useState(false);
        const [activeDescendant, setActiveDescendant] = React.useState();

        React.useEffect(() => {
            if (isOpen && searchText) setLoading(true);
            if (isOpen && searchText && debouncedSearchText && searchText === debouncedSearchText) {
                fetch(`${url}/${encodeURIComponent(debouncedSearchText)}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data && data.length) {
                            setIsOpen(true);
                            setOptions(data);
                            setNoResult(false);
                        } else {
                            setIsOpen(false);
                            setOptions([]);
                            setNoResult(true);
                        }
                        setLoading(false);
                        setErrored(false);
                    })
                    .catch(() => {
                        setErrored(true);
                        setLoading(false);
                    });
            }
        }, [isOpen, searchText, debouncedSearchText, url]);

        React.useEffect(() => {
            if (!searchText) {
                setLoading(false);
                setIsOpen(false);
            }
        });
        const handleInputChange = (value) => {
            setSearchText(value);
            handleChange && handleChange(value);
        };

        if (url === "") {
            throw new Error("AutoSuggestServer requires a url parameter");
        } else {
            return (
                <AutoSuggestContainer
                    dataType={type}
                    ref={ref}
                    name={name}
                    options={options}
                    error={errored}
                    setSearchText={handleInputChange}
                    searchText={searchText}
                    openListbox={isOpen}
                    setOpenListbox={setIsOpen}
                    noResult={noResult}
                    styles={styles}
                    loading={loading}
                    setLoading={setLoading}
                    activeDescendant={activeDescendant}
                    setActiveDescendant={setActiveDescendant}
                    clearText={() => {
                        setSearchText();
                        handleChange && handleChange();
                    }}
                />
            );
        }
    }
);
