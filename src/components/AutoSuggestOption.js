import React from "react";

export const AutoSuggestOption = ({ abbr = undefined, id, name = undefined, onClick, selected, styles, value }) => {
    const [isHovered, setIsHovered] = React.useState()

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const isSelected = id === selected;

    const combinedStyles = { 
        ...styles.suggestionOption,
        ...(isHovered && { ...styles.hoveredSuggestionOption}),
        ...(isSelected && { ...styles.selectedSuggestionOption}) 
    };

    return (
        <li
            abbr={abbr && abbr}
            aria-selected={isSelected}
            className={isSelected ? `auto-suggestions highlighted` : "auto-suggestions"}
            id={id}
            name={name && name}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="option"
            style={combinedStyles}
            textvalue={value}
        >
            {value}
        </li>
    );
};
