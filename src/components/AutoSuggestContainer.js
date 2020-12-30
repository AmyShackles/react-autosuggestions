import React from "react";
import { AutoSuggestOptions } from "./AutoSuggestOptions.js";

export const AutoSuggestContainer = ({
  name = "search",
  options = [],
  error = false,
  setSearchText = () => {},
  searchText = "",
  searching = false,
  setSearching = () => {},
  clearOptions = () => {},
  noResult = false,
  styles,
}) => {
  const keys = {
    ESC: 27,
    TAB: 9,
    RETURN: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  };
  const inputRef = React.useRef();
  const suggestionRef = React.createRef();

  if (inputRef.current && styles.searchField && styles.searchField.focus) {
    inputRef.current.addEventListener("focus", addInputFocusStyles);
    inputRef.current.addEventListener("blur", addInputBlurStyles);
  }
  function addInputFocusStyles() {
    if (styles.searchField.focus && inputRef.current) {
      Object.entries(styles.searchField.focus).forEach(
        ([key, value], index) => {
          inputRef.current.style[key] = value;
        }
      );
    }
  }
  function addInputBlurStyles() {
    if (styles.searchField.focus && inputRef.current) {
      Object.entries(styles.searchField.focus).forEach(([key, value]) => {
        inputRef.current.style[key] = styles.searchField[key];
      });
    }
  }

  const doSearch = (event) => {
    setSearchText(event.target.value);
    event.target.removeAttribute("aria-activedescendant");
    setSearching(true);
  };

  const copyTextRemoveSuggestions = (event) => {
    inputRef.current.value = event.target.innerText;
    inputRef.current.removeAttribute("aria-activedescendant");
    setSearching(false);
    setSearchText(event.target.innerText);
  };
  const doKeyPress = (event) => {
    console.log(suggestionRef);
    let highlighted =
      suggestionRef.current &&
      [...suggestionRef.current.children].find((node) =>
        /highlighted/.test(node.className)
      );
    switch (event.which) {
      case keys.ESC:
        event.target.removeAttribute("aria-activedescendant");
        setSearching(false);
        clearOptions();
        break;
      case keys.RIGHT:
        if (highlighted) {
          return selectOptions(highlighted);
        }
        break;

      case keys.TAB:
        event.target.removeAttribute("aria-activedescendant");
        setSearching(false);
        clearOptions();
        break;

      case keys.RETURN:
        if (highlighted) {
          event.preventDefault();
          event.stopPropagation();
          return selectOptions(highlighted);
        }
        break;
      case keys.UP:
        event.preventDefault();
        event.stopPropagation();
        return moveUp(highlighted);
        break;
      case keys.DOWN:
        event.preventDefault();
        event.stopPropagation();
        return moveDown(highlighted);

      default:
        return;
    }
  };

  const moveUp = (highlighted) => {
    if (!searching) return;
    let current = {};
    inputRef.current.removeAttribute("aria-activedescendant");
    if (highlighted) {
      current = highlighted;
      current.setAttribute("aria-selected", false);
      current.classList.remove("highlighted");
      let prev = current.previousElementSibling;
      prev && prev.setAttribute("aria-selected", true);
      prev && prev.classList.add("highlighted");
      prev && inputRef.current.setAttribute("aria-activedescendant", prev.id);
      highlighted = false;
    } else {
      current = suggestionRef.current.lastChild;
      current.classList.add("highlighted");
      current.setAttribute("aria-selected", true);
      inputRef.current.setAttribute("aria-activedescendant", current.id);
    }
  };

  const moveDown = (highlighted) => {
    if (!searching) return;
    let current = {};
    inputRef.current.removeAttribute("aria-activedescendant");

    if (highlighted) {
      current = highlighted;
      current.setAttribute("aria-selected", false);
      current.classList.remove("highlighted");
      let next = current.nextElementSibling;
      next && next.classList.add("highlighted");
      next && next.setAttribute("aria-selected", true);
      next && inputRef.current.setAttribute("aria-activedescendant", next.id);
      highlighted = false;
    } else {
      current = suggestionRef.current.firstChild;
      current.classList.add("highlighted");
      current.setAttribute("aria-selected", true);
      inputRef.current.setAttribute("aria-activedescendant", current.id);
    }
  };

  const selectOptions = (highlighted) => {
    if (highlighted) {
      let search = inputRef.current;
      search.removeAttribute("aria-activedescendant");
      search.value = highlighted.innerText;
      setSearching(false);
      setSearchText(highlighted.innerText);
      clearOptions();
    } else {
      return;
    }
  };
  return (
    <>
      <div
        id={`${name}-announcement`}
        className="visually-hidden"
        aria-live="assertive"
        style={styles.announcement && styles.announcement}
      >
        {options && options.length > 0
          ? `${options.length} suggestions displayed.  To navigate, use up and down arrow keys.`
          : ""}
      </div>
      <div>
        <div
          id={`${name}-searchField`}
          role="combobox"
          aria-expanded={searching ? "true" : "false"}
          aria-owns={`${name}-input`}
          aria-haspopup="listbox"
          style={styles.combobox && styles.combobox}
        >
          <label
            htmlFor={`${name}-input`}
            style={styles.searchLabel && styles.searchLabel}
          >
            {name[0].toUpperCase() + name.slice(1)}
          </label>
          <input
            id={`${name}-input`}
            type="text"
            className="searchField"
            autoComplete="off"
            aria-autocomplete="both"
            ref={inputRef}
            onChange={doSearch}
            onKeyDown={doKeyPress}
            value={searchText}
            style={styles.searchField && styles.searchField}
          />
        </div>

        <div
          className="autocompleteSuggestions"
          id={`${name}-autocomplete`}
          style={
            styles.suggestionsContainer
              ? {
                  ...styles.suggestionsContainer,
                  display: searching ? "block" : "none",
                }
              : { display: searching ? "block" : "none" }
          }
        >
          {options.length > 0 && (
            <AutoSuggestOptions
              ref={suggestionRef}
              id={`${name}-autosuggest-options`}
              options={options}
              onClick={copyTextRemoveSuggestions}
              styles={styles}
              name={name}
            />
          )}
        </div>
      </div>
      {noResult && <p>No results found</p>}
      {error && <p>Results could not be fetched</p>}
    </>
  );
};
