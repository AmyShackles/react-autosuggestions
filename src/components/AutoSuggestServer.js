import React from "react";
import { useDebounce } from "../utils/useDebounce.js";
import { AutoSuggestContainer } from "../components/AutoSuggestContainer.js";
import "../index.css";
import fetch from "node-fetch";


export const AutoSuggestServer = React.forwardRef(
    ({ url = "", name, debounceTime = 200, styles, type, isOpen, setIsOpen, handleChange, disabled, value }, ref) => {
        const [options, setOptions] = React.useState([]);
        const [errored, setErrored] = React.useState(false);
        const [noResult, setNoResult] = React.useState(false);
        const debouncedSearchText = useDebounce(value, debounceTime, isOpen);
        const [loading, setLoading] = React.useState(false);
        const [activeDescendant, setActiveDescendant] = React.useState();

        React.useEffect(() => {
            if (isOpen && value) setLoading(true);
            if (isOpen && value && debouncedSearchText && value === debouncedSearchText) {
                fetch(`${url}/${encodeURIComponent(debouncedSearchText)}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data && data.length) {
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
        }, [isOpen, value, debouncedSearchText, url]);

        React.useEffect(() => {
            if (!value) {
                setLoading(false);
                setIsOpen(false);
            }
        });
        const handleInputChange = (val) => {
            handleChange(val);
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
                    searchText={value}
                    openListbox={isOpen}
                    setOpenListbox={setIsOpen}
                    noResult={noResult}
                    styles={styles}
                    loading={loading}
                    setLoading={setLoading}
                    activeDescendant={activeDescendant}
                    setActiveDescendant={setActiveDescendant}
                    clearText={() => {
                        handleChange();
                    }}
                    disabled={disabled}
                />
            );
        }
    }
);
