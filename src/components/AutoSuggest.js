import React from "react";
import { AutoSuggestClient } from "./AutoSuggestClient.js";
import { AutoSuggestServer } from "./AutoSuggestServer.js";
import "../index.css";
import { defaultOptions } from "../utils/defaultOptions.js";

export const AutoSuggest = ({
    caseInsensitive = true,
    debounceTime = 200,
    disabled = false,
    handleChange,
    id,
    name = "Search",
    options = [],
    styles = defaultOptions,
    type = "",
    url = "",
    value,
}) => {
    const combinedStyles = {
        announcement: {
            ...defaultOptions.announcement,
            ...styles.announcement
        },
        combobox: {
            ...defaultOptions.combobox,
            ...styles.combobox
        },
        searchField: {
            ...defaultOptions.searchField,
            ...styles.searchField,
            focus: {
                ...defaultOptions.searchField.focus,
                ...(styles.searchField && styles.searchField.focus && { ...styles.searchField.focus })
            }
        },
        searchLabel: {
            ...defaultOptions.searchLabel,
            ...styles.searchLabel
        },
        suggestionsContainer: {
            ...defaultOptions.suggestionsContainer,
            ...styles.suggestionsContainer
        },
        suggestionOptions: {
            ...defaultOptions.suggestionOptions,
            ...styles.suggestionOptions
        },
        suggestionOption: {
            ...defaultOptions.suggestionOption,
            ...styles.suggestionOption
        }
    };
    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef(null);

    const clickListener = React.useCallback(
        (e) => {
            if (!ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        },
        [ref.current]
    );

    React.useEffect(() => {
        document.addEventListener("click", clickListener);
        return () => {
            document.removeEventListener("click", clickListener);
        };
    }, []);

    if (type === "server" || url) {
        return (
            <AutoSuggestServer
            debounceTime={debounceTime}
            disabled={disabled}
            handleChange={handleChange}
            id={id}
            isOpen={isOpen}
            name={name}
            setIsOpen={setIsOpen}
            styles={combinedStyles}
            type="Server"
            ref={ref}
            url={url}
            value={value}
            />
        );
    }
    return (
        <AutoSuggestClient
            caseInsensitive={caseInsensitive}
            disabled={disabled}
            handleChange={handleChange}
            id={id}
            isOpen={isOpen}
            name={name}
            options={options}
            ref={ref}
            setIsOpen={setIsOpen}
            type="Client"
            styles={combinedStyles}
            value={value}
        />
    );
};
