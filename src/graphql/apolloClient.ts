import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { useAuthUserStore } from "@/stores/AuthUserStore";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "https://api.8base.com/cl5huk3aq00by09m6ck9heohe",
});

const setAuthorizationLink = setContext((request, previousContext) => {
  const store = useAuthUserStore();

  return store.authenticated
    ? {
        ...previousContext,
        headers: {
          authorization: `Bearer ${store.idToken}`,
        },
      }
    : previousContext;
});

const setErrorHandler = onError((error) => {
  const badToken = !!error.response?.errors?.find(
    (e: { code: string }) =>
      e.code === "TokenExpiredError" || e.code === "InvalidTokenError"
  );

  if (badToken) {
    const store = useAuthUserStore();
    store.login();
  }
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: setAuthorizationLink.concat(setErrorHandler).concat(httpLink),
  cache,
});
