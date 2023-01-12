<script setup lang="ts">
import TheDrawer from "@/components/TheDrawer.vue";
import TheNavbar from "@/components/TheNavbar.vue";
import TheAlerts from "@/components/TheAlerts.vue";
import { useAuthUserStore } from "@/stores/AuthUserStore";

const authUserStore = useAuthUserStore();
authUserStore.initUser();
</script>

<template>
  <TheNavbar />
  <TheDrawer />
  <TheAlerts />
</template>
