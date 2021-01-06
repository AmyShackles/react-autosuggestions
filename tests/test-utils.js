import { render, queries } from "@testing-library/react";
import * as customQueries from "./customQueries.js";

const customRender = (ui, options) =>
  render(ui, { queries: { ...queries, ...customQueries }, ...options });

export * from "@testing-library/react";

export { customRender as render };
