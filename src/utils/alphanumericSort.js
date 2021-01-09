export const alphanumericSortStrings = (options) => {
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base"
    });
    return options.sort(collator.compare);
};

export const alphanumericSortObjects = (options) => {
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base"
    });
    return options.sort((a, b) => collator.compare(a.value, b.value));
};

export const alphanumericSort = (options) => {
    if (!options[0]) return [options, ""];
    if (typeof options[0] === "string") {
        return [alphanumericSortStrings(options), "string"];
    }
    if (options[0].value) {
        return [alphanumericSortObjects(options), "object"];
    }
    return [options, ""];
};