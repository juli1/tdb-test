import { GraphQLClient } from 'graphql-request';
import { API_TOKEN_HEADER_KEY, GRAPHQL_ENDPOINT_PROD, USER_AGENT_HEADER_KEY } from '../constants';
import { getApiToken } from './configuration';
// import { rollbarLogger } from "../utils/rollbarUtils";

let client: GraphQLClient;
let languageClientName: string | undefined;
let languageClientVersion: string | undefined;

/**
 * Initialize the GraphQL client that will be used
 * to perform all the GraphQL request.
 */
export function initializeClient(clientName: string | undefined, clientVersion: string | undefined): void {
  languageClientName = clientName;
  languageClientVersion = clientVersion;
  client = new GraphQLClient(GRAPHQL_ENDPOINT_PROD);
}

async function generateHeaders(): Promise<Record<string, string>> {
  const apiToken = await getApiToken();

  const userAgentHeader = {
    [USER_AGENT_HEADER_KEY]: `${languageClientName ?? ""}/${languageClientVersion || ""}`
  };

  //First, check if there is a token. If that is the case, prioritize its use.
  if (apiToken && apiToken.length > 20) {
    return {
      ...userAgentHeader,
      [API_TOKEN_HEADER_KEY]: apiToken,
    };
  }
  return {
    ...userAgentHeader,
  };
}

/**
 * That is the main function to perform a GraphQL query. This is the main function
 * being used across the codebase.
 * @param graphqlQuery
 * @returns
 */
export async function doQuery(
  graphqlQuery: string,
  variables: Record<
    string,
    string | undefined | null | number | boolean | string[]
  > = {}
) {
  const query = client
    .request(graphqlQuery, variables, await generateHeaders())
    .catch((e) => {
      console.log("exception when querying the GraphQL API");
      console.log(e);
      // ignore user-not-logged errors
      if (!e.message.includes("user-not-logged")) {
        // rollbarLogger(e, { variables });
      }
      return undefined;
    });
  return query;
}

/**
 * Similar than doQuery but for a mutation.
 * @param graphqlMutation - mutation to execute
 * @param variables - variable to pass
 * @returns - the result of the mutation or undefined if an error was raised.
 */
export async function doMutation(
  graphqlMutation: string,
  variables: Record<string, string | undefined | number | null> = {}
) {
  const query = client
    .request(graphqlMutation, variables, await generateHeaders())
    .catch((e) => {
      console.error("exception");
      console.debug(e);
      // rollbarLogger(e, { variables });
      return undefined;
    });
  return query;
}
