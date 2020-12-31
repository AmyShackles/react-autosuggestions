import React from "react";
import { useDebounce } from "../utils/useDebounce.js";
import { AutoSuggestContainer } from "../components/AutoSuggestContainer.js";
import "../index.css";

export const AutoSuggestServer = React.forwardRef(
  ({ url = "", name, debounceTime = 200, styles }, ref) => {
    const [options, setOptions] = React.useState([]);
    const [searchText, setSearchText] = React.useState("");
    const [searching, setSearching] = React.useState(false);
    const [errored, setErrored] = React.useState(false);
    const [noResult, setNoResult] = React.useState(false);
    const debouncedSearchText = useDebounce(searchText, debounceTime);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
      if (searching && searchText && debouncedSearchText) {
        fetch(`${url}/${encodeURIComponent(debouncedSearchText)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.length) {
              setSearching(true);
              setOptions(data);
              setNoResult(false);
            } else {
              setSearching(false);
              setOptions([]);
              setNoResult(true);
            }
          })
          .then(() => setLoading(false))
          .catch(() => setErrored(true));
      }
    }, [searching, searchText, debouncedSearchText, url]);
    React.useEffect(() => {
      if (searchText !== debouncedSearchText) {
        setLoading(true);
      }
    }, [debouncedSearchText, searchText]);
    React.useEffect(() => {
      if (searchText.length === 0 && options.length > 0) {
        setOptions([]);
        setSearching(false);
      }
    }, [searchText, options]);

    React.useEffect(() => {
      if (searching === false) {
        setOptions([]);
        setLoading(false);
      }
    }, [searching]);

    const handleInputChange = (value) => {
      setLoading(true);
      setSearchText(value);
    };

    if (url === "") {
      throw new Error("AutoSuggestServer requires a url parameter");
    } else {
      return (
        <AutoSuggestContainer
          ref={ref}
          name={name}
          options={options}
          error={errored}
          setSearchText={handleInputChange}
          searchText={searchText}
          searching={searching}
          setSearching={setSearching}
          noResult={noResult}
          styles={styles}
          loading={loading}
        />
      );
    }
  }
);
