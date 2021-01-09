import React from "react";

export const AutoSuggestOption = ({
    id,
    styles,
    value,
    selected,
    onClick,
    name = undefined,
    abbr = undefined
}) => {
    return (
        <li
            role="option"
            id={id}
            aria-selected={id === selected}
            className={id === selected ? `auto-suggestions highlighted` : 'auto-suggestions'}
            style={styles.suggestionOption && styles.suggestionOption}
            textvalue={value}
            onClick={onClick}
            name={name && name}
            abbr={abbr && abbr}
        >
            {value}
        </li>
    );
};
