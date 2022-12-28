<template>
  <div class="p-5 bg-white">
    {{ task }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  task: Object,
});
</script>

<style scoped></style>
