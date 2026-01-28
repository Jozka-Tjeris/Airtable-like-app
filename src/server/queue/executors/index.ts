import { type TableMutation } from "../mutationTypes";
import { executeAddColumn } from "./addColumn";
import { executeAddRow } from "./addRow";
import { executeDeleteColumn } from "./deleteColumn";
import { executeDeleteRow } from "./deleteRow";
import { executeRenameColumn } from "./renameColumn";
import { executeUpdateCells } from "./updateCells";

export async function executeMutation(mutation: TableMutation) {
  switch (mutation.type) {
    case "updateCells":
      return executeUpdateCells(mutation);
    case "addRow":
      return executeAddRow(mutation);
    case "addColumn":
      return executeAddColumn(mutation);
    case "deleteRow":
      return executeDeleteRow(mutation);
    case "deleteColumn":
      return executeDeleteColumn(mutation);
    case "renameColumn":
     return executeRenameColumn(mutation);
    default:
      throw new Error("Unknown mutation type");
  }
}
