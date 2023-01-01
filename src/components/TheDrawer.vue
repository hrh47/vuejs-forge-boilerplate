<template>
  <div>
    <Drawer
      class="h-[90vh]"
      :expanded="expanded"
      position="start"
      mode="push"
      :mini="true"
      :items="items"
      @select="onSelect"
    >
      <DrawerContent>
        <div class="p-5">
          <router-view />
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Drawer, DrawerContent } from "@progress/kendo-vue-layout";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";

const selectedId = ref(0);
const expanded = ref(useLocalStorage("vue-forge-drawer-expanded", true));
const expandedIcon = computed(() => {
  return expanded.value ? "k-i-arrow-chevron-left" : "k-i-arrow-chevron-right";
});
const items = computed(() =>
  [
    {
      text: "Boards",
      icon: "k-i-set-column-position",
      data: {
        path: "/boards",
      },
    },
    {
      text: "Templates",
      icon: "k-i-border-left",
      data: {
        path: "/templates",
      },
    },
    {
      text: "Settings",
      icon: "k-i-gear",
      data: {
        path: "/settings",
      },
    },
    {
      text: "Collapse",
      icon: expandedIcon.value,
      data: {
        action: () => (expanded.value = !expanded.value),
      },
    },
  ].map((item, index) => ({
    ...item,
    selected: index === selectedId.value,
  }))
);
const router = useRouter();
const onSelect = ({ itemIndex }: { itemIndex: number }) => {
  const item = items.value[itemIndex];
  if (item.data.path) {
    selectedId.value = itemIndex;
    router.push(item.data.path);
  }
  if (typeof item.data.action === "function") {
    item.data.action();
  }
};
</script>

<style scoped></style>
