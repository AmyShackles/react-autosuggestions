import React from "react";

export const AutoSuggestOption = ({ id, styles, value, classNames, selected }) => {
  return (
    <li
      role="option"
      id={id}
      aria-selected={id === selected}
      className={`auto-suggestions${classNames ? ` ${classNames}` : ""}`}
      style={styles.suggestionOption && styles.suggestionOption}
    >
      {value}
    </li>
  );
};
