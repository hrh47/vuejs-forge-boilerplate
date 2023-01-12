import { apolloClient } from "@/graphql/apolloClient";
import { authClient } from "@/helpers/8baseAuth";
import type { User } from "@/types";
import { defineStore } from "pinia";
import currentUserQuery from "@/graphql/queries/currentUser.query.gql";
import userSignUpMutation from "@/graphql/mutations/userSignUp.mutation.gql";

const localStorageKey = "id_token";
const idToken = localStorage.getItem(localStorageKey);

export const useAuthUserStore = defineStore("AuthUserStore", {
  state: () => {
    return {
      authenticated: !!idToken,
      idToken,
      user: null as User | null,
    };
  },
  actions: {
    login() {
      authClient.authorize();
    },
    async initUser() {
      if (!this.idToken) return;
      try {
        const res = await this.fetchUser(this.idToken as string);
        this.user = res.data.user;
      } catch (error) {
        console.error("no existing user matching id token");
      }
    },
    fetchUser(idToken: string) {
      const context = {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      };

      return apolloClient.query({
        query: currentUserQuery,
        context,
      });
    },
    logout() {
      authClient.logout();
      this.authenticated = false;
      this.idToken = null;
      localStorage.removeItem(localStorageKey);
    },
    async handleAuthentication() {
      const authResult = await authClient.getAuthorizedData();

      try {
        await apolloClient.mutate({
          mutation: userSignUpMutation,
          variables: {
            user: {
              email: authResult.email,
              firstName: authResult.firstName,
              lastName: authResult.lastName,
              team: {
                create: {
                  name: `${authResult.firstName}'s team`,
                },
              },
            },
            authProfileId: import.meta.env.VITE_AUTH_PROFILE_ID,
          },
          context: {
            headers: {
              authorization: `Bearer ${authResult.idToken}`,
            },
          },
        });
      } catch {
        window.location.pathname = "/";
      }

      this.authenticated = true;
      this.idToken = authResult.idToken;
      localStorage.setItem(localStorageKey, authResult.idToken);
    },
  },
});
