import * as React from "react";
import { useState } from "react";
import {
  VSCodeButton,
  VSCodeProgressRing,
  VSCodeTag,
  VSCodeLink,
} from "@vscode/webview-ui-toolkit/react";

import { AssistantRecipe, Language } from "../graphql-api/types";

interface SnippetsProps {
  vsCodeApi: any;
  snippets: AssistantRecipe[];
  language: Language;
  loading: boolean;
}

export const Snippets = (props: SnippetsProps) => {
  if (props.loading === true) {
    return (
      <div
        style={{
          padding: "2em",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <VSCodeProgressRing />
      </div>
    );
  }
  if (props.snippets.length === 0) {
    return <div>No snippets</div>;
  }

  const insertSnippet = (snippet: AssistantRecipe) => {
    props.vsCodeApi.postMessage({
      command: "insertSnippet",
      snippet: snippet,
    });
  };

  const addPreviewSnippet = (snippet: AssistantRecipe) => {
    props.vsCodeApi.postMessage({
      command: "addPreviewSnippet",
      snippet: snippet,
    });
  };

  const deletePreviewSnippet = (snippet: AssistantRecipe) => {
    props.vsCodeApi.postMessage({
      command: "removePreviewSnippet",
      snippet: snippet,
    });
  };

  const SnippetButton = (props: { snippet: AssistantRecipe }) => {
    const [buttonText, setButtonText] = useState<string>("Preview");
    return (
      <VSCodeButton
        style={{ minWidth: "10em" }}
        type="button"
        onClick={(e) => {
          e.preventDefault;
          insertSnippet(props.snippet);
        }}
        onMouseOver={(e) => {
          e.preventDefault;
          addPreviewSnippet(props.snippet);
          setButtonText("Insert");
        }}
        onMouseOut={(e) => {
          e.preventDefault;
          deletePreviewSnippet(props.snippet);
          setButtonText("Preview");
        }}
      >
        {buttonText}
      </VSCodeButton>
    );
  };

  return (
    <>
      {props.snippets.map((snippet) => (
        <div key={`snippet-${snippet.id}`}>
          <h3>{snippet.name}</h3>
          {snippet.isPublic === true && <p>Public</p>}
          {snippet.isPublic === false && <p>Private</p>}

          {snippet.shortcut && <pre>{snippet.shortcut}</pre>}

          {snippet.isPublic === true && (
            <VSCodeLink
              href={`https://app.codiga.io/hub/recipe/${snippet.id}/view`}
            >
              See on Codiga
            </VSCodeLink>
          )}
          {snippet.isPublic === false && (
            <VSCodeLink
              href={`https://app.codiga.io/assistant/recipe/${snippet.id}/view`}
            >
              See on Codiga
            </VSCodeLink>
          )}
          <SnippetButton snippet={snippet} />

          <pre>
            <code>{atob(snippet.presentableFormat)}</code>
          </pre>
        </div>
      ))}
    </>
  );
};
