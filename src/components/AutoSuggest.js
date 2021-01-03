import React from "react";
import { AutoSuggestClient } from "./AutoSuggestClient.js";
import { AutoSuggestServer } from "./AutoSuggestServer.js";
import "../index.css";

export const AutoSuggest = React.forwardRef(
  (
    {
      type = "",
      url = "",
      name = "Search",
      debounceTime = 400,
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
      options = [],
    },
    ref
  ) => {
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
