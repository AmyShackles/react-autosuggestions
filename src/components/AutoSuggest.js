import React from "react";
import { AutoSuggestClient } from "./AutoSuggestClient.js";
import { AutoSuggestServer } from "./AutoSuggestServer.js";
import "../index.css";
import { defaultOptions } from "../utils/defaultOptions.js";

export const AutoSuggest = ({
    type = "",
    url = "",
    name = "Search",
    debounceTime = 200,
    styles = defaultOptions,
    options = [],
    handleChange,
    disabled = false,
    value,
    caseInsensitive = true
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
                ref={ref}
                name={name}
                url={url}
                type="Server"
                debounceTime={debounceTime}
                styles={combinedStyles}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleChange={handleChange}
                disabled={disabled}
                value={value}
            />
        );
    }
    return (
        <AutoSuggestClient
            ref={ref}
            name={name}
            type="Client"
            options={options}
            styles={combinedStyles}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            handleChange={handleChange}
            disabled={disabled}
            value={value}
            caseInsensitive={caseInsensitive}
        />
    );
};
