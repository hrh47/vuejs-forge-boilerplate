<template>
  <div>
    <AppPageHeading>
      {{ board.title }}
    </AppPageHeading>
    <BoardMenu
      :board="(board as Board)"
      @deleteBoard="deleteBoardIfConfirmed"
    />
    <BoardDragAndDrop
      :tasks="(tasks as Task[])"
      :board="(board as Board)"
      @update="updateBoard"
      :add-task="addTask"
    />
  </div>
</template>

<script setup lang="ts">
import AppPageHeading from "@/components/AppPageHeading.vue";
import BoardMenu from "@/components/BoardMenu.vue";
import BoardDragAndDrop from "@/components/BoardDragAndDrop.vue";
import type { Board, Task } from "@/types";
import { ref, toRefs } from "vue";
import { v4 as uuid } from "uuid";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { id: boardId } = toRefs(props);
const board = ref<Partial<Board>>({
  id: boardId?.value || "1",
  title: "Let's have an amazing time at Vue.js forge!! 🍍",
  order: JSON.stringify([
    { id: "1", title: "backlog 🌴", taskIds: ["1", "2"] },
  ]),
});
const tasks = ref<Partial<Task>[]>([
  { id: "1", title: "Code like mad people!" },
  { id: "2", title: "Push clean code" },
]);
const updateBoard = (b: Partial<Board>) => {
  board.value = b;
};
const addTask = async (task: Task) => {
  return new Promise<Task>((resolve) => {
    const taskWithId = { ...task, id: uuid() };
    tasks.value.push(taskWithId);
    resolve(taskWithId);
  });
};
const deleteBoardIfConfirmed = () => {
  console.info("delete board");
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
