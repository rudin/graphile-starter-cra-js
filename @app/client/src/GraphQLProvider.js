import React from "react"
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import ws from "ws";
import { getOperationAST } from "graphql";
import { SubscriptionClient } from "subscriptions-transport-ws";

let wsClient = null;

export function resetWebsocketConnection() {
  if (wsClient) {
    wsClient.close(false, false);
  }
}

function makeClientSideLink(ROOT_URL) {
  const httpLink = new HttpLink({
    uri: `${ROOT_URL}/graphql`,
    credentials: "same-origin",
  });
  wsClient = new SubscriptionClient(
    `${ROOT_URL.replace(/^http/, "ws")}/graphql`,
    {
      reconnect: true,
    },
    typeof WebSocket !== "undefined" ? WebSocket : ws
  );
  const wsLink = new WebSocketLink(wsClient);

  // Using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent.
  const mainLink = split(
    // split based on operation type
    ({ query, operationName }) => {
      const op = getOperationAST(query, operationName);
      return (op && op.operation === "subscription") || false;
    },
    wsLink,
    httpLink
  );
  return mainLink;
}

export default
  ({ initialState, children }) => {
    const ROOT_URL = process.env.REACT_APP_ROOT_URL;
    if (!ROOT_URL) {
      throw new Error("ROOT_URL envvar is not set");
    }

    const onErrorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: message: ${message}, location: ${JSON.stringify(
              locations
            )}, path: ${JSON.stringify(path)}`
          )
        );
      if (networkError) console.error(`[Network error]: ${networkError}`);
    });

    const mainLink = makeClientSideLink(ROOT_URL);

    const client = new ApolloClient({
      link: ApolloLink.from([onErrorLink, mainLink]),
      cache: new InMemoryCache().restore(initialState || {}),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>
  }
