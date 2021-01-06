import React from "react";
import { useDebounce } from "../utils/useDebounce.js";
import { AutoSuggestContainer } from "../components/AutoSuggestContainer.js";
import "../index.css";
import 'cross-fetch/polyfill';


export const AutoSuggestServer = React.forwardRef(
  ({ url="", name, debounceTime = 200, styles, type }, ref) => {
      const [options, setOptions] = React.useState([]);
      const [searchText, setSearchText] = React.useState();
      const [searching, setSearching] = React.useState(false);
      const [errored, setErrored] = React.useState(false);
      const [noResult, setNoResult] = React.useState(false);
      const debouncedSearchText = useDebounce(searchText, debounceTime);
      const [loading, setLoading] = React.useState(false);
      const [activeDescendant, setActiveDescendant] = React.useState();

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
                      setLoading(false);
                      setErrored(false);
                  })
                  .catch(() => {
                      setErrored(true);
                      setLoading(false);
                  });
          }
      }, [searching, searchText, debouncedSearchText, url]);

      const handleInputChange = (value) => {
          value && setLoading(true);
          setSearchText(value);
      };

      if (url === "") {
          throw new Error("AutoSuggestServer requires a url parameter");
      } else {
          return (
              <AutoSuggestContainer
                  dataType={type}
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
                  setLoading={setLoading}
                  activeDescendant={activeDescendant}
                  setActiveDescendant={setActiveDescendant}
                  clearText={() => setSearchText()}
              />
          );
      }
  }
);
