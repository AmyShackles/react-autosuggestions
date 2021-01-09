import React from "react";
import { AutoSuggestOption } from "./AutoSuggestOption.js";

export const AutoSuggestOptions = React.forwardRef(({ id, onClick, options, styles, name, selected }, ref) => {
    if (options[0].value && options[0].name && options[0].abbr) {
        return (
            <ul
                id={id}
                role="listbox"
                ref={ref}
                aria-labelledby={`${name}-label`}
                style={styles.suggestionOptions && styles.suggestionOptions}
            >
                {options &&
                    options.map(({ name, value, abbr }, index) => (
                        <AutoSuggestOption
                            key={index}
                            id={`${name}-suggestion${index}`}
                            selected={selected}
                            onClick={onClick}
                            value={value}
                            name={name}
                            abbr={abbr}
                            styles={styles}
                        />
                    ))}
            </ul>
        );
    } else if (options[0].value && options[0].name) {
        return (
            <ul
                id={id}
                role="listbox"
                ref={ref}
                aria-labelledby={`${name}-label`}
                style={styles.suggestionOptions && styles.suggestionOptions}
            >
                {options &&
                    options.map(({ name, value }, index) => (
                        <AutoSuggestOption
                            key={index}
                            id={`${name}-suggestion${index}`}
                            selected={selected}
                            onClick={onClick}
                            value={value}
                            name={name}
                            styles={styles}
                        />
                    ))}
            </ul>
        );
    }
    return (
        <ul
        id={id}
        role="listbox"
        ref={ref}
        aria-labelledby={`${name}-label`}
        style={styles.suggestionOptions && styles.suggestionOptions}
    >
        {options &&
            options.map((opt, index) => (
                <AutoSuggestOption
                    key={index}
                    id={`${name}-suggestion${index}`}
                    selected={selected}
                    onClick={onClick}
                    value={opt}
                    styles={styles}
                />
            ))}
    </ul>
    );
});
