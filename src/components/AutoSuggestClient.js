import React from "react";
import { AutoSuggestContainer } from "./AutoSuggestContainer.js";

export const AutoSuggestClient = React.forwardRef(
  ({ name = "", options = [], styles = {} }, ref) => {
    const [searching, setSearching] = React.useState(false);
    const [searchText, setSearchText] = React.useState("");
    const [results, setResults] = React.useState(options);
    const [noResult, setNoResult] = React.useState(false);

    React.useEffect(() => {
      if (searching && searchText) {
        let res = options.filter((opt) => opt.startsWith(searchText));
        setResults(res);
        if (res.length >= 1) {
          setSearching(true);
        } else {
          setResults([]);
          setNoResult(true);
        }
      }
    }, [searchText, searching, options]);

    React.useEffect(() => {
      if (searching === false) {
        setResults([]);
        setNoResult(false);
      }
    }, [searching]);

    const handleInputChange = (value) => {
      setSearchText(value);
    };

    return (
      <AutoSuggestContainer
        ref={ref}
        name={name}
        options={results}
        searching={searching}
        searchText={searchText}
        setSearching={setSearching}
        setSearchText={handleInputChange}
        styles={styles}
        type="client"
        noResult={noResult}
      />
    );
  }
);
