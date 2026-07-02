import { baseColumns } from "./baseColumns";
import { getActionColumns } from "./actionColumns";

export const getColumns = (config) => {
  const { variant } = config;

  const actionCols = getActionColumns(config);

  if (variant === "full") {
    return [...actionCols, ...baseColumns];
  }

  return [...actionCols, ...baseColumns];
};