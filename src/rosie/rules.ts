import * as vscode from "vscode";
import * as fs from "fs";
import { Language } from "../graphql-api/types";
import { RuleSet } from "./rosieTypes";

const CODIGA_RULES_DEBUGFILE = ".codigadebug";

export const getRulesetsDebug = async (
  document: vscode.TextDocument,
  language: Language
): Promise<RuleSet[] | undefined> => {
  const ruleFile = await getRulesFile(
    document,
    CODIGA_RULES_DEBUGFILE,
    language
  );

  if (ruleFile) {
    try {
      const debugFileContent = await vscode.workspace.fs.readFile(ruleFile);

      const fileContent = debugFileContent.toString();
      const rulesJson = JSON.parse(fileContent);

      if (!rulesJson) {
        return undefined;
      }
      return rulesJson;
    } catch (err) {
      console.debug("error when trying to read the rules");
      return undefined;
    }
  }
  return undefined;
};

const getRulesFile = async (
  document: vscode.TextDocument,
  filename: string,
  language: Language
): Promise<vscode.Uri | undefined> => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length < 1) {
    return undefined;
  }

  // Get the workspace URI and Path
  const workspaceUri = workspaceFolders[0].uri;
  const workspacePath = workspaceFolders[0].uri.path;

  // Get the document path
  const documentPath = document.uri.path;
  // Find the path of the document relative to the project path
  const pathParths = documentPath.replace(workspacePath, "");

  // Let's have each directory for the parts.
  const parts: string[] | undefined = pathParths.split("/");

  // Let's remove the filename from the parts
  parts.pop();

  // Try each directory until we reach the top directory of the project.
  while (parts && parts.length > 0) {
    const filePath = parts.join("/");
    const potentialFile = vscode.Uri.joinPath(workspaceUri, filePath, filename);
    if (fs.existsSync(potentialFile.fsPath)) {
      return potentialFile;
    }
    parts.pop();
  }

  return undefined;
};
