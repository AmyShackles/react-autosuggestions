import React from "react";
import { AutoSuggestClient } from "./AutoSuggestClient.js";
import { AutoSuggestServer } from "./AutoSuggestServer.js";
import "../index.css";
import { defaultOptions } from "../utils/defaultOptions.js";

export const AutoSuggest = React.forwardRef(
  (
    {
      type = "",
      url = "",
      name = "Search",
      debounceTime = 400,
      styles = defaultOptions,
      options = [],
    },
    ref
  ) => {
    styles = {
      ...defaultOptions,
       ...styles,
       searchField: {
            ...defaultOptions.searchField,
         ...styles.searchField,
            focus: {
                   ...defaultOptions.searchField.focus,
                   ...styles.searchField.focus,
        },
      },
    };
    if (!type) {
      if (url) {
        type = "server";
      } else {
        type = "client";
      }
    }

    if (type === "server") {
      return (
        <AutoSuggestServer
          ref={ref}
          name={name}
          url={url}
          type="Server"
          debounceTime={debounceTime}
          styles={styles}
        />
      );
    }
    return (
      <AutoSuggestClient
        ref={ref}
        name={name}
        type="Client"
        options={options}
        styles={styles}
      />
    );
  }
);
