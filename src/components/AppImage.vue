<script lang="ts" setup>
import { toRefs, computed } from "vue";

const props = defineProps<{
  src: string;
}>();
const { src } = toRefs(props);
const toTwicpicsURL = (url: string) => {
  return url.replace("https://cdn.filestackcontent.com/", "");
};
const twicpicsURL = computed(() => {
  const url = toTwicpicsURL(src.value);

  return url;
});
</script>

<template>
  <img v-if="src.startsWith('data:')" :src="src" alt="" />
  <TwicImg v-else :src="twicpicsURL" ratio="none" />
</template>
