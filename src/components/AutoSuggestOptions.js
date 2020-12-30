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
    },
    ref
  ) => {
    return (
      <ul
        id={id}
        role="listbox"
        onClick={onClick}
        ref={innerRef}
        style={styles.suggestionOptions && styles.suggestionOptions}
      >
        {options &&
          options.map((opt, index) => (
            <AutoSuggestOption
              key={index}
              role="option"
              id={`${name}-suggestion${index}`}
              value={opt}
              styles={styles}
              value={opt}
            />
          ))}
      </ul>
    );
  }
);
