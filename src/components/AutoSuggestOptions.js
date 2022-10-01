import React from "react";
import { AutoSuggestOption } from "./AutoSuggestOption.js";

export const AutoSuggestOptions = React.forwardRef(({ id, onClick, options, styles, name, selected }, ref) => {
    if (options[0].value && options[0].name && options[0].abbr) {
        return (
            <ul
                aria-labelledby={`${id}-label`}
                id={`${id}--autosuggest-options`}
                ref={ref}
                role="listbox"
                style={styles.suggestionOptions && styles.suggestionOptions}
            >
                {options &&
                    options.map(({ name, value, abbr }, index) => (
                        <AutoSuggestOption
                            abbr={abbr}
                            id={`${id}-suggestion-${index}`}
                            key={index}
                            name={name}
                            onClick={onClick}
                            selected={selected}
                            styles={styles}
                            value={value}
                        />
                    ))}
            </ul>
        );
    } else if (options[0].value && options[0].name) {
        return (
            <ul
                aria-labelledby={`${id}-label`}
                id={`${id}--autosuggest-options`}
                ref={ref}
                role="listbox"
                style={styles.suggestionOptions && styles.suggestionOptions}
            >
                {options &&
                    options.map(({ name, value }, index) => (
                        <AutoSuggestOption
                            id={`${id}-suggestion-${index}`}
                            key={index}
                            name={name}
                            onClick={onClick}
                            selected={selected}
                            styles={styles}
                            value={value}
                        />
                    ))}
            </ul>
        );
    }
    return (
        <ul
            aria-labelledby={`${id}-label`}
            id={`${id}--autosuggest-options`}
            ref={ref}
            role="listbox"
            style={styles.suggestionOptions && styles.suggestionOptions}
        >
            {options &&
                options.map((opt, index) => (
                    <AutoSuggestOption
                        id={`${id}-suggestion-${index}`}
                        key={index}
                        onClick={onClick}
                        selected={selected}
                        styles={styles}
                        value={opt}
                    />
                ))}
        </ul>
    );
});
