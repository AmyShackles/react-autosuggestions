import { buildQueries, queryHelpers } from "@testing-library/react";

const queryAllByDataType = (...args) =>
  queryHelpers.queryAllByAttribute("data-type", ...args);
const getMultipleError = (c, dataTypeValue) =>
  `Found multiple elements with the data-type attribute of ${dataTypeValue}`;
const getMissingError = (c, dataTypeValue) =>
  `Unable to find an element with the data-type attribute of ${dataTypeValue}`;
const [
  queryByDataType,
  getAllByDataType,
  getByDataType,
  findAllByDataType,
  findByDataType,
] = buildQueries(queryAllByDataType, getMultipleError, getMissingError);

export {
  queryByDataType,
  queryAllByDataType,
  getByDataType,
  getAllByDataType,
  findAllByDataType,
  findByDataType,
};
