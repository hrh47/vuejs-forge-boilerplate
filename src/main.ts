import { createApp, provide, h } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/base.css";
import "@progress/kendo-theme-default/dist/all.css";
import { createPinia } from "pinia";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/graphql/apolloClient";
import TwicPics from "@twicpics/components/vue3";
import "@twicpics/components/style.css";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app
  .use(router)
  .use(createPinia())
  .use(TwicPics, {
    domain: `${import.meta.env.VITE_TWICPICS_URL}`,
  });

app.mount("#app");
