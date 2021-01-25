import React from "react";

function useDebounce(value, delay, isOpen) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(
          () => {
                // Update debounced value after delay
                const handler = setTimeout(() => {
                      setDebouncedValue(value);
                }, delay);

                // Cancel the timeout if value changes (also on delay change or unmount)
                // This is how we prevent debounced value from updating if value is changed ...
                // .. within the delay period. Timeout gets cleared and restarted.
                return () => {
                      clearTimeout(handler);
                };
          },
          [value, delay, isOpen] // Only re-call effect if value or delay changes
    );

    if (isOpen) {
            return debouncedValue;
    } else {
            return "";;;
    }
}

export { useDebounce };
