export const alphanumericSort = (options) => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  return options.sort(collator.compare);
};
