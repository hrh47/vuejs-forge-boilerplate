<script setup lang="ts">
import { useAuthUserStore } from "@/stores/AuthUserStore";
import { useRouter } from "vue-router";
import AppLoader from "@/components/AppLoader.vue";

const auth = useAuthUserStore();
const router = useRouter();

auth.handleAuthentication().then(async () => {
  await auth.initUser();
  router.push("/");
});
</script>

<template>
  <div>
    <AppLoader :overlay="true" />
  </div>
</template>

<style scoped></style>
