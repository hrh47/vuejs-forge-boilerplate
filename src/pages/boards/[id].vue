<template>
  <div>
    <BoardDragAndDrop :tasks="tasks" :board="board" @update="updateBoard" />
    <details>
      <pre>
        {{ board }}
      </pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import BoardDragAndDrop from "@/components/BoardDragAndDrop.vue";
import { ref, toRefs } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { id: boardId } = toRefs(props);
const board = ref({
  id: boardId.value,
  title: "Let's have an amazing time at Vue.js forge!! 🍍",
  order: JSON.stringify([
    { id: "1", title: "backlog 🌴", taskIds: ["1", "2"] },
  ]),
});
const tasks = ref([
  { id: "1", title: "Code like mad people!" },
  { id: "2", title: "Push clean code" },
]);
const updateBoard = (b) => {
  board.value = b;
};
</script>

<style scoped>
pre {
  width: 400px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
