import React from "react";

export const AutoSuggestOption = ({ id, styles, value, classNames }) => {
  return (
    <li
      role="option"
      id={id}
      className={`auto-suggestions${classNames ? ` ${classNames}` : ""}`}
      style={styles.suggestionOption && styles.suggestionOption}
    >
      {value}
    </li>
  );
};
