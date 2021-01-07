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
    handleChange  =  () => {}
}) => {
    const combinedStyles = {
        ...defaultOptions,
        ...styles,
        searchField: {
            ...defaultOptions.searchField,
            ...styles.searchField,
            focus: {
                ...defaultOptions.searchField.focus,
                ...styles.searchField.focus
            }
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

    if (!type) {
        if (url) {
            type = "server";
        } else {
            type = "client";
        }
    }

    if (type === "server") {
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
        />
    );
};
