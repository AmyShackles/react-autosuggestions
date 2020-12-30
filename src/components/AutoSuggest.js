import React from "react";
import { useDebounce } from "../utils/useDebounce.js";
import { AutoSuggestContainer } from "../components/AutoSuggestContainer.js";
import "../index.css";

export const AutoSuggest = ({
  url = "",
  name = "Search",
  debounceTime = 500,
  styles = {
    announcement: {
      position: "absolute",
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: "1px",
      width: "1px",
      overflow: "hidden",
    },
    combobox: {
      display: "inline-block",
    },
    searchField: {
      padding: ".5rem",
      border: "2px solid #c8c8c8",
      backgroundColor: "#fff",
      borderRadius: "6px",
      color: "#000",
      fontWeight: "normal",
      fontSize: "1.35rem",
      margin: "0 auto",
      width: "19rem",
      focus: {
        color: "#000",
        border: "2px solid #005499",
        outline: "none",
      },
    },
    searchLabel: {
      display: "block",
      fontSize: "1.35rem",
    },
    suggestionsContainer: {
      display: "block",
      position: "absolute",
      border: "1px solid #999",
      background: "#fff",
      width: "20rem",
    },
    suggestionOptions: {
      margin: "0",
      padding: "0",
      listStyle: "none",
    },
    suggestionOption: {
      margin: "0",
      padding: ".5rem",
      fontSize: "1.35rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      cursor: "default",
    },
  },
}) => {
  const [options, setOptions] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [errored, setErrored] = React.useState(false);
  const [noResult, setNoResult] = React.useState(false);
  const debouncedSearchText = useDebounce(searchText, debounceTime);

  React.useEffect(() => {
    if (
      searching &&
      searchText &&
      debouncedSearchText &&
      debouncedSearchText.length >= 2
    ) {
      fetch(`${url}/${encodeURIComponent(debouncedSearchText)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length) {
            setSearching(true);
            setOptions(data);
          } else {
            setSearching(false);
            setOptions([]);
            setNoResult(true);
          }
        })
        .catch((err) => setErrored(true));
    }
  }, [setOptions, debouncedSearchText]);

  React.useEffect(() => {
    if (searchText.length === 0 && options.length > 0) {
      setOptions([]);
      setSearching(false);
    }
  }, [searchText, options]);

  React.useEffect(() => {
    if (searching === false) {
      setOptions([]);
    }
  }, [searching]);

  const handleInputChange = (value) => {
    setSearchText(value);
  };
  return (
    <AutoSuggestContainer
      name={name}
      options={options}
      error={errored}
      setSearchText={handleInputChange}
      searchText={searchText}
      searching={searching}
      setSearching={setSearching}
      clearOptions={() => setOptions([])}
      noResult={noResult}
      styles={styles}
    />
  );
};
