import React from "react";
import { AutoSuggestOption } from "./AutoSuggestOption.js";

export const AutoSuggestOptions = React.forwardRef(
  (
    {
      id = "autoSuggest",
      onClick = () => {},
      options = [],
      styles = {},
      name = "search",
      selected = "",
    },
    ref
  ) => {
    return (
      <ul
        id={id}
        role="listbox"
        onClick={onClick}
        ref={ref}
        style={styles.suggestionOptions && styles.suggestionOptions}
      >
        {options &&
          options.map((opt, index) => (
            <AutoSuggestOption
              key={index}
              id={`${name}-suggestion${index}`}
              selected={selected}
              value={opt}
              styles={styles}
            />
          ))}
      </ul>
    );
  }
);
