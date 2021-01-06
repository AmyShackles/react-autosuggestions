import React from "react";

export const AutoSuggestOption = ({
  id,
  styles,
  value,
  classNames,
  selected,
  onClick,
}) => {
  return (
    <li
      role="option"
      id={id}
      aria-selected={id === selected}
      className={`auto-suggestions${classNames ? ` ${classNames}` : ""}`}
      style={styles.suggestionOption && styles.suggestionOption}
      textvalue={value}
      onClick={onClick}
    >
      {value}
    </li>
  );
};
