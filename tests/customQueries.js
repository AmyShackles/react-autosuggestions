import { buildQueries, queryHelpers } from "@testing-library/react";

const queryAllByDataType = (...args) =>
  queryHelpers.queryAllByAttribute("data-type", ...args);

const queryAllById = (...args) => queryHelpers.queryAllByAttribute("id", ...args);
const getMultipleError = (c, val) => `Found multiple elements with the data-type attribute of ${val}`;
const getMissingError = (c, val) => `Unable to find an element with the data-type attribute of ${val}`;

  
const [
  queryByDataType,
  getAllByDataType,
  getByDataType,
  findAllByDataType,
  findByDataType,
] = buildQueries(queryAllByDataType, getMultipleError, getMissingError);

const [queryById, getAllById, getById, findAllById, findById] = buildQueries(
    queryAllById,
    getMultipleError,
    getMissingError
);

export {
    queryByDataType,
    queryAllByDataType,
    getByDataType,
    getAllByDataType,
    findAllByDataType,
    findByDataType,
    queryById,
    getAllById,
    getById,
    findAllById,
    findById
};
