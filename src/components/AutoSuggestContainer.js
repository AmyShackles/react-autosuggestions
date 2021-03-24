import React from "react";
import { AutoSuggestOptions } from "./AutoSuggestOptions.js";

export const AutoSuggestContainer = React.forwardRef(
    (
        {
            name,
            options,
            error = false,
            setSearchText,
            searchText = "",
            openListbox,
            setOpenListbox,
            clearText,
            noResult = false,
            styles,
            loading = false,
            setLoading = () => {},
            dataType,
            activeDescendant,
            setActiveDescendant,
            disabled
        },
        inputRef
    ) => {
        const keys = {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            UP: 38,
            DOWN: 40
        };
        const focusStyles = styles.searchField && styles.searchField.focus ? styles.searchField.focus : false;
        const suggestionRef = React.createRef();

        let label = `${name[0].toUpperCase()}${name.slice(1)}`;
        if (inputRef.current && focusStyles) {
            inputRef.current.addEventListener("focus", addInputFocusStyles);
            inputRef.current.addEventListener("blur", addInputBlurStyles);
        }
        function addInputFocusStyles(event) {
            focusStyles &&
                Object.entries(focusStyles).forEach(([key, value], index) => {
                    event.target.style[key] = value;
                });
        }
        function addInputBlurStyles(event) {
            focusStyles &&
                Object.entries(focusStyles).forEach(([key, value]) => {
                    event.target.style[key] = styles.searchField[key];
                });
        }

        const doSearch = (event) => {
            inputRef.current.focus();
            setSearchText(event.target.value);
            setOpenListbox(true);
        };

        const copyTextRemoveSuggestions = (event) => {
            setSearchText(event.target.getAttribute("textvalue"));
            setActiveDescendant(undefined);
            setOpenListbox(false);
            setLoading(false);
        };
        const doKeyPress = (event) => {
            let highlighted =
                suggestionRef.current &&
                [...suggestionRef.current.children].find((node) => node.id === activeDescendant);
            switch (event.which) {
                case keys.ESC:
                    setOpenListbox(false);
                    setLoading(false);
                    setActiveDescendant(undefined);
                    clearText();
                    break;

                case keys.TAB:
                case keys.RETURN:
                    setOpenListbox(false);
                    setLoading(false);
                    setActiveDescendant(undefined);
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

                case keys.DOWN:
                    event.preventDefault();
                    event.stopPropagation();
                    return moveDown(highlighted);

                default:
                    return;
            }
        };

        const moveUp = (highlighted) => {
            if (!openListbox) return;
            let current = highlighted;
            if (current && current.previousElementSibling) {
                let prev = current.previousElementSibling;
                prev && setActiveDescendant(prev.id);
                highlighted = false;
            } else {
                current = suggestionRef.current.lastChild;
                setActiveDescendant(current.id);
            }
        };

        const moveDown = (highlighted) => {
            if (!openListbox) return;
            let current = highlighted;

            if (current && current.nextElementSibling) {
                let next = current.nextElementSibling;
                next && setActiveDescendant(next.id);
                highlighted = false;
            } else {
                current = suggestionRef.current.firstChild;
                setActiveDescendant(current.id);
            }
        };

        const selectOptions = (highlighted) => {
            let text = highlighted.getAttribute("textvalue");
            setSearchText(text);
        };
        return (
            <>
                <div
                    id={`${name}-announcement`}
                    className="visually-hidden"
                    aria-live="polite"
                    data-type={dataType}
                    style={styles.announcement && styles.announcement}
                >
                    {openListbox && options && options.length > 0
                        ? `${options.length} suggestions displayed.  To navigate, use up and down arrow keys.`
                        : ""}
                </div>
                <div>
                    <div
                        id={`${name}-searchField`}
                        role="combobox"
                        aria-expanded={openListbox ? "true" : "false"}
                        aria-owns={`${name}-input`}
                        aria-haspopup="listbox"
                        aria-controls={`${name}-autosuggest-options`}
                        style={styles.combobox && styles.combobox}
                    >
                        <label id={`${name}-label`} style={styles.searchLabel && styles.searchLabel}>
                            {label}
                        </label>
                        <input
                            id={`${name}-input`}
                            type="text"
                            className={loading ? `loading searchfield` : "searchfield"}
                            autoComplete="off"
                            aria-autocomplete="both"
                            ref={inputRef}
                            onChange={doSearch}
                            onKeyDown={doKeyPress}
                            value={searchText}
                            aria-labelledby={`${name}-label`}
                            style={styles.searchField && styles.searchField}
                            aria-activedescendant={activeDescendant}
                            disabled={disabled ? true : false}
                        />
                    </div>
                    {loading && <p style={styles.announcement && styles.announcement}>Loading {label} options</p>}
                    <div
                        className="autocompleteSuggestions"
                        id={`${name}-autocomplete`}
                        style={
                            styles.suggestionsContainer
                                ? {
                                      ...styles.suggestionsContainer,
                                      display: openListbox ? "block" : "none"
                                  }
                                : { display: openListbox ? "block" : "none" }
                        }
                    >
                        {openListbox && options.length > 0 && (
                            <AutoSuggestOptions
                                ref={suggestionRef}
                                id={`${name}-autosuggest-options`}
                                options={options}
                                onClick={(e) => copyTextRemoveSuggestions(e)}
                                styles={styles}
                                name={name}
                                selected={activeDescendant}
                            />
                        )}
                    </div>
                </div>
                {noResult && <p>No results found</p>}
                {error && <p>Results could not be fetched</p>}
            </>
        );
    }
);
