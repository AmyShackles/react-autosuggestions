import React from "react";

export const AutoSuggestOption = ({ abbr = undefined, id, name = undefined, onClick, selected, styles, value }) => {
    return (
        <li
            abbr={abbr && abbr}
            aria-selected={id === selected}
            className={id === selected ? `auto-suggestions highlighted` : "auto-suggestions"}
            id={id}
            name={name && name}
            onClick={onClick}
            role="option"
            style={styles.suggestionOption && styles.suggestionOption}
            textvalue={value}
        >
            {value}
        </li>
    );
};
