import React from "react";
import { useDebounce } from "../utils/useDebounce.js";
import { AutoSuggestContainer } from "../components/AutoSuggestContainer.js";
import "../index.css";
import fetch from "node-fetch";


export const AutoSuggestServer = React.forwardRef(
    ({ debounceTime = 200, disabled, handleChange, id, isOpen, name, setIsOpen, styles, type,  url = "", value }, ref) => {
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
                    activeDescendant={activeDescendant}
                    clearText={() => {
                        handleChange();
                    }}
                    dataType={type}
                    disabled={disabled}
                    error={errored}
                    id={id}
                    loading={loading}
                    name={name}
                    noResult={noResult}
                    openListbox={isOpen}
                    options={options}
                    ref={ref}
                    searchText={value}
                    setActiveDescendant={setActiveDescendant}
                    setLoading={setLoading}
                    setOpenListbox={setIsOpen}
                    setSearchText={handleInputChange}
                    styles={styles}
                    />
            );
        }
    }
);
